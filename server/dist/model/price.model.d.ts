import type { ObjectId } from "mongodb";
export interface PriceDoc {
    _id?: ObjectId;
    productId: ObjectId;
    price: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface SetPriceInput {
    productId: string;
    price: number;
}
//# sourceMappingURL=price.model.d.ts.map