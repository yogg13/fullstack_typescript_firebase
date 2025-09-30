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
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
  error?: string;
}

// Firebase log types
export interface ProductLog {
  id?: string; // Firebase generated key
  action: "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT";
  productId: number;
  productName?: string;
  timestamp: string;
  userId?: string;
}
