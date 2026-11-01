import type { Request, Response } from "express";
export declare function placeOrderController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUserOrdersController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getVendorOrdersController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getSingleOrderController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const orderController: {
    placeOrderController: typeof placeOrderController;
    getUserOrdersController: typeof getUserOrdersController;
    getVendorOrdersController: typeof getVendorOrdersController;
    getSingleOrderController: typeof getSingleOrderController;
};
export default orderController;
//# sourceMappingURL=order-controller.d.ts.map