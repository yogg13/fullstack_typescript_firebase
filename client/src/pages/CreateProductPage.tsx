import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "../hooks/useProducts";
import ProductForm from "../components/forms/ProductForm";
import type { ProductFormData } from "../schemas/productSchema";
import type { CreateProductInput } from "../types/product";

function CreateProductPage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      // Konversi data form ke format CreateProductInput
      const productInput: CreateProductInput = {
        name: data.name,
        price: data.price,
        stock: data.stock,
      };

      // Kirim data ke API
      await createProduct.mutateAsync(productInput);

      // Redirect ke halaman products setelah berhasil
      navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      // Error handling sudah ditangani di hook useCreateProduct
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a new product to your inventory
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createProduct.isPending}
        submitText="Create Product"
        onCancel={handleCancel}
      />
    </div>
  );
}

export default CreateProductPage;
