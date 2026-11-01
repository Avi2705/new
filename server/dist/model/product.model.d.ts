import type { ObjectId } from "mongodb";
export interface ProductDoc {
    _id?: ObjectId;
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
}
export interface CreateProductInput {
    productName: string;
    productDescription: string;
    productCategory: string;
    productImages?: string[];
    productVideos?: string[];
}
export interface ProductFilterQuery {
    name?: string;
    q?: string;
    search?: string;
    category?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    price?: string | number;
}
//# sourceMappingURL=product.model.d.ts.map