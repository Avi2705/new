import type { Request, Response } from "express";
export declare function createProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createManyProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getSingleProductController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getProductsForUser(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMyProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function searchProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const productController: {
    createProduct: typeof createProduct;
    createManyProducts: typeof createManyProducts;
    getSingleProductController: typeof getSingleProductController;
    getProductsForUser: typeof getProductsForUser;
    getMyProducts: typeof getMyProducts;
    updateProduct: typeof updateProduct;
    searchProducts: typeof searchProducts;
};
export default productController;
//# sourceMappingURL=product-controller.d.ts.map