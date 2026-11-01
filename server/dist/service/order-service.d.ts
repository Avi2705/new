import { ObjectId } from "mongodb";
import type { OrderDoc, OrderItem, PlaceOrderInput } from "../model/order.model.js";
export declare function placeOrder(userId: string | ObjectId, data: PlaceOrderInput): Promise<{
    userId: ObjectId;
    productId?: ObjectId;
    vendorId?: ObjectId;
    quantity?: number;
    items?: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    _id: ObjectId;
}>;
export declare function getUserOrders(userId: string | ObjectId): Promise<import("mongodb").WithId<OrderDoc>[]>;
export declare function getVendorOrders(vendorId: string | ObjectId): Promise<import("mongodb").WithId<OrderDoc>[]>;
export declare function getSingleOrder(orderId: string | ObjectId): Promise<import("mongodb").WithId<OrderDoc>>;
//# sourceMappingURL=order-service.d.ts.map