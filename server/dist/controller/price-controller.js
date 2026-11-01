import { setPrice, getPrice } from "../service/price-service.js";
export async function setProductPrice(req, res) {
    try {
        const vendorId = req.user.id;
        const { productId, price } = req.body;
        const result = await setPrice(vendorId, productId, price);
        return res.status(200).json({ message: "Price set successfully", price: result });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function getProductPrice(req, res) {
    try {
        const { productId } = req.params;
        const targetProductId = Array.isArray(productId) ? productId[0] : productId;
        const result = await getPrice(targetProductId);
        return res.status(200).json({ price: result });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export const priceController = {
    setProductPrice,
    getProductPrice
};
export default priceController;
//# sourceMappingURL=price-controller.js.map