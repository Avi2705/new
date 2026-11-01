import { ObjectId, type WithId } from "mongodb";
import type { OrderDoc } from "../model/order.model.js";
export declare function insertOrder(orderDoc: OrderDoc): Promise<import("mongodb").InsertOneResult<OrderDoc>>;
export declare function findOrdersByUserId(userId: string | ObjectId): Promise<WithId<OrderDoc>[]>;
export declare function findOrdersByVendorId(vendorId: string | ObjectId): Promise<WithId<OrderDoc>[]>;
export declare function findOrderById(orderId: string | ObjectId): Promise<WithId<OrderDoc> | null>;
//# sourceMappingURL=order-dal.d.ts.map