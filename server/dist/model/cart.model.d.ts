import type { ObjectId } from "mongodb";
export interface CartItem {
    productId: ObjectId;
    quantity: number;
    price?: number;
    total?: number;
}
export interface CartDoc {
    _id?: ObjectId;
    userId: ObjectId;
    items: CartItem[];
    createdAt?: Date;
    updatedAt?: Date;
}
export interface AddToCartInput {
    productId: string;
    quantity: number;
}
//# sourceMappingURL=cart.model.d.ts.map