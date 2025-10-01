import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/productService";
import { CreateProductInput, UpdateProductInput } from "../types/product";
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
} from "../schemas/product";
import { authenticate } from "../middleware/authMiddleware";

export default async function productRoutes(fastify: FastifyInstance) {
  const productService = new ProductService();

  // POST /products - Membuat produk baru
  fastify.post<{ Body: CreateProductInput }>("/products", {
    schema: createProductSchema,
    preHandler: authenticate,
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

  // GET /products - Mendapatkan semua produk (no need authentication)
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
    preHandler: authenticate,
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
      preHandler: authenticate,
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
    preHandler: authenticate,
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
