import type { Request, Response } from "express";
import { setPrice, getPrice, getAllPricesForProduct, activateExistingPrice } from "../service/price-service.js";

export async function setProductPrice(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const { productId, price } = req.body;
        const result = await setPrice(vendorId, productId, price);
        return res.status(200).json({ message: "Price set successfully", price: result });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getProductPrice(req: Request, res: Response) {
    try {
        const { productId } = req.params;
        const targetProductId = Array.isArray(productId) ? productId[0] : productId;
        const result = await getPrice(targetProductId!);
        return res.status(200).json({ price: result });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getAllProductPricesController(req: Request, res: Response) {
    try {
        const { productId } = req.params;
        const targetProductId = Array.isArray(productId) ? productId[0] : productId;
        const prices = await getAllPricesForProduct(targetProductId!);
        return res.status(200).json({ prices });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function activatePriceController(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const priceId = Array.isArray(req.params.priceId) ? req.params.priceId[0]! : req.params.priceId!;
        const { productId } = req.body;
        const result = await activateExistingPrice(vendorId, productId, priceId);
        return res.status(200).json({ message: "Price activated successfully", price: result });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export const priceController = {
    setProductPrice,
    getProductPrice,
    getAllProductPricesController,
    activatePriceController
};

export default priceController;
