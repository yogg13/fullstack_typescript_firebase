import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useProducts, useDeleteProduct } from "../hooks/useProducts";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import type { Product } from "../types/product";
import { formatCurrency, formatDate } from "../utils/formatters";

function ProductsPage() {
  const { data: products, isLoading, error, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  const handleDeleteClick = (product: Product) => {
    setDeleteDialog({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.product?.id) {
      await deleteProduct.mutateAsync(deleteDialog.product.id);
      setDeleteDialog({ isOpen: false, product: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, product: null });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load products"
        message="There was an error loading the products. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your product inventory
          </p>
        </div>

        <Link
          to="/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm flex items-center"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Products Grid/List */}
      {products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmStyle="danger"
        isLoading={deleteProduct.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  onDelete: (product: Product) => void;
}

function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
          {product.name}
        </h3>
        <div className="flex space-x-1 flex-shrink-0">
          <Link
            to={`/products/${product.id}/edit`}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
            title="Edit product"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
            title="Delete product"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-sm font-medium text-gray-700">Price:</span>
          <span className="font-semibold text-green-600 bg-green-50 py-1 px-3 rounded-full">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-sm font-medium text-gray-700">Stock:</span>
          <span
            className={`font-medium py-1 px-3 rounded-full ${
              product.stock > 10
                ? "bg-green-50 text-green-700"
                : product.stock > 0
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {product.stock} units
          </span>
        </div>

        {product.updated_at && (
          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <span className="text-xs text-gray-500 italic">
              Updated: {formatDate(product.updated_at)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 border-2 border-blue-100">
        <PlusIcon className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Get started by creating your first product to manage your inventory.
      </p>
      <Link
        to="/products/new"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm inline-flex items-center"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Your First Product
      </Link>
    </div>
  );
}

export default ProductsPage;
