# Tutorial Lengkap: Membangun Frontend React Modern untuk Web Service Produk

## 📋 Daftar Isi
1. [Pengantar](#pengantar)
2. [Setup Proyek](#setup-proyek)
3. [Konfigurasi Awal](#konfigurasi-awal)
4. [TypeScript Types](#typescript-types)
5. [Setup Services & HTTP Client](#setup-services--http-client)
6. [TanStack Query Setup](#tanstack-query-setup)
7. [Routing & Layout](#routing--layout)
8. [Halaman Daftar Produk](#halaman-daftar-produk)
9. [Form Create & Update](#form-create--update)
10. [Delete Functionality](#delete-functionality)
11. [Firebase Real-time Logging](#firebase-real-time-logging)
12. [Styling & UI Components](#styling--ui-components)
13. [Testing & Optimization](#testing--optimization)

---

## 🎯 Pengantar

Tutorial ini akan membantu Anda membangun Single Page Application (SPA) modern menggunakan **React + TypeScript** dengan teknologi terdepan untuk mengelola data produk yang terhubung dengan REST API backend.

### Teknologi yang Digunakan:
- **Vite** - Build tool modern dan cepat
- **React 18** + **TypeScript** - UI library dengan type safety
- **TanStack Query** - Server state management yang powerful
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** + **Zod** - Form handling & validation
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components
- **Firebase** - Real-time database untuk logging

### Fitur Aplikasi:
✅ **CRUD Operations** - Create, Read, Update, Delete produk  
✅ **Real-time Logging** - Activity feed dari Firebase  
✅ **Type Safety** - Full TypeScript support  
✅ **Form Validation** - Schema-based validation dengan Zod  
✅ **Responsive Design** - Mobile-first approach  
✅ **Optimistic Updates** - Instant UI feedback  
✅ **Error Handling** - Comprehensive error management  
✅ **Loading States** - Elegant loading indicators  

---

## 🚀 Setup Proyek

### 1. Inisialisasi Proyek Vite

```bash
# Membuat proyek React dengan TypeScript
npm create vite@latest client -- --template react-ts

# Masuk ke folder proyek
cd client
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install @tanstack/react-query axios react-router-dom react-hook-form @hookform/resolvers zod firebase

# UI dependencies
npm install tailwindcss @headlessui/react @heroicons/react lucide-react

# Dev dependencies
npm install -D @types/node autoprefixer postcss
```

### 3. Struktur Folder

```
client/
├── src/
│   ├── components/          # Komponen reusable
│   │   ├── ui/             # Basic UI components
│   │   ├── forms/          # Form components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── App.tsx
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Konfigurasi Awal

### 1. Tailwind CSS Setup

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

**postcss.config.js**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2. Update src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom components */
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  .btn-secondary {
    @apply bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  .btn-danger {
    @apply bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  .card {
    @apply bg-white rounded-lg shadow-md border border-gray-200 p-6;
  }
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }
}
```

---

## 📝 TypeScript Types

Mari buat type definitions yang sesuai dengan backend API:

**src/types/product.ts**
```typescript
// Product interfaces sesuai dengan backend
export interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

// Input types untuk form
export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  stock?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
  error?: string;
}

// Firebase log types
export interface ProductLog {
  action: 'CREATE_PRODUCT' | 'UPDATE_PRODUCT' | 'DELETE_PRODUCT';
  productId: number;
  productName?: string;
  timestamp: string;
  userId?: string;
}
```

**src/types/api.ts**
```typescript
// Generic API types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
}

// Form state types
export interface FormState {
  isLoading: boolean;
  error: string | null;
}
```

---

## 🌐 Setup Services & HTTP Client

### 1. Axios Configuration

**src/config/api.ts**
```typescript
import axios from 'axios';

// Base URL dari backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance dengan konfigurasi default
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 detik
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Product Service

**src/services/productService.ts**
```typescript
import { apiClient } from '../config/api';
import { Product, CreateProductInput, UpdateProductInput, ApiResponse } from '../types/product';

export class ProductService {
  // GET all products
  static async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  // GET product by ID
  static async getProductById(id: number): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      if (!response.data.data) {
        throw new Error('Product not found');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  // POST create product
  static async createProduct(data: CreateProductInput): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>('/products', data);
      if (!response.data.data) {
        throw new Error('Failed to create product');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      throw new Error(errorMessage);
    }
  }

  // PUT update product
  static async updateProduct(id: number, data: UpdateProductInput): Promise<Product> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
      if (!response.data.data) {
        throw new Error('Failed to update product');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      throw new Error(errorMessage);
    }
  }

  // DELETE product
  static async deleteProduct(id: number): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      throw new Error(errorMessage);
    }
  }
}
```

---

## 🔄 TanStack Query Setup

### 1. Query Client Configuration

**src/config/queryClient.ts**
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: data dianggap fresh untuk 5 menit
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time: data disimpan di memory untuk 10 menit
      cacheTime: 10 * 60 * 1000, // 10 minutes
      
      // Retry failed requests 3 kali dengan exponential backoff
      retry: 3,
      
      // Refetch saat window focus (berguna untuk real-time updates)
      refetchOnWindowFocus: false,
      
      // Refetch saat reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations 1 kali
      retry: 1,
    },
  },
});

// Query keys untuk konsistensi
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },
} as const;
```

### 2. Custom Hooks untuk Products

**src/hooks/useProducts.ts**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/productService';
import { CreateProductInput, UpdateProductInput } from '../types/product';
import { queryKeys } from '../config/queryClient';
import { toast } from '../utils/toast';

// Hook untuk mendapatkan semua products
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: ProductService.getProducts,
    onError: (error: any) => {
      console.error('Failed to fetch products:', error);
      toast.error('Gagal memuat daftar produk');
    },
  });
}

// Hook untuk mendapatkan single product
export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => ProductService.getProductById(id),
    enabled: !!id, // Hanya jalankan query jika id ada
    onError: (error: any) => {
      console.error('Failed to fetch product:', error);
      toast.error('Gagal memuat detail produk');
    },
  });
}

// Hook untuk create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => ProductService.createProduct(data),
    onSuccess: (newProduct) => {
      // Invalidate dan refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      
      // Optionally, bisa tambah optimistic update
      // queryClient.setQueryData(queryKeys.products.lists(), (old: Product[] | undefined) => {
      //   return old ? [...old, newProduct] : [newProduct];
      // });

      toast.success('Produk berhasil ditambahkan!');
    },
    onError: (error: any) => {
      console.error('Failed to create product:', error);
      toast.error(error.message || 'Gagal menambahkan produk');
    },
  });
}

// Hook untuk update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductInput }) =>
      ProductService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      
      // Update specific product cache
      queryClient.setQueryData(
        queryKeys.products.detail(updatedProduct.id!),
        updatedProduct
      );

      toast.success('Produk berhasil diperbarui!');
    },
    onError: (error: any) => {
      console.error('Failed to update product:', error);
      toast.error(error.message || 'Gagal memperbarui produk');
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
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(deletedId) });

      toast.success('Produk berhasil dihapus!');
    },
    onError: (error: any) => {
      console.error('Failed to delete product:', error);
      toast.error(error.message || 'Gagal menghapus produk');
    },
  });
}
```

### 3. Penjelasan Mengapa TanStack Query Lebih Baik

**Mengapa TanStack Query > useState + useEffect?**

1. **Caching Otomatis**: Data di-cache secara otomatis, mengurangi request yang tidak perlu
2. **Background Refetching**: Data diperbarui di background tanpa mengganggu UX
3. **Optimistic Updates**: UI bisa update langsung sebelum API response
4. **Error Handling**: Built-in error handling dan retry mechanism
5. **Loading States**: Automatic loading, error, dan success states
6. **Memory Management**: Automatic cleanup dan garbage collection
7. **DevTools**: Powerful debugging tools
8. **Deduplication**: Request yang sama di-deduplicate secara otomatis

**Contoh Perbandingan:**

```typescript
// ❌ Traditional way dengan useState + useEffect
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []); // Dependencies bisa kompleks dan error-prone

