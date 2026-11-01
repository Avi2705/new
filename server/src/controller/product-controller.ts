import type { Request, Response } from "express";
import { productService } from "../service/product-service.js";

export async function createProduct(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const product = await productService.createProduct(vendorId, req.body);
        return res.status(201).json({ message: "Product created successfully", product });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function createManyProducts(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const result = await productService.createManyProducts(vendorId, req.body.products || req.body);
        return res.status(201).json({ message: "Products created successfully", ...result });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getSingleProductController(req: Request, res: Response) {
    try {
        const { productId } = req.params;
        const targetProductId = Array.isArray(productId) ? productId[0] : productId;
        const product = await productService.getSingleProduct(targetProductId!);
        return res.status(200).json({ product });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getProductsForUser(_req: Request, res: Response) {
    try {
        const products = await productService.getProductsForUser();
        return res.status(200).json({ count: products.length, products });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getMyProducts(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const products = await productService.getProductsForVendor(vendorId);
        return res.status(200).json({ count: products.length, products });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function updateProduct(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const { productId } = req.params;
        const targetId = Array.isArray(productId) ? productId[0] : productId;
        const product = await productService.updateProduct(vendorId, targetId!, req.body);
        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function searchProducts(req: Request, res: Response) {
    try {
        const { q, name, category, minPrice, maxPrice, price } = req.query;
        let products;

        if (q || name) {
            products = await productService.searchProductsByName(String(q || name));
        } else if (category || minPrice || maxPrice || price) {
            products = await productService.filterProductsByCriteria(req.query as any);
        } else {
            products = await productService.getProductsForUser();
        }

        return res.status(200).json({ count: products.length, products });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export const productController = {
    createProduct,
    createManyProducts,
    getSingleProductController,
    getProductsForUser,
    getMyProducts,
    updateProduct,
    searchProducts
};

export default productController;
