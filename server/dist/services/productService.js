"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const database_1 = require("../config/database");
const firebase_1 = require("../config/firebase");
class ProductService {
    // CREATE - Membuat produk baru
    async createProduct(productData) {
        const connection = await database_1.pool.getConnection();
        try {
            const [result] = await connection.execute("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", [productData.name, productData.price, productData.stock]);
            const newProductId = result.insertId;
            // Ambil data produk yang baru dibuat
            const [rows] = await connection.execute("SELECT * FROM products WHERE id = ?", [newProductId]);
            const newProduct = rows[0];
            // **INTEGRASI FIREBASE: Kirim log setelah produk berhasil dibuat**
            const logData = {
                action: "CREATE_PRODUCT",
                productId: newProductId,
                productName: newProduct.name,
                timestamp: new Date().toISOString(),
            };
            // Kirim log ke Firebase (tidak mengganggu flow utama jika gagal)
            await (0, firebase_1.logToFirebase)(logData).catch((error) => console.error("Warning: Gagal mengirim log ke Firebase:", error));
            return newProduct;
        }
        finally {
            connection.release();
        }
    }
    // READ - Mendapatkan semua produk
    async getAllProducts() {
        const connection = await database_1.pool.getConnection();
        try {
            const [rows] = await connection.execute("SELECT * FROM products ORDER BY created_at DESC");
            return rows;
        }
        finally {
            connection.release();
        }
    }
    // READ - Mendapatkan produk berdasarkan ID
    async getProductById(id) {
        const connection = await database_1.pool.getConnection();
        try {
            const [rows] = await connection.execute("SELECT * FROM products WHERE id = ?", [id]);
            return rows.length > 0 ? rows[0] : null;
        }
        finally {
            connection.release();
        }
    }
    // UPDATE - Memperbarui produk
    async updateProduct(id, updateData) {
        const connection = await database_1.pool.getConnection();
        try {
            // Ambil data produk sebelum update untuk log
            const existingProduct = await this.getProductById(id);
            if (!existingProduct) {
                return null;
            }
            // Build query dinamis berdasarkan field yang akan diupdate
            const updateFields = [];
            const updateValues = [];
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
            await connection.execute(`UPDATE products SET ${updateFields.join(", ")} WHERE id = ?`, updateValues);
            // Ambil data produk yang sudah diupdate
            const updatedProduct = await this.getProductById(id);
            if (updatedProduct) {
                // **INTEGRASI FIREBASE: Kirim log setelah produk berhasil diupdate**
                const logData = {
                    action: "UPDATE_PRODUCT",
                    productId: id,
                    productName: updatedProduct.name,
                    timestamp: new Date().toISOString(),
                };
                // Kirim log ke Firebase
                await (0, firebase_1.logToFirebase)(logData).catch((error) => console.error("Warning: Gagal mengirim log ke Firebase:", error));
            }
            return updatedProduct;
        }
        finally {
            connection.release();
        }
    }
    // DELETE - Menghapus produk
    async deleteProduct(id) {
        const connection = await database_1.pool.getConnection();
        try {
            // Ambil data produk sebelum dihapus untuk log
            const existingProduct = await this.getProductById(id);
            if (!existingProduct) {
                return false;
            }
            const [result] = await connection.execute("DELETE FROM products WHERE id = ?", [id]);
            const isDeleted = result.affectedRows > 0;
            if (isDeleted) {
                // **INTEGRASI FIREBASE: Kirim log setelah produk berhasil dihapus**
                const logData = {
                    action: "DELETE_PRODUCT",
                    productId: id,
                    productName: existingProduct.name,
                    timestamp: new Date().toISOString(),
                };
                // Kirim log ke Firebase
                await (0, firebase_1.logToFirebase)(logData).catch((error) => console.error("Warning: Gagal mengirim log ke Firebase:", error));
            }
            return isDeleted;
        }
        finally {
            connection.release();
        }
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=productService.js.map