// ✅ TanStack Query way
const { data: products, isLoading, error } = useProducts();
// That's it! Automatic caching, refetching, error handling, dll.
```

---

## 🗂️ Routing & Layout

### 1. App Router Setup

**src/App.tsx**
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient';
import Layout from './components/layout/Layout';
import ProductsPage from './pages/ProductsPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<CreateProductPage />} />
              <Route path="/products/:id/edit" element={<EditProductPage />} />
            </Routes>
          </Layout>
          
          {/* Toast notifications */}
          <Toaster />
        </div>
      </Router>
      
      {/* React Query DevTools (hanya untuk development) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
```

### 2. Layout Component

**src/components/layout/Layout.tsx**
```typescript
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusIcon, HomeIcon } from '@heroicons/react/24/outline';
import ActivityLog from '../ActivityLog';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, current: location.pathname === '/' },
    { name: 'Products', href: '/products', icon: HomeIcon, current: location.pathname === '/products' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white shadow-sm">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Product Manager
            </h1>
          </div>
          
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                      ${item.current
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 p-4">
            <Link
              to="/products/new"
              className="btn-primary w-full flex items-center justify-center"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar untuk mobile */}
        <div className="md:hidden bg-white shadow-sm px-4 py-2">
          <h1 className="text-lg font-semibold text-gray-900">Product Manager</h1>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>

          {/* Activity Log Sidebar */}
          <div className="hidden lg:flex lg:flex-col lg:w-80 lg:border-l lg:border-gray-200 lg:bg-white">
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
```

