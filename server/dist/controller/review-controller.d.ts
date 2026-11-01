import type { Request, Response } from "express";
export declare function addReviewController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getProductReviewsController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getVendorReviewsController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const reviewController: {
    addReviewController: typeof addReviewController;
    getProductReviewsController: typeof getProductReviewsController;
    getVendorReviewsController: typeof getVendorReviewsController;
};
export default reviewController;
//# sourceMappingURL=review-controller.d.ts.map