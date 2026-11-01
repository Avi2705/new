import express, { type Router, type Request, type Response, type NextFunction } from "express";
import { validateRequest } from "../middleware/validation-middleware.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireRole } from "../middleware/role-middleware.js";
import { createProductSchema } from "../schemas/product-schema.js";
import { productController } from "../controller/product-controller.js";
import upload from "../utils/multer-utils.js";

const productRouter: Router = express.Router();

function processUploads(req: Request, _res: Response, next: NextFunction) {
    const files: any[] = [];
    if (req.file) files.push(req.file);
    if (req.files) {
        if (Array.isArray(req.files)) {
            files.push(...req.files);
        } else {
            Object.values(req.files).forEach((arr: any) => files.push(...arr));
        }
    }
    if (files.length > 0) {
        const imagePaths: string[] = [];
        const videoPaths: string[] = [];

        files.forEach((f) => {
            const relPath = `uploads/${f.filename}`;
            if (f.mimetype.startsWith("video/")) {
                videoPaths.push(relPath);
            } else {
                imagePaths.push(relPath);
            }
        });

        if (imagePaths.length > 0) {
            req.body.productImages = imagePaths;
        }
        if (videoPaths.length > 0) {
            req.body.productVideos = videoPaths;
        }
    }
    next();
}

productRouter.get("/search", productController.searchProducts);
productRouter.get("/filter", productController.searchProducts);
productRouter.get("/all", productController.getProductsForUser);

productRouter.post("/create-many", authMiddleware, requireRole("vendor"), upload.any(), processUploads, validateRequest(createProductSchema), productController.createManyProducts);
productRouter.post("/create", authMiddleware, requireRole("vendor"), upload.any(), processUploads, validateRequest(createProductSchema), productController.createProduct);

productRouter.get("/my-products", authMiddleware, requireRole("vendor"), productController.getMyProducts);

productRouter.patch("/:productId", authMiddleware, requireRole("vendor"), upload.any(), processUploads, productController.updateProduct);

productRouter.get("/:productId", productController.getSingleProductController);

export default productRouter;