---

## 📋 Halaman Daftar Produk

**src/pages/ProductsPage.tsx**
```typescript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Product } from '../types/product';
import { formatCurrency, formatDate } from '../utils/formatters';

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your product inventory
          </p>
        </div>
        
        <Link
          to="/products/new"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Products Grid/List */}
      {products && products.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        isLoading={deleteProduct.isLoading}
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
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {product.name}
        </h3>
        <div className="flex space-x-2">
          <Link
            to={`/products/${product.id}/edit`}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(product)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Price:</span>
          <span className="font-medium text-green-600">
            {formatCurrency(product.price)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Stock:</span>
          <span className={`font-medium ${
            product.stock > 10 ? 'text-green-600' : 
            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {product.stock} units
          </span>
        </div>
        
        {product.updated_at && (
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
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
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <PlusIcon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600 mb-6">
        Get started by creating your first product.
      </p>
      <Link to="/products/new" className="btn-primary">
        Add Your First Product
      </Link>
    </div>
  );
}

export default ProductsPage;
```

---

## 📝 Form Create & Update

### 1. Schema Validation dengan Zod

**src/schemas/productSchema.ts**
```typescript
import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(255, 'Product name must not exceed 255 characters'),
  
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be greater than or equal to 0')
    .max(999999999, 'Price is too high'),
  
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock must be greater than or equal to 0')
    .max(999999, 'Stock is too high'),
});

