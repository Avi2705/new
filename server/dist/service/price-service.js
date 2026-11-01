import { ObjectId } from "mongodb";
import { insertPrice, deactivateActivePrices, findActivePrice } from "../dal/price-dal.js";
import { findProductById } from "../dal/product-dal.js";
import ApiHandler from "../utils/error-handler.js";
import { getDatabase } from "../config/db.js";
export async function setPrice(vendorId, productId, price) {
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(String(productId)))
        throw new ApiHandler(400, "Invalid product ID");
    if (!vendorId || !/^[0-9a-fA-F]{24}$/.test(String(vendorId)))
        throw new ApiHandler(400, "Invalid vendor ID");
    const _productId = new ObjectId(productId);
    const _vendorId = new ObjectId(String(vendorId));
    const product = await findProductById(_productId);
    if (!product)
        throw new ApiHandler(404, "Product not found");
    if (product.vendorId.toString() !== _vendorId.toString())
        throw new ApiHandler(403, "Not authorized");
    await deactivateActivePrices(_productId);
    const priceDoc = {
        productId: _productId,
        price,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const result = await insertPrice(priceDoc);
    await getDatabase().collection("products").updateOne({ _id: _productId }, { $set: { currentPrice: price, updatedAt: new Date() } });
    return { _id: result.insertedId, ...priceDoc };
}
export async function getPrice(productId) {
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(String(productId))) {
        throw new ApiHandler(400, "Invalid product ID");
    }
    const _productId = new ObjectId(productId);
    const product = await findProductById(_productId);
    if (!product)
        throw new ApiHandler(404, "Product not found");
    const activePrice = await findActivePrice(_productId);
    if (!activePrice)
        throw new ApiHandler(404, "No active price set for this product");
    return activePrice;
}
//# sourceMappingURL=price-service.js.map