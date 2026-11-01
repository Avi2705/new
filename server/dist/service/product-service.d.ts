import { ObjectId } from "mongodb";
import type { CreateProductInput, ProductDoc, ProductFilterQuery } from "../model/product.model.js";
export declare function createProduct(vendorId: string | ObjectId, data: CreateProductInput): Promise<{
    productName: string;
    productDescription: string;
    productCategory: string;
    productImages?: string[];
    productVideos?: string[];
    vendorId: ObjectId;
    currentPrice?: number;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    _id: ObjectId;
}>;
export declare function createManyProducts(vendorId: string | ObjectId, products: CreateProductInput[]): Promise<{
    insertedCount: number;
    insertedIds: {
        [key: number]: ObjectId;
    };
}>;
export declare function getSingleProduct(productId: string | ObjectId): Promise<import("mongodb").WithId<ProductDoc>>;
export declare function getProductsForUser(): Promise<import("mongodb").WithId<ProductDoc>[]>;
export declare function getProductsForVendor(vendorId: string | ObjectId): Promise<import("mongodb").WithId<ProductDoc>[]>;
export declare function updateProduct(vendorId: string | ObjectId, productId: string | ObjectId, updates: Partial<CreateProductInput>): Promise<any>;
export declare function searchProductsByName(query: string): Promise<import("mongodb").WithId<ProductDoc>[]>;
export declare function filterProductsByCriteria(filters: ProductFilterQuery): Promise<import("mongodb").WithId<ProductDoc>[]>;
export declare const productService: {
    createProduct: typeof createProduct;
    createManyProducts: typeof createManyProducts;
    getSingleProduct: typeof getSingleProduct;
    getProductsForUser: typeof getProductsForUser;
    getProductsForVendor: typeof getProductsForVendor;
    updateProduct: typeof updateProduct;
    searchProductsByName: typeof searchProductsByName;
    filterProductsByCriteria: typeof filterProductsByCriteria;
};
//# sourceMappingURL=product-service.d.ts.map