import express, {} from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireRole } from "../middleware/role-middleware.js";
import { validateRequest } from "../middleware/validation-middleware.js";
import { createOfferSchema } from "../schemas/offer-schema.js";
import { offerController } from "../controller/offer-controller.js";
const offerRouter = express.Router();
offerRouter.post("/create", authMiddleware, requireRole("vendor"), validateRequest(createOfferSchema), offerController.createOfferController);
offerRouter.get("/vendor-offers", authMiddleware, requireRole("vendor"), offerController.getVendorOffersController);
offerRouter.get("/validate/:code", offerController.validateOfferController);
offerRouter.delete("/:offerId", authMiddleware, requireRole("vendor"), offerController.deleteOfferController);
export default offerRouter;
//# sourceMappingURL=offer-routes.js.map