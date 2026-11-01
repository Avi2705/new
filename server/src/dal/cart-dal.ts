import { ObjectId, type WithId } from "mongodb";
import { getDatabase } from "../config/db.js";
import type { CartDoc } from "../model/cart.model.js";

function db() {
    return getDatabase();
}

export async function findCartByUserId(userId: string | ObjectId): Promise<WithId<CartDoc> | null> {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<CartDoc>("carts").findOne({ userId: _userId }) as WithId<CartDoc> | null;
}

export async function createCart(userId: string | ObjectId, items: any[] = []) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    const doc: CartDoc = {
        userId: _userId,
        items,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    return await db().collection<CartDoc>("carts").insertOne(doc);
}

export async function updateCart(userId: string | ObjectId, items: any[]) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<CartDoc>("carts").updateOne(
        { userId: _userId },
        { $set: { items, updatedAt: new Date() } }
    );
}

export async function clearCart(userId: string | ObjectId) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<CartDoc>("carts").updateOne(
        { userId: _userId },
        { $set: { items: [], updatedAt: new Date() } }
    );
}
