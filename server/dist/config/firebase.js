"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestoreDB = exports.firebaseDB = void 0;
exports.logToFirebase = logToFirebase;
exports.logToFirestore = logToFirestore;
exports.testFirebaseConnection = testFirebaseConnection;
const admin = __importStar(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Validasi environment variables
const requiredEnvVars = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`❌ Missing required environment variable: ${envVar}`);
    }
}
// Inisialisasi Firebase Admin SDK
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};
// Inisialisasi Firebase App jika belum ada
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
    });
}
exports.firebaseDB = admin.database();
exports.firestoreDB = admin.firestore();
// Fungsi untuk mengirim log ke Firebase Realtime Database
async function logToFirebase(logData) {
    try {
        const logsRef = exports.firebaseDB.ref("product_logs");
        await logsRef.push(logData);
        console.log("✅ Log berhasil dikirim ke Firebase:", logData.action);
        return true;
    }
    catch (error) {
        console.error("❌ Gagal mengirim log ke Firebase:", error);
        return false;
    }
}
// Alternative: Fungsi untuk mengirim log ke Firestore
async function logToFirestore(logData) {
    try {
        await exports.firestoreDB.collection("product_logs").add(logData);
        console.log("✅ Log berhasil dikirim ke Firestore:", logData.action);
        return true;
    }
    catch (error) {
        console.error("❌ Gagal mengirim log ke Firestore:", error);
        return false;
    }
}
// Fungsi untuk test Firebase connection
async function testFirebaseConnection() {
    try {
        const testRef = exports.firebaseDB.ref("test");
        await testRef.set({
            timestamp: new Date().toISOString(),
            status: "connected",
        });
        console.log("✅ Firebase terhubung dengan sukses");
        return true;
    }
    catch (error) {
        console.error("❌ Gagal terhubung ke Firebase:", error);
        return false;
    }
}
//# sourceMappingURL=firebase.js.map