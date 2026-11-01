import { ObjectId } from "mongodb";
import type { AddToCartInput, CartItem } from "../model/cart.model.js";
export declare function addItemToCart(userId: string | ObjectId, { productId, quantity }: AddToCartInput): Promise<import("mongodb").WithId<import("../model/cart.model.js").CartDoc> | null>;
export declare function getUserCart(userId: string | ObjectId): Promise<{
    userId: string | ObjectId;
    items: never[];
    totalAmount: number;
} | {
    _id: ObjectId;
    userId: ObjectId;
    items: CartItem[];
    createdAt?: Date;
    updatedAt?: Date;
    totalAmount: number;
}>;
export declare function emptyUserCart(userId: string | ObjectId): Promise<{
    message: string;
}>;
//# sourceMappingURL=cart-service.d.ts.map