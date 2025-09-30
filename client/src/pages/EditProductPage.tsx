import { useNavigate, useParams } from "react-router-dom";
import { useProduct, useUpdateProduct } from "../hooks/useProducts";
import ProductForm from "../components/forms/ProductForm";
import type { ProductFormData } from "../schemas/productSchema";
import type { UpdateProductInput } from "../types/product";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";

function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id, 10) : 0;

  // Fetch product data
  const { data: product, isLoading, error } = useProduct(productId);

  const updateProduct = useUpdateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      // Konversi data form ke format UpdateProductInput
      const productInput: UpdateProductInput = {
        name: data.name,
        price: data.price,
        stock: data.stock,
      };

      // Kirim data ke API
      await updateProduct.mutateAsync({ id: productId, data: productInput });

      // Redirect ke halaman products setelah berhasil
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      // Error handling sudah ditangani di hook useUpdateProduct
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <ErrorAlert
        title="Failed to load product"
        message="There was an error loading the product information. Please try again."
        onRetry={() => navigate("/products")}
        retryText="Go back to products"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-600">Update product information</p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={updateProduct.isPending}
        submitText="Update Product"
        onCancel={handleCancel}
      />
    </div>
  );
}

export default EditProductPage;
