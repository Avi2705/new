import { addItemToCart, getUserCart, emptyUserCart } from "../service/cart-service.js";
export async function addToCartController(req, res) {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const cart = await addItemToCart(userId, { productId, quantity });
        return res.status(200).json({ message: "Item added to cart", cart });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function getCartController(req, res) {
    try {
        const userId = req.user.id;
        const cart = await getUserCart(userId);
        return res.status(200).json({ cart });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function clearCartController(req, res) {
    try {
        const userId = req.user.id;
        const result = await emptyUserCart(userId);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export const cartController = {
    addToCartController,
    getCartController,
    clearCartController
};
export default cartController;
//# sourceMappingURL=cart-controller.js.map