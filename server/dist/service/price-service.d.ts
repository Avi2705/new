import { ObjectId } from "mongodb";
import type { PriceDoc } from "../model/price.model.js";
export declare function setPrice(vendorId: string | ObjectId, productId: string | ObjectId, price: number): Promise<{
    productId: ObjectId;
    price: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    _id: ObjectId;
}>;
export declare function getPrice(productId: string | ObjectId): Promise<import("mongodb").WithId<PriceDoc>>;
//# sourceMappingURL=price-service.d.ts.map