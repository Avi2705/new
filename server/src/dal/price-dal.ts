import { ObjectId, type WithId } from "mongodb";
import { getDatabase } from "../config/db.js";
import type { PriceDoc } from "../model/price.model.js";

function db() {
    return getDatabase();
}

export async function insertPrice(priceDoc: PriceDoc) {
    return await db().collection<PriceDoc>("productPrices").insertOne(priceDoc);
}

export async function deactivateActivePrices(productId: string | ObjectId) {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection<PriceDoc>("productPrices").updateMany(
        { productId: _id, isActive: true },
        { $set: { isActive: false, updatedAt: new Date() } }
    );
}

export async function findActivePrice(productId: string | ObjectId): Promise<WithId<PriceDoc> | null> {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection<PriceDoc>("productPrices").findOne({ productId: _id, isActive: true }) as WithId<PriceDoc> | null;
}

export async function findAllPricesByProductId(productId: string | ObjectId): Promise<WithId<PriceDoc>[]> {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection<PriceDoc>("productPrices").find({ productId: _id }).sort({ createdAt: -1 }).toArray() as WithId<PriceDoc>[];
}

export async function activatePriceById(priceId: string | ObjectId, productId: string | ObjectId) {
    const _priceId = typeof priceId === "string" ? new ObjectId(priceId) : priceId;
    const _productId = typeof productId === "string" ? new ObjectId(productId) : productId;
    await db().collection<PriceDoc>("productPrices").updateMany(
        { productId: _productId, isActive: true },
        { $set: { isActive: false, updatedAt: new Date() } }
    );
    return await db().collection<PriceDoc>("productPrices").updateOne(
        { _id: _priceId },
        { $set: { isActive: true, updatedAt: new Date() } }
    );
}
