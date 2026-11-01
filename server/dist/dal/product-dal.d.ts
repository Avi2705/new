import { ObjectId, type WithId } from "mongodb";
import type { ProductDoc, ProductFilterQuery } from "../model/product.model.js";
export declare function insertProduct(productDoc: ProductDoc): Promise<import("mongodb").InsertOneResult<ProductDoc>>;
export declare function insertManyProduct(productDocs: ProductDoc[]): Promise<import("mongodb").InsertManyResult<ProductDoc>>;
export declare function findProductById(productId: string | ObjectId): Promise<WithId<ProductDoc> | null>;
export declare function findProductsByVendorId(vendorId: string | ObjectId): Promise<WithId<ProductDoc>[]>;
export declare function findAllProducts(): Promise<WithId<ProductDoc>[]>;
export declare function updateProductById(productId: string | ObjectId, fields: Partial<ProductDoc>): Promise<import("mongodb").UpdateResult<ProductDoc>>;
export declare function filterProductByName(query: string): Promise<WithId<ProductDoc>[]>;
export declare function filterProducts(filters?: ProductFilterQuery): Promise<WithId<ProductDoc>[]>;
//# sourceMappingURL=product-dal.d.ts.map