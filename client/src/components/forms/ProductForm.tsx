import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductFormData,
} from "../../schemas/productSchema";
import type { Product } from "../../types/product";
import FormField from "../ui/FormField";
import LoadingSpinner from "../ui/LoadingSpinner";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void | Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitText = "Save Product",
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
    },
    mode: "onChange", // Validate on every change for better UX
  });

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);

      // Reset form jika ini adalah create form (tidak ada initialData)
      if (!initialData) {
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling sudah dilakukan di level hook/mutation
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200"
    >
      {/* Product Name */}
      <FormField
        label="Product Name"
        name="name"
        type="text"
        placeholder="Enter product name"
        register={register}
        error={errors.name}
        required
      />

      {/* Price */}
      <FormField
        label="Price"
        name="price"
        type="number"
        placeholder="0.00"
        step="0.01"
        min="0"
        register={register}
        error={errors.price}
        required
        prefix="$"
      />

      {/* Stock */}
      <FormField
        label="Stock Quantity"
        name="stock"
        type="number"
        placeholder="0"
        min="0"
        register={register}
        error={errors.stock}
        required
        suffix="units"
      />

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || !isValid || (!isDirty && !!initialData)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed relative min-w-[120px]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
