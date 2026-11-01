import { ObjectId, type WithId } from "mongodb";
import type { CartDoc } from "../model/cart.model.js";
export declare function findCartByUserId(userId: string | ObjectId): Promise<WithId<CartDoc> | null>;
export declare function createCart(userId: string | ObjectId, items?: any[]): Promise<import("mongodb").InsertOneResult<CartDoc>>;
export declare function updateCart(userId: string | ObjectId, items: any[]): Promise<import("mongodb").UpdateResult<CartDoc>>;
export declare function clearCart(userId: string | ObjectId): Promise<import("mongodb").UpdateResult<CartDoc>>;
//# sourceMappingURL=cart-dal.d.ts.map