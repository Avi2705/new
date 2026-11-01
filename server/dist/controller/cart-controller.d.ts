import type { Request, Response } from "express";
export declare function addToCartController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getCartController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function clearCartController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const cartController: {
    addToCartController: typeof addToCartController;
    getCartController: typeof getCartController;
    clearCartController: typeof clearCartController;
};
export default cartController;
//# sourceMappingURL=cart-controller.d.ts.map