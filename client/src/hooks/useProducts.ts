import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../services/productService";
import type {
  CreateProductInput,
  UpdateProductInput,
  Product,
} from "../types/product";
import { queryKeys } from "../config/queryClient";
import { toast } from "../utils/toast";

// Hook untuk mendapatkan semua products
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: ProductService.getProducts,
    meta: {
      errorHandler: (error: Error) => {
        console.error("Failed to fetch products:", error);
        toast.error("Gagal memuat daftar produk");
      },
    },
  });
}

// Hook untuk mendapatkan single product
export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => ProductService.getProductById(id),
    enabled: !!id, // Hanya jalankan query jika id ada
    meta: {
      errorHandler: (error: Error) => {
        console.error("Failed to fetch product:", error);
        toast.error("Gagal memuat detail produk");
      },
    },
  });
}

// Hook untuk create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      ProductService.createProduct(data),
    onSuccess: () => {
      // Invalidate dan refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      // Optionally, bisa tambah optimistic update
      // queryClient.setQueryData(queryKeys.products.lists(), (old: Product[] | undefined) => {
      //   return old ? [...old, newProduct] : [newProduct];
      // });

      toast.success("Produk berhasil ditambahkan!");
    },
    onError: (error: Error) => {
      console.error("Failed to create product:", error);
      toast.error(error.message || "Gagal menambahkan produk");
    },
  });
}

// Hook untuk update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductInput }) =>
      ProductService.updateProduct(id, data),
    onSuccess: (updatedProduct: Product) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      // Update specific product cache if updatedProduct has id
      if (updatedProduct && updatedProduct.id) {
        queryClient.setQueryData(
          queryKeys.products.detail(updatedProduct.id),
          updatedProduct
        );
      }

      toast.success("Produk berhasil diperbarui!");
    },
    onError: (error: Error) => {
      console.error("Failed to update product:", error);
      toast.error(error.message || "Gagal memperbarui produk");
    },
  });
}

// Hook untuk delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProductService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.products.detail(deletedId),
      });

      toast.success("Produk berhasil dihapus!");
    },
    onError: (error: Error) => {
      console.error("Failed to delete product:", error);
      toast.error(error.message || "Gagal menghapus produk");
    },
  });
}
