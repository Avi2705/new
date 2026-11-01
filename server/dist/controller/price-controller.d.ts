import type { Request, Response } from "express";
export declare function setProductPrice(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getProductPrice(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const priceController: {
    setProductPrice: typeof setProductPrice;
    getProductPrice: typeof getProductPrice;
};
export default priceController;
//# sourceMappingURL=price-controller.d.ts.map