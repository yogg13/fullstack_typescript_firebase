"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.dbConfig = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "fastify_tutorial",
};
// Membuat connection pool untuk efisiensi
exports.pool = promise_1.default.createPool({
    ...exports.dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Fungsi untuk test koneksi
async function testDatabaseConnection() {
    try {
        const connection = await exports.pool.getConnection();
        console.log("✅ Database terhubung dengan sukses");
        connection.release();
        return true;
    }
    catch (error) {
        console.error("❌ Gagal terhubung ke database:", error);
        return false;
    }
}
//# sourceMappingURL=database.js.map