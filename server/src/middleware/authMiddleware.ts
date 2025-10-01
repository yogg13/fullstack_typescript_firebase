import { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "../config/firebase";
import { pool } from "../config/database";

// Extend FastifyRequest to include user property
declare module "fastify" {
	interface FastifyRequest {
		user?: {
			id: number;
			email: string;
			firebase_uid?: string;
		};
		token?: string;
	}
}

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const authHeader = request.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new Error("No token provided");
		}

		const token = authHeader.split(" ")[1];

		try {
			const decodedToken = await auth.verifyIdToken(token);

			// Get user from MySQL using Firebase UID
			const connection = await pool.getConnection();
			try {
				const [users] = await connection.query(
					"SELECT id, email, firebase_uid FROM users WHERE firebase_uid = ?",
					[decodedToken.uid]
				) as [Array<{ id: number; email: string; firebase_uid: string }>, any];

				if (!users || users.length === 0) {
					throw new Error("User not found in database");
				}

				request.user = users[0] as {
					id: number;
					email: string;
					firebase_uid: string;
				};
				request.token = token;
			} finally {
				connection.release();
			}
		} catch (error) {
			throw new Error("Invalid or expired token");
		}
	} catch (error: any) {
		reply.code(401).send({
			success: false,
			message: "Authentication required",
			error: error.message,
		});
	}
}
