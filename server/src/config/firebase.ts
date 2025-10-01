import * as admin from "firebase-admin";
import dotenv from "dotenv";
import { ProductLog } from "../types/product";

dotenv.config();

// Validasi environment variables
const requiredEnvVars = [
	"FIREBASE_PROJECT_ID",
	"FIREBASE_CLIENT_EMAIL",
	"FIREBASE_PRIVATE_KEY",
];
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`❌ Missing required environment variable: ${envVar}`);
	}
}

// Get Firebase region (default to us-central1 if not specified)
const firebaseRegion = process.env.FIREBASE_DATABASE_REGION || "us-central1";

// Construct database URL based on region
const getDatabaseURL = (projectId: string, region: string) => {
	if (region === "us-central1") {
		// Default region uses shorter URL
		return `https://${projectId}-default-rtdb.firebaseio.com`;
	} else {
		// Other regions use region-specific URL
		return `https://${projectId}-default-rtdb.${region}.firebasedatabase.app`;
	}
};

// Inisialisasi Firebase Admin SDK
const serviceAccount: admin.ServiceAccount = {
	projectId: process.env.FIREBASE_PROJECT_ID as string,
	clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
	privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") as string,
};

// Inisialisasi Firebase App jika belum ada
if (!admin.apps.length) {
	const projectId = process.env.FIREBASE_PROJECT_ID as string;
	const databaseURL = getDatabaseURL(projectId, firebaseRegion);

	console.log(`🔥 Initializing Firebase with region: ${firebaseRegion}`);
	console.log(`🔗 Database URL: ${databaseURL}`);

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: databaseURL,
	});
}

export const firebaseDB: admin.database.Database = admin.database();
export const firestoreDB: admin.firestore.Firestore = admin.firestore();
export const auth: admin.auth.Auth = admin.auth();

// Fungsi untuk mengirim log ke Firebase Realtime Database
export async function logToFirebase(logData: ProductLog): Promise<boolean> {
	try {
		const logsRef = firebaseDB.ref("product_logs");
		await logsRef.push(logData);
		console.log("✅ Log berhasil dikirim ke Firebase:", logData.action);
		return true;
	} catch (error) {
		console.error("❌ Gagal mengirim log ke Firebase:", error);
		return false;
	}
}

// Alternative: Fungsi untuk mengirim log ke Firestore
export async function logToFirestore(logData: ProductLog): Promise<boolean> {
	try {
		await firestoreDB.collection("product_logs").add(logData);
		console.log("✅ Log berhasil dikirim ke Firestore:", logData.action);
		return true;
	} catch (error) {
		console.error("❌ Gagal mengirim log ke Firestore:", error);
		return false;
	}
}

// Fungsi untuk test Firebase connection
export async function testFirebaseConnection(): Promise<boolean> {
	try {
		console.log(`🔥 Testing Firebase connection to region: ${firebaseRegion}`);

		const testRef = firebaseDB.ref("connection_test");
		const testData = {
			timestamp: new Date().toISOString(),
			status: "connected",
			region: firebaseRegion,
			projectId: process.env.FIREBASE_PROJECT_ID,
		};

		await testRef.set(testData);
		console.log("✅ Firebase Realtime Database connected successfully");

		// Clean up test data
		await testRef.remove();

		return true;
	} catch (error) {
		console.error("❌ Failed to connect to Firebase:", error);

		// Provide helpful error messages
		if (error instanceof Error) {
			if (error.message.includes("different region")) {
				console.log(
					"💡 Hint: Check your FIREBASE_DATABASE_REGION environment variable"
				);
			} else if (error.message.includes("Permission denied")) {
				console.log(
					"💡 Hint: Check your Firebase database rules and service account permissions"
				);
			}
		}

		return false;
	}
}
