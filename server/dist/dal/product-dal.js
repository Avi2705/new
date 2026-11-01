import { ObjectId } from "mongodb";
import { getDatabase } from "../config/db.js";
function db() {
    return getDatabase();
}
export async function insertProduct(productDoc) {
    return await db().collection("products").insertOne(productDoc);
}
export async function insertManyProduct(productDocs) {
    return await db().collection("products").insertMany(productDocs);
}
export async function findProductById(productId) {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection("products").findOne({ _id });
}
export async function findProductsByVendorId(vendorId) {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("products").find({ vendorId: _id }).toArray();
}
export async function findAllProducts() {
    return await db().collection("products").find({}).toArray();
}
export async function updateProductById(productId, fields) {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection("products").updateOne({ _id }, { $set: { ...fields, updatedAt: new Date() } });
}
export async function filterProductByName(query) {
    const safeQuery = query ? String(query).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
    if (!safeQuery) {
        return await db().collection("products").find({}).toArray();
    }
    return await db().collection("products").find({
        productName: { $regex: safeQuery, $options: "i" }
    }).toArray();
}
export async function filterProducts(filters = {}) {
    const query = {};
    if (filters.name || filters.q || filters.search) {
        const rawSearch = filters.name || filters.q || filters.search;
        const safeName = String(rawSearch).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.productName = { $regex: safeName, $options: "i" };
    }
    if (filters.category) {
        const safeCategory = String(filters.category).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.productCategory = { $regex: safeCategory, $options: "i" };
    }
    const priceConditions = {};
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
    return await db().collection("products").find(query).toArray();
}
//# sourceMappingURL=product-dal.js.map