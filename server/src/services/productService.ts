import { pool } from "../config/database";
import { logToFirebase } from "../config/firebase";
import {
	Product,
	CreateProductInput,
	UpdateProductInput,
	ProductLog,
} from "../types/product";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class ProductService {
	// CREATE - Membuat produk baru
	async createProduct(productData: CreateProductInput): Promise<Product> {
		const connection = await pool.getConnection();

		try {
			const [result] = await connection.execute<ResultSetHeader>(
				"INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
				[productData.name, productData.price, productData.stock]
			);

			const newProductId = result.insertId;

			// Ambil data produk yang baru dibuat
			const [rows] = await connection.execute<RowDataPacket[]>(
				"SELECT * FROM products WHERE id = ?",
				[newProductId]
			);

			const newProduct = rows[0] as Product;

			// **INTEGRASI FIREBASE: Kirim log setelah produk berhasil dibuat**
			const logData: ProductLog = {
				action: "CREATE_PRODUCT",
				productId: newProductId,
				productName: newProduct.name,
				timestamp: new Date().toISOString(),
			};

			// Kirim log ke Firebase (tidak mengganggu flow utama jika gagal)
			await logToFirebase(logData).catch((error) =>
				console.error("Warning: Gagal mengirim log ke Firebase:", error)
			);

			return newProduct;
		} finally {
			connection.release();
		}
	}

	// READ - Mendapatkan semua produk
	async getAllProducts(): Promise<Product[]> {
		const connection = await pool.getConnection();

		try {
			const [rows] = await connection.execute<RowDataPacket[]>(
				"SELECT * FROM products ORDER BY updated_at DESC"
			);

			return rows as Product[];
		} finally {
			connection.release();
		}
	}

	// READ - Mendapatkan produk berdasarkan ID
	async getProductById(id: number): Promise<Product | null> {
		const connection = await pool.getConnection();

		try {
			const [rows] = await connection.execute<RowDataPacket[]>(
				"SELECT * FROM products WHERE id = ?",
				[id]
			);

			return rows.length > 0 ? (rows[0] as Product) : null;
		} finally {
			connection.release();
		}
	}

	// UPDATE - Memperbarui produk
	async updateProduct(
		id: number,
		updateData: UpdateProductInput
	): Promise<Product | null> {
		const connection = await pool.getConnection();

		try {
			// Ambil data produk sebelum update untuk log
			const existingProduct = await this.getProductById(id);
			if (!existingProduct) {
				return null;
			}

			// Build query dinamis berdasarkan field yang akan diupdate
			const updateFields: string[] = [];
			const updateValues: any[] = [];

			if (updateData.name !== undefined) {
				updateFields.push("name = ?");
				updateValues.push(updateData.name);
			}
			if (updateData.price !== undefined) {
				updateFields.push("price = ?");
				updateValues.push(updateData.price);
			}
			if (updateData.stock !== undefined) {
				updateFields.push("stock = ?");
				updateValues.push(updateData.stock);
			}

			if (updateFields.length === 0) {
				return existingProduct; // Tidak ada yang diupdate
			}

			updateValues.push(id); // Untuk WHERE clause

			await connection.execute(
				`UPDATE products SET ${updateFields.join(", ")} WHERE id = ?`,
				updateValues
			);

			// Ambil data produk yang sudah diupdate
			const updatedProduct = await this.getProductById(id);

			if (updatedProduct) {
				// **INTEGRASI FIREBASE: Kirim log setelah produk berhasil diupdate**
				const logData: ProductLog = {
					action: "UPDATE_PRODUCT",
					productId: id,
					productName: updatedProduct.name,
					timestamp: new Date().toISOString(),
				};

				// Kirim log ke Firebase
				await logToFirebase(logData).catch((error) =>
					console.error("Warning: Gagal mengirim log ke Firebase:", error)
				);
			}

			return updatedProduct;
		} finally {
			connection.release();
		}
	}

	// DELETE - Menghapus produk
	async deleteProduct(
		id: number,
		user?: { id: string; email: string }
	): Promise<boolean> {
		const connection = await pool.getConnection();

		try {
			// Ambil data produk sebelum dihapus untuk log
			const existingProduct = await this.getProductById(id);
			if (!existingProduct) {
				return false;
			}

			const [result] = await connection.execute<ResultSetHeader>(
				"DELETE FROM products WHERE id = ?",
				[id]
			);

			const isDeleted = result.affectedRows > 0;

			if (isDeleted) {
				// **INTEGRASI FIREBASE: Kirim log setelah produk berhasil dihapus**
				const logData: ProductLog = {
					action: "DELETE_PRODUCT",
					productId: id,
					productName: existingProduct.name,
					timestamp: new Date().toISOString(),
					userId: user?.id, // Add this
					userEmail: user?.email, // Add this
				};

				// Kirim log ke Firebase
				await logToFirebase(logData).catch((error) =>
					console.error("Warning: Gagal mengirim log ke Firebase:", error)
				);
			}

			return isDeleted;
		} finally {
			connection.release();
		}
	}
}
