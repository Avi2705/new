import type { Request, Response } from "express";
export declare function createOfferController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function validateOfferController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getVendorOffersController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteOfferController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const offerController: {
    createOfferController: typeof createOfferController;
    validateOfferController: typeof validateOfferController;
    getVendorOffersController: typeof getVendorOffersController;
    deleteOfferController: typeof deleteOfferController;
};
export default offerController;
//# sourceMappingURL=offer-controller.d.ts.map