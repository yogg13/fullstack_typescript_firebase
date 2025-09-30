import { apiClient } from "../config/api";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ApiResponse,
} from "../types/product";
import type { AxiosErrorResponse } from "../types/api";

export class ProductService {
  // GET all products
  static async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>("/products");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  // GET product by ID
  static async getProductById(id: number): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `/products/${id}`
      );
      if (!response.data.data) {
        throw new Error("Product not found");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw new Error("Failed to fetch product");
    }
  }

  // POST create product
  static async createProduct(data: CreateProductInput): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(
        "/products",
        data
      );
      if (!response.data.data) {
        throw new Error("Failed to create product");
      }
      return response.data.data;
    } catch (error: unknown) {
      console.error("Error creating product:", error);
      const axiosError = error as AxiosErrorResponse;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to create product";
      throw new Error(errorMessage);
    }
  }

  // PUT update product
  static async updateProduct(
    id: number,
    data: UpdateProductInput
  ): Promise<Product> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(
        `/products/${id}`,
        data
      );
      if (!response.data.data) {
        throw new Error("Failed to update product");
      }
      return response.data.data;
    } catch (error: unknown) {
      console.error("Error updating product:", error);
      const axiosError = error as AxiosErrorResponse;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to update product";
      throw new Error(errorMessage);
    }
  }

  // DELETE product
  static async deleteProduct(id: number): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error: unknown) {
      console.error("Error deleting product:", error);
      const axiosError = error as AxiosErrorResponse;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to delete product";
      throw new Error(errorMessage);
    }
  }
}
