import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "fastify_tutorial",
};

// Membuat connection pool untuk efisiensi
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fungsi untuk test koneksi
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database terhubung dengan sukses");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Gagal terhubung ke database:", error);
    return false;
  }
}
