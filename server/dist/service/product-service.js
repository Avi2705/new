import { ObjectId } from "mongodb";
import { insertProduct, insertManyProduct, findProductById, findProductsByVendorId, findAllProducts, updateProductById, filterProductByName, filterProducts } from "../dal/product-dal.js";
import ApiHandler from "../utils/error-handler.js";
export async function createProduct(vendorId, data) {
    if (!vendorId || !ObjectId.isValid(vendorId)) {
        throw new ApiHandler(400, "Invalid vendor ID");
    }
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    const productDoc = {
        productName: data.productName.trim(),
        productDescription: data.productDescription.trim(),
        productCategory: data.productCategory.trim(),
        productImages: data.productImages || [],
        productVideos: data.productVideos || [],
        vendorId: _vendorId,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const result = await insertProduct(productDoc);
    return { _id: result.insertedId, ...productDoc };
}
export async function createManyProducts(vendorId, products) {
    if (!vendorId || !ObjectId.isValid(vendorId)) {
        throw new ApiHandler(400, "Invalid vendor ID");
    }
    if (!Array.isArray(products) || products.length === 0) {
        throw new ApiHandler(400, "Products array is required and must not be empty");
    }
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    const productDocs = products.map((data) => ({
        productName: data.productName.trim(),
        productDescription: data.productDescription.trim(),
        productCategory: data.productCategory.trim(),
        productImages: data.productImages || [],
        productVideos: data.productVideos || [],
        vendorId: _vendorId,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }));
    const result = await insertManyProduct(productDocs);
    return { insertedCount: result.insertedCount, insertedIds: result.insertedIds };
}
export async function getSingleProduct(productId) {
    if (!productId || !ObjectId.isValid(productId)) {
        throw new ApiHandler(400, "Invalid product ID");
    }
    const product = await findProductById(productId);
    if (!product || product.isDeleted) {
        throw new ApiHandler(404, "Product not found");
    }
    return product;
}
export async function getProductsForUser() {
    const products = await findAllProducts();
    return products.filter((p) => !p.isDeleted);
}
export async function getProductsForVendor(vendorId) {
    if (!vendorId || !ObjectId.isValid(vendorId)) {
        throw new ApiHandler(400, "Invalid vendor ID");
    }
    const products = await findProductsByVendorId(vendorId);
    return products.filter((p) => !p.isDeleted);
}
export async function updateProduct(vendorId, productId, updates) {
    if (!productId || !ObjectId.isValid(productId)) {
        throw new ApiHandler(400, "Invalid product ID");
    }
    const product = await findProductById(productId);
    if (!product || product.isDeleted) {
        throw new ApiHandler(404, "Product not found");
    }
    if (product.vendorId.toString() !== vendorId.toString()) {
        throw new ApiHandler(403, "Not authorized to update this product");
    }
    const allowedFields = ["productName", "productDescription", "productCategory", "productImages", "productVideos"];
    const fieldsToUpdate = {};
    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            fieldsToUpdate[key] = updates[key];
        }
    }
    if (Object.keys(fieldsToUpdate).length === 0) {
        throw new ApiHandler(400, "No valid fields provided for update");
    }
    await updateProductById(productId, fieldsToUpdate);
    return { ...product, ...fieldsToUpdate };
}
export async function searchProductsByName(query) {
    const products = await filterProductByName(query);
    return products.filter((p) => !p.isDeleted);
}
export async function filterProductsByCriteria(filters) {
    const products = await filterProducts(filters);
    return products.filter((p) => !p.isDeleted);
}
export const productService = {
    createProduct,
    createManyProducts,
    getSingleProduct,
    getProductsForUser,
    getProductsForVendor,
    updateProduct,
    searchProductsByName,
    filterProductsByCriteria
};
//# sourceMappingURL=product-service.js.map