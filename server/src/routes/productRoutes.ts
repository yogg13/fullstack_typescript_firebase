import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/productService";
import { CreateProductInput, UpdateProductInput } from "../types/product";

const productService = new ProductService();

// Schema untuk validasi input
const createProductSchema = {
  body: {
    type: "object",
    required: ["name", "price", "stock"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      price: {
        type: "number",
        minimum: 0,
      },
      stock: {
        type: "integer",
        minimum: 0,
      },
    },
  },
};

const updateProductSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", minimum: 1 },
    },
  },
  body: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      price: {
        type: "number",
        minimum: 0,
      },
      stock: {
        type: "integer",
        minimum: 0,
      },
    },
    minProperties: 1, // Minimal satu property harus ada
  },
};

const getProductSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", minimum: 1 },
    },
  },
};

export default async function productRoutes(fastify: FastifyInstance) {
  // POST /products - Membuat produk baru
  fastify.post<{ Body: CreateProductInput }>("/products", {
    schema: createProductSchema,
    handler: async (
      request: FastifyRequest<{ Body: CreateProductInput }>,
      reply: FastifyReply
    ) => {
      try {
        const product = await productService.createProduct(request.body);

        return reply.code(201).send({
          success: true,
          message: "Produk berhasil dibuat",
          data: product,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        fastify.log.error("Error creating product: " + errorMessage);
        return reply.code(500).send({
          success: false,
          message: "Gagal membuat produk",
          error: errorMessage,
        });
      }
    },
  });

  // GET /products - Mendapatkan semua produk
  fastify.get("/products", {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const products = await productService.getAllProducts();

        return reply.send({
          success: true,
          message: "Data produk berhasil diambil",
          data: products,
          total: products.length,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        fastify.log.error("Error fetching products: " + errorMessage);
        return reply.code(500).send({
          success: false,
          message: "Gagal mengambil data produk",
          error: errorMessage,
        });
      }
    },
  });

  // GET /products/:id - Mendapatkan produk berdasarkan ID
  fastify.get<{ Params: { id: number } }>("/products/:id", {
    schema: getProductSchema,
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      try {
        const product = await productService.getProductById(request.params.id);

        if (!product) {
          return reply.code(404).send({
            success: false,
            message: "Produk tidak ditemukan",
          });
        }

        return reply.send({
          success: true,
          message: "Data produk berhasil diambil",
          data: product,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        fastify.log.error("Error fetching product: " + errorMessage);
        return reply.code(500).send({
          success: false,
          message: "Gagal mengambil data produk",
          error: errorMessage,
        });
      }
    },
  });

  // PUT /products/:id - Memperbarui produk
  fastify.put<{ Params: { id: number }; Body: UpdateProductInput }>(
    "/products/:id",
    {
      schema: updateProductSchema,
      handler: async (
        request: FastifyRequest<{
          Params: { id: number };
          Body: UpdateProductInput;
        }>,
        reply: FastifyReply
      ) => {
        try {
          const product = await productService.updateProduct(
            request.params.id,
            request.body
          );

          if (!product) {
            return reply.code(404).send({
              success: false,
              message: "Produk tidak ditemukan",
            });
          }

          return reply.send({
            success: true,
            message: "Produk berhasil diperbarui",
            data: product,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          fastify.log.error("Error updating product: " + errorMessage);
          return reply.code(500).send({
            success: false,
            message: "Gagal memperbarui produk",
            error: errorMessage,
          });
        }
      },
    }
  );

  // DELETE /products/:id - Menghapus produk
  fastify.delete<{ Params: { id: number } }>("/products/:id", {
    schema: getProductSchema,
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      try {
        const isDeleted = await productService.deleteProduct(request.params.id);

        if (!isDeleted) {
          return reply.code(404).send({
            success: false,
            message: "Produk tidak ditemukan",
          });
        }

        return reply.send({
          success: true,
          message: "Produk berhasil dihapus",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        fastify.log.error("Error deleting product: " + errorMessage);
        return reply.code(500).send({
          success: false,
          message: "Gagal menghapus produk",
          error: errorMessage,
        });
      }
    },
  });
}
