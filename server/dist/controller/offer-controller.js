import { createOffer, validateOffer, getVendorOffers, removeOffer } from "../service/offer-service.js";
export async function createOfferController(req, res) {
    try {
        const vendorId = req.user.id;
        const offer = await createOffer(vendorId, req.body);
        return res.status(201).json({ message: "Offer created successfully", offer });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function validateOfferController(req, res) {
    try {
        const { code } = req.params;
        const offerCode = Array.isArray(code) ? code[0] : code;
        const offer = await validateOffer(offerCode);
        return res.status(200).json({ valid: true, offer });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function getVendorOffersController(req, res) {
    try {
        const vendorId = req.user.id;
        const offers = await getVendorOffers(vendorId);
        return res.status(200).json({ count: offers.length, offers });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function deleteOfferController(req, res) {
    try {
        const vendorId = req.user.id;
        const { offerId } = req.params;
        const targetOfferId = Array.isArray(offerId) ? offerId[0] : offerId;
        const result = await removeOffer(vendorId, targetOfferId);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export const offerController = {
    createOfferController,
    validateOfferController,
    getVendorOffersController,
    deleteOfferController
};
export default offerController;
//# sourceMappingURL=offer-controller.js.map