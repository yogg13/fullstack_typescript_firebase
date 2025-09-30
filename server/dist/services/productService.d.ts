import { Product, CreateProductInput, UpdateProductInput } from "../types/product";
export declare class ProductService {
    createProduct(productData: CreateProductInput): Promise<Product>;
    getAllProducts(): Promise<Product[]>;
    getProductById(id: number): Promise<Product | null>;
    updateProduct(id: number, updateData: UpdateProductInput): Promise<Product | null>;
    deleteProduct(id: number): Promise<boolean>;
}
//# sourceMappingURL=productService.d.ts.map