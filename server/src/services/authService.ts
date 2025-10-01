import { pool } from "../config/database";
import { auth } from "../config/firebase";
import {
	UserRegisterInput,
	UserLoginInput,
	UserData,
	AuthResponse,
} from "../types/user";
import * as admin from "firebase-admin";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class AuthService {
    async registerUser(userData: UserRegisterInput): Promise<AuthResponse> {
        const connection = await pool.getConnection();

        try {
            // Step 1: Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email: userData.email,
                password: userData.password,
                displayName: userData.username || null,
            });

            // Step 2: Generate custom token for the user
            const token = await auth.createCustomToken(userRecord.uid);

            // Step 3: Store user in MySQL database
            const emailVerifiedAt = userRecord.emailVerified ? new Date() : null;

            const [result] = await connection.query<RowDataPacket[]>(
                `INSERT INTO users (email,
                                    username,
                                    photo_url,
                                    email_verified_at,
                                    status,
                                    firebase_uid)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    userRecord.email,
                    userRecord.displayName || null,
                    userRecord.photoURL || null,
                    emailVerifiedAt,
                    "active",
                    userRecord.uid,
                ]
            );

            // Step 4: Retrieve the created user
            const [users] = await connection.query<RowDataPacket[]>(
                "SELECT * FROM users WHERE id = ?",
                [userRecord.uid],
            );

            const dbUser = users[0] as UserData;

            return {
                success: true,
                message: "User registered successfully",
                data: {
                    user: dbUser,
                    token,
                },
            };
        } catch (error: any) {
            console.error("❌ Error registering user:", error);
            return {
                success: false,
                message: "Failed to register user",
                error: error.message,
            };
        } finally {
            connection.release();
        }
    }

    // Login user (using Firebase custom tokens)
    async loginUser(credentials: UserLoginInput): Promise<AuthResponse> {
        const connection = await pool.getConnection();

        try {
            // Step 1: Get user by email from Firebase
            const userRecord = await auth.getUserByEmail(credentials.email);

            // Step 2: Generate custom token
            const token = await auth.createCustomToken(userRecord.uid);

            // Step 3: Update last login in MySQL
            await connection.query(
                "UPDATE users SET updated_at = NOW() WHERE firebase_uid = ?",
                [userRecord.uid]
            );

            // Step 4: Get user data from MySQL
            const [users] = await connection.query<RowDataPacket[]>(
                "SELECT * FROM users WHERE firebase_uid = ?",
                [userRecord.uid]
            );

            if (!users || users.length === 0) {
                throw new Error("User exists in Firebase but not in database");
            }

            const dbUser = users[0] as UserData;

            return {
                success: true,
                message: "User logged in successfully",
                data: {
                    user: dbUser,
                    token,
                },
            };
        } catch (error: any) {
            console.error("❌ Error logging in user:", error);
            return {
                success: false,
                message: "Invalid email or password",
                error: error.message,
            };
        } finally {
            connection.release();
        }
    }

    // Verify token and get user data
    async verifyToken(token: string): Promise<AuthResponse> {
        const connection = await pool.getConnection();

        try {
            const decodedToken = await auth.verifyIdToken(token);

            // Get user from database
            const [users] = await connection.query<RowDataPacket[]>(
                "SELECT * FROM users WHERE firebase_uid = ?",
                [decodedToken.uid]
            );

            if (!users || users.length === 0) {
                throw new Error("User not found in database");
            }

            const dbUser = users[0] as UserData;

            return {
                success: true,
                message: "Token verified successfully",
                data: {
                    user: dbUser,
                },
            };
        } catch (error: any) {
            console.error("❌ Error verifying token:", error);
            return {
                success: false,
                message: "Invalid or expired token",
                error: error.message,
            };
        } finally {
            connection.release();
        }
    }

    // Get user by ID
    async getUserById(id: number): Promise<UserData | null> {
        const connection = await pool.getConnection();

        try {
            const [users] = await connection.query<RowDataPacket[]>(
                "SELECT * FROM users WHERE id = ?",
                [id]
            );

            return users && users.length > 0 ? (users[0] as UserData) : null;
        } catch (error) {
            console.error("❌ Error fetching user:", error);
            return null;
        } finally {
            connection.release();
        }
    }

    // Update user profile
    async updateUserProfile(
        id: number,
        userData: Partial<UserData>
    ): Promise<AuthResponse> {
        const connection = await pool.getConnection();

        try {
            // First, get the existing user to get their firebase_uid
            const [users] = await connection.query<RowDataPacket[]>(
                "SELECT * FROM users WHERE id = ?",
                [id]
            );

            if (!users || users.length === 0) {
                return {
                    success: false,
                    message: "User not found",
                    error: "User not found in database",
                };
            }

            const existingUser = users[0] as UserData;

            // Update in MySQL
            await connection.query(
                `UPDATE users
                 SET username   = ?,
                     photo_url  = ?,
                     status     = ?,
                     updated_at = NOW()
                 WHERE id = ?`,
                [
                    userData.username || existingUser.username,
                    userData.photo_url || existingUser.photo_url,
                    userData.status || existingUser.status,
                    id,
                ]
            );

            // Also update in Firebase if needed
            if (userData.username || userData.photo_url) {
                await auth.updateUser(existingUser.firebase_uid!, {
                    displayName: userData.username,
                    photoURL: userData.photo_url,
                });
            }

            // Get updated user
            const [updatedUsers] = await connection.query<RowDataPacket[]>(
                "SELECT * FROM users WHERE id = ?",
                [id]
            );

            return {
                success: true,
                message: "User profile updated successfully",
                data: {
                    user: updatedUsers[0] as UserData,
                },
            };
        } catch (error: any) {
            console.error("❌ Error updating user profile:", error);
            return {
                success: false,
                message: "Failed to update user profile",
                error: error.message,
            };
        } finally {
            connection.release();
        }
    }

    async deleteUser(id: number): Promise<AuthResponse> {
        const connection = await pool.getConnection();

        try {
            // Get the Firebase UID first
            const [users] = await connection.query<RowDataPacket[]>(
                "SELECT firebase_uid FROM users WHERE id = ?",
                [id]
            );

            if (!users || users.length === 0) {
                return {
                    success: false,
                    message: "User not found",
                    error: "User not found in database",
                };
            }

            const firebaseUid = users[0].firebase_uid;

            // Delete from MySQL
            await connection.query("DELETE FROM users WHERE id = ?", [id]);

            // Delete from Firebase
            await auth.deleteUser(firebaseUid);

            return {
                success: true,
                message: "User deleted successfully",
            };
        } catch (error: any) {
            console.error("❌ Error deleting user:", error);
            return {
                success: false,
                message: "Failed to delete user",
                error: error.message,
            };
        } finally {
            connection.release();
        }
    }

    // Helper function to map Firebase user to our user structure
    // private mapUserData(userRecord: admin.auth.UserRecord): UserData {
    //     return {
    //         firebase_uid: userRecord.uid,
    //         email: userRecord.email || "",
    //         displayName: userRecord.displayName || undefined,
    //         photoUrl: userRecord.photoURL || undefined,
    //         emailVerified: userRecord.emailVerified,
    //     };
    // }

    // Helper function to map Firebase user to our user structure
    private mapUserData(userRecord: admin.auth.UserRecord): UserData {
        return {
            firebase_uid: userRecord.uid,
            email: userRecord.email || "",
            username: userRecord.displayName || undefined,
            photo_url: userRecord.photoURL || undefined,
            email_verified_at: userRecord.emailVerified ? new Date() : undefined,
        };
    }
}
