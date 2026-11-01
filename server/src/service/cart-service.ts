import { ObjectId } from "mongodb";
import { findCartByUserId, createCart, updateCart, clearCart } from "../dal/cart-dal.js";
import { findProductById } from "../dal/product-dal.js";
import { findActivePrice } from "../dal/price-dal.js";
import ApiHandler from "../utils/error-handler.js";
import type { AddToCartInput, CartItem } from "../model/cart.model.js";

export async function addItemToCart(userId: string | ObjectId, { productId, quantity = 1 }: AddToCartInput) {
    if (!productId || !ObjectId.isValid(productId)) {
        throw new ApiHandler(400, "Invalid product ID");
    }

    const _productId = new ObjectId(productId);
    const product = await findProductById(_productId);
    if (!product || product.isDeleted) {
        throw new ApiHandler(404, "Product not found");
    }

    const activePrice = await findActivePrice(_productId);
    const price = activePrice ? activePrice.price : (product.currentPrice || 0);

    let cart = await findCartByUserId(userId);
    if (!cart) {
        await createCart(userId, [{ productId: _productId, quantity, price, total: price * quantity }]);
        return await findCartByUserId(userId);
    }

    const items: CartItem[] = [...cart.items];
    const existingIndex = items.findIndex((i) => i.productId.toString() === productId);

    if (existingIndex > -1 && items[existingIndex]) {
        items[existingIndex].quantity += quantity;
        items[existingIndex].price = price;
        items[existingIndex].total = items[existingIndex].quantity * price;
    } else {
        items.push({ productId: _productId, quantity, price, total: price * quantity });
    }

    await updateCart(userId, items);
    return await findCartByUserId(userId);
}

export async function getUserCart(userId: string | ObjectId) {
    const cart = await findCartByUserId(userId);
    if (!cart) {
        return { userId, items: [], totalAmount: 0 };
    }
    const totalAmount = cart.items.reduce((sum, item) => sum + (item.total || (item.price || 0) * item.quantity), 0);
    return { ...cart, totalAmount };
}

export async function emptyUserCart(userId: string | ObjectId) {
    await clearCart(userId);
    return { message: "Cart emptied successfully" };
}