export type ProductFormData = z.infer<typeof productSchema>;
```

### 2. Product Form Component

**src/components/forms/ProductForm.tsx**
```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '../../schemas/productSchema';
import { Product } from '../../types/product';
import FormField from '../ui/FormField';
import LoadingSpinner from '../ui/LoadingSpinner';

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
  submitText = 'Save Product',
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
      name: initialData?.name || '',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
    },
    mode: 'onChange', // Validate on every change for better UX
  });

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      
      // Reset form jika ini adalah create form (tidak ada initialData)
      if (!initialData) {
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Error handling sudah dilakukan di level hook/mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !isValid || (!isDirty && !!initialData)}
          className={`btn-primary relative min-w-[120px] ${
            isLoading || !isValid || (!isDirty && !!initialData)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
```

### 3. Create Product Page

**src/pages/CreateProductPage.tsx**
```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCreateProduct } from '../hooks/useProducts';
import ProductForm from '../components/forms/ProductForm';
import { ProductFormData } from '../schemas/productSchema';

function CreateProductPage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    await createProduct.mutateAsync(data);
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Products
        </button>
        
        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Product
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a new product to your inventory
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={createProduct.isLoading}
          submitText="Create Product"
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default CreateProductPage;
```

### 4. Edit Product Page

**src/pages/EditProductPage.tsx**
```typescript
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import ProductForm from '../components/forms/ProductForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { ProductFormData } from '../schemas/productSchema';

function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : 0;
  
  const { data: product, isLoading, error } = useProduct(productId);
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    await updateProduct.mutateAsync({ id: productId, data });
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
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
        title="Product not found"
        message="The product you're looking for doesn't exist or has been deleted."
        onRetry={() => navigate('/products')}
        retryText="Back to Products"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Products
        </button>
        
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Product
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Update product information
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={updateProduct.isLoading}
          submitText="Update Product"
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default EditProductPage;
```

---

## 🗑️ Delete Functionality

Delete functionality sudah diimplementasi di dalam `ProductsPage` menggunakan `ConfirmDialog`. Mari buat komponen UI yang diperlukan:

**src/components/ui/ConfirmDialog.tsx**
```typescript
import React from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: 'primary' | 'danger';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmStyle = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonClass = confirmStyle === 'danger' 
    ? 'btn-danger' 
    : 'btn-primary';

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center mb-4">
            {confirmStyle === 'danger' && (
              <div className="flex-shrink-0 mr-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            )}
            
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {title}
            </Dialog.Title>
          </div>

          <Dialog.Description className="text-sm text-gray-600 mb-6">
            {message}
          </Dialog.Description>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`${confirmButtonClass} relative min-w-[100px]`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;
```

---

## 🔥 Firebase Real-time Logging

### 1. Firebase Configuration

**src/config/firebase.ts**
```typescript
import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Firebase config - GANTI dengan config project Anda
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database dan get reference
export const database: Database = getDatabase(app);

export default app;
```

### 2. Environment Variables

**client/.env**
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=learn-firebase-backend.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://learn-firebase-backend-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=learn-firebase-backend
VITE_FIREBASE_STORAGE_BUCKET=learn-firebase-backend.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Activity Log Component

**src/components/ActivityLog.tsx**
```typescript
import React, { useState, useEffect } from 'react';
import { ref, onValue, off, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from '../config/firebase';
import { ProductLog } from '../types/product';
import { formatDistanceToNow } from 'date-fns';
import { 
  PlusCircleIcon, 
  PencilSquareIcon, 
  TrashIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import LoadingSpinner from './ui/LoadingSpinner';

function ActivityLog() {
  const [logs, setLogs] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reference ke Firebase Realtime Database
    const logsRef = ref(database, 'product_logs');
    
    // Query untuk mendapatkan 50 log terakhir, diurutkan berdasarkan timestamp
    const logsQuery = query(
      logsRef,
      orderByChild('timestamp'),
      limitToLast(50)
    );

    console.log('🔥 Connecting to Firebase Realtime Database...');

    // Listener untuk perubahan data real-time
    const unsubscribe = onValue(
      logsQuery,
      (snapshot) => {
        setLoading(false);
        setError(null);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          // Convert object ke array dan urutkan terbaru dulu
          const logsArray: ProductLog[] = Object.keys(data)
            .map(key => ({
              id: key,
              ...data[key]
            }))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setLogs(logsArray);
          console.log('✅ Firebase data updated:', logsArray.length, 'logs');
        } else {
          setLogs([]);
          console.log('📭 No logs found in Firebase');
        }
      },
      (error) => {
        setLoading(false);
        setError('Failed to load activity logs');
        console.error('❌ Firebase error:', error);
      }
    );

    // Cleanup function untuk unsubscribe saat component unmount
    return () => {
      console.log('🔌 Disconnecting from Firebase...');
      off(logsRef);
      unsubscribe();
    };
  }, []);

  const getActionIcon = (action: ProductLog['action']) => {
    switch (action) {
      case 'CREATE_PRODUCT':
        return <PlusCircleIcon className="h-5 w-5 text-green-600" />;
      case 'UPDATE_PRODUCT':
        return <PencilSquareIcon className="h-5 w-5 text-blue-600" />;
      case 'DELETE_PRODUCT':
        return <TrashIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionText = (action: ProductLog['action']) => {
    switch (action) {
      case 'CREATE_PRODUCT':
        return 'created product';
      case 'UPDATE_PRODUCT':
        return 'updated product';
      case 'DELETE_PRODUCT':
        return 'deleted product';
      default:
        return 'performed action on product';
    }
  };

  const getActionColor = (action: ProductLog['action']) => {
    switch (action) {
      case 'CREATE_PRODUCT':
        return 'text-green-800 bg-green-100';
      case 'UPDATE_PRODUCT':
        return 'text-blue-800 bg-blue-100';
      case 'DELETE_PRODUCT':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-400' : 'bg-green-400'} mr-2`}></div>
            <span className="text-xs text-gray-500">
              {error ? 'Disconnected' : 'Live'}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Real-time product activity
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-4 text-center">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-600 text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <LogItem key={log.id || `${log.productId}-${log.timestamp}`} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Log Item Component
interface LogItemProps {
  log: ProductLog;
}

