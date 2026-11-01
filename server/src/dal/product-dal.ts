import { ObjectId, type WithId, type Filter } from "mongodb";
import { getDatabase } from "../config/db.js";
import type { ProductDoc, ProductFilterQuery } from "../model/product.model.js";

function db() {
    return getDatabase();
}

export async function insertProduct(productDoc: ProductDoc) {
    return await db().collection<ProductDoc>("products").insertOne(productDoc);
}

export async function insertManyProduct(productDocs: ProductDoc[]) {
    return await db().collection<ProductDoc>("products").insertMany(productDocs);
}

export async function findProductById(productId: string | ObjectId): Promise<WithId<ProductDoc> | null> {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection<ProductDoc>("products").findOne({ _id }) as WithId<ProductDoc> | null;
}

export async function findProductsByVendorId(vendorId: string | ObjectId): Promise<WithId<ProductDoc>[]> {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<ProductDoc>("products").find({ vendorId: _id }).toArray() as WithId<ProductDoc>[];
}

export async function findAllProducts(): Promise<WithId<ProductDoc>[]> {
    return await db().collection<ProductDoc>("products").find({}).toArray() as WithId<ProductDoc>[];
}

export async function updateProductById(productId: string | ObjectId, fields: Partial<ProductDoc>) {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection<ProductDoc>("products").updateOne(
        { _id },
        { $set: { ...fields, updatedAt: new Date() } }
    );
}

export async function filterProductByName(query: string): Promise<WithId<ProductDoc>[]> {
    const safeQuery = query ? String(query).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
    if (!safeQuery) {
        return await db().collection<ProductDoc>("products").find({}).toArray() as WithId<ProductDoc>[];
    }
    return await db().collection<ProductDoc>("products").find({
        productName: { $regex: safeQuery, $options: "i" }
    }).toArray() as WithId<ProductDoc>[];
}

export async function filterProducts(filters: ProductFilterQuery = {}): Promise<WithId<ProductDoc>[]> {
    const query: Filter<ProductDoc> = {};

    if (filters.name || filters.q || filters.search) {
        const rawSearch = filters.name || filters.q || filters.search;
        const safeName = String(rawSearch).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.productName = { $regex: safeName, $options: "i" } as any;
    }

    if (filters.category) {
        const safeCategory = String(filters.category).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.productCategory = { $regex: safeCategory, $options: "i" } as any;
    }

    const priceConditions: any = {};
    if (filters.minPrice !== undefined && filters.minPrice !== "") {
        priceConditions.$gte = Number(filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
        priceConditions.$lte = Number(filters.maxPrice);
    }
    if (filters.price !== undefined && filters.price !== "") {
        priceConditions.$eq = Number(filters.price);
    }

    if (Object.keys(priceConditions).length > 0) {
        query.currentPrice = priceConditions;
    }

    return await db().collection<ProductDoc>("products").find(query).toArray() as WithId<ProductDoc>[];
}
