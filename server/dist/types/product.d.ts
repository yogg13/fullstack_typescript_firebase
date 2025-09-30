export interface Product {
    id?: number;
    name: string;
    price: number;
    stock: number;
    created_at?: Date;
    updated_at?: Date;
}
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
export interface ProductLog {
    action: "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT";
    productId: number;
    productName?: string;
    timestamp: string;
    userId?: string;
}
//# sourceMappingURL=product.d.ts.map