function LogItem({ log }: LogItemProps) {
  const actionIcon = getActionIcon(log.action);
  const actionText = getActionText(log.action);
  const actionColor = getActionColor(log.action);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {actionIcon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${actionColor}`}>
              {log.action.replace('_', ' ')}
            </span>
          </div>
          
          <p className="text-sm text-gray-900">
            {actionText}{' '}
            {log.productName && (
              <span className="font-medium">"{log.productName}"</span>
            )}
          </p>
          
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper functions (bisa dipindah ke utils jika diperlukan di tempat lain)
const getActionIcon = (action: ProductLog['action']) => {
  switch (action) {
    case 'CREATE_PRODUCT':
      return <PlusCircleIcon className="h-5 w-5 text-green-600" />;
    case 'UPDATE_PRODUCT':
      return <PencilSquareIcon className="h-5 w-5 text-blue-600" />;
    case 'DELETE_PRODUCT':
      return <TrashIcon className="h-5 w-5 text-red-600" />;
    default:
      return <ClockIcon className="h-5 w-5 text-gray-600" />;
  }
};

const getActionText = (action: ProductLog['action']) => {
  switch (action) {
    case 'CREATE_PRODUCT':
      return 'created product';
    case 'UPDATE_PRODUCT':
      return 'updated product';
    case 'DELETE_PRODUCT':
      return 'deleted product';
    default:
      return 'performed action on product';
  }
};

const getActionColor = (action: ProductLog['action']) => {
  switch (action) {
    case 'CREATE_PRODUCT':
      return 'text-green-800 bg-green-100';
    case 'UPDATE_PRODUCT':
      return 'text-blue-800 bg-blue-100';
    case 'DELETE_PRODUCT':
      return 'text-red-800 bg-red-100';
    default:
      return 'text-gray-800 bg-gray-100';
  }
};

export default ActivityLog;
```

---

## 🎨 Styling & UI Components

Mari buat komponen UI yang diperlukan:

### 1. Loading Spinner

**src/components/ui/LoadingSpinner.tsx**
```typescript
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
```

### 2. Error Alert

**src/components/ui/ErrorAlert.tsx**
```typescript
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorAlertProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

function ErrorAlert({ 
  title, 
  message, 
  onRetry, 
  retryText = 'Try Again' 
}: ErrorAlertProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-3 rounded-md text-sm transition-colors"
              >
                {retryText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorAlert;
```

### 3. Form Field Component

**src/components/ui/FormField.tsx**
```typescript
import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  prefix?: string;
  suffix?: string;
  step?: string;
  min?: string;
  max?: string;
}

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  prefix,
  suffix,
  step,
  min,
  max,
}: FormFieldProps) {
  const fieldId = `field-${name}`;

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        <input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          {...register(name, { 
            valueAsNumber: type === 'number',
          })}
          className={`input-field ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-16' : ''} ${
            error ? 'border-red-300 ring-red-500' : ''
          }`}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}

export default FormField;
```

### 4. Toast Notifications

**src/utils/toast.ts**
```typescript
// Simple toast implementation
// Untuk production, gunakan library seperti react-hot-toast atau sonner

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

class ToastManager {
  private listeners: ((toasts: ToastMessage[]) => void)[] = [];
  private toasts: ToastMessage[] = [];

  subscribe(listener: (toasts: ToastMessage[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  private show(type: ToastType, message: string, duration = 5000) {
    const id = Date.now().toString();
    const toast = { id, type, message, duration };
    
    this.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  success(message: string, duration?: number) {
    return this.show('success', message, duration);
  }

  error(message: string, duration?: number) {
    return this.show('error', message, duration);
  }

  info(message: string, duration?: number) {
    return this.show('info', message, duration);
  }

  warning(message: string, duration?: number) {
    return this.show('warning', message, duration);
  }
}

export const toast = new ToastManager();
```

### 5. Toaster Component

**src/components/ui/Toaster.tsx**
```typescript
import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toast';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStyles = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm p-4 border rounded-lg shadow-lg animate-slide-up
            ${getStyles(toast.type)}
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => window.toast?.remove(toast.id)}
                className="inline-flex text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Toaster;
```

### 6. Utility Functions

**src/utils/formatters.ts**
```typescript
// Currency formatter
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

// Date formatter
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
}

// Number formatter
export function formatNumber(number: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(number);
}
```

---

## 🚀 Running the Application

### 1. Update package.json scripts

**client/package.json** (tambahkan date-fns dependency):
```bash
npm install date-fns
```

### 2. Environment Setup

Buat file **client/.env**:
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=learn-firebase-backend.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://learn-firebase-backend-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=learn-firebase-backend
VITE_FIREBASE_STORAGE_BUCKET=learn-firebase-backend.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Start the Application

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

---

## 📚 Konsep Penting yang Dipelajari

### 1. **TanStack Query Benefits**
- **Automatic Background Refetching**: Data selalu up-to-date
- **Caching**: Mengurangi request yang tidak perlu
- **Optimistic Updates**: UI responsif dengan instant feedback
- **Error Handling**: Built-in retry dan error states
- **DevTools**: Debugging yang powerful

### 2. **Type Safety dengan TypeScript**
- Interface consistency antara frontend-backend
- Compile-time error detection
- Better IDE support dan autocomplete
- Refactoring yang aman

### 3. **Form Management Modern**
- **React Hook Form**: Uncontrolled components untuk performance
- **Zod Validation**: Schema-based validation yang type-safe
- **Real-time Validation**: Instant feedback untuk better UX

### 4. **Firebase Real-time Integration**
- **Live Data Sync**: Data terupdate secara real-time
- **Connection Management**: Proper connect/disconnect handling
- **Error Recovery**: Graceful handling untuk connection issues

### 5. **Modern React Patterns**
- **Custom Hooks**: Reusable logic separation
- **Compound Components**: Flexible component composition
- **Error Boundaries**: Graceful error handling
- **Suspense Ready**: Future-proof untuk concurrent features

---

## 🎯 Next Steps & Improvements

Setelah menguasai dasar-dasar ini, Anda bisa mengembangkan lebih lanjut:

1. **Authentication & Authorization**
2. **Advanced Filtering & Search**
3. **File Upload dengan preview**
4. **Pagination & Infinite Scroll**
5. **Offline Support dengan Service Workers**
6. **Unit & Integration Testing**
7. **Performance Optimization**
8. **Docker Containerization**
9. **CI/CD Pipeline**
10. **Monitoring & Analytics**

---

Dengan mengikuti tutorial ini, Anda akan memiliki aplikasi frontend modern yang fully-functional dengan semua fitur yang diminta, plus pemahaman mendalam tentang best practices dalam pengembangan React modern.

Happy coding! 🚀