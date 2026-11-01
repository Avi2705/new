import { ObjectId } from "mongodb";
import {
    insertProduct,
    insertManyProduct,
    findProductById,
    findProductsByVendorId,
    findAllProducts,
    updateProductById,
    filterProductByName,
    filterProducts
} from "../dal/product-dal.js";
import ApiHandler from "../utils/error-handler.js";
import type { CreateProductInput, ProductDoc, ProductFilterQuery } from "../model/product.model.js";

export async function createProduct(vendorId: string | ObjectId, data: CreateProductInput) {
    if (!vendorId || !ObjectId.isValid(vendorId)) {
        throw new ApiHandler(400, "Invalid vendor ID");
    }

    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;

    const productDoc: ProductDoc = {
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

export async function createManyProducts(vendorId: string | ObjectId, products: CreateProductInput[]) {
    if (!vendorId || !ObjectId.isValid(vendorId)) {
        throw new ApiHandler(400, "Invalid vendor ID");
    }
    if (!Array.isArray(products) || products.length === 0) {
        throw new ApiHandler(400, "Products array is required and must not be empty");
    }

    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;

    const productDocs: ProductDoc[] = products.map((data) => ({
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

export async function getSingleProduct(productId: string | ObjectId) {
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

export async function getProductsForVendor(vendorId: string | ObjectId) {
    if (!vendorId || !ObjectId.isValid(vendorId)) {
        throw new ApiHandler(400, "Invalid vendor ID");
    }

    const products = await findProductsByVendorId(vendorId);
    return products.filter((p) => !p.isDeleted);
}

export async function updateProduct(vendorId: string | ObjectId, productId: string | ObjectId, updates: Partial<CreateProductInput>) {
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
    const fieldsToUpdate: any = {};

    for (const key of allowedFields) {
        if ((updates as any)[key] !== undefined) {
            fieldsToUpdate[key] = (updates as any)[key];
        }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        throw new ApiHandler(400, "No valid fields provided for update");
    }

    await updateProductById(productId, fieldsToUpdate);
    return { ...product, ...fieldsToUpdate };
}

export async function searchProductsByName(query: string) {
    const products = await filterProductByName(query);
    return products.filter((p) => !p.isDeleted);
}

export async function filterProductsByCriteria(filters: ProductFilterQuery) {
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
