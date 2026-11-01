import type { ObjectId } from "mongodb";

export interface OrderItem {
    productId: ObjectId;
    productName?: string;
    vendorId?: ObjectId;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface OrderDoc {
    _id?: ObjectId;
    userId: ObjectId;
    productId?: ObjectId;
    productName?: string;
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
    items?: { productId: string; quantity: number }[];
}
