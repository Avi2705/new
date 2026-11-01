import type { ObjectId } from "mongodb";
export interface OrderItem {
    productId: ObjectId;
    quantity: number;
    price: number;
    subtotal: number;
}
export interface OrderDoc {
    _id?: ObjectId;
    userId: ObjectId;
    productId?: ObjectId;
    vendorId?: ObjectId;
    quantity?: number;
    items?: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface PlaceOrderInput {
    productId?: string;
    quantity?: number;
    items?: {
        productId: string;
        quantity: number;
    }[];
}
//# sourceMappingURL=order.model.d.ts.map