import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCart, clearCart, placeOrder } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import type { Cart as CartType } from "../../types";

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  async function fetchCart() {
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.cart);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user, navigate]);

  async function handleClear() {
    try {
      await clearCart();
      setCart(null);
      toast.success("Shopping cart cleared!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to clear cart");
    }
  }

  async function handleCheckout() {
    if (!cart?.items || cart.items.length === 0) {
      toast.warning("Your cart is empty.");
      return;
    }

    setPlacing(true);

    try {
      const orderPayload = cart.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));

      await placeOrder(orderPayload);
      await clearCart();
      toast.success("Order placed successfully!");
      setCart(null);
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Loading your cart...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      {!cart || !cart.items || cart.items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Your cart is currently empty.</p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">
                Cart Items ({cart.items.length})
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {item.productName || `Product ID: ${item.productId}`}
                    </Link>
                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {item.price != null ? `$${(item.price * item.quantity).toFixed(2)}` : "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
            <h2 className="font-semibold text-gray-900 mb-4 text-sm">Summary</h2>

            <div className="flex justify-between items-center text-sm mb-4 pb-3 border-b border-gray-100">
              <span className="text-gray-500">Order Total:</span>
              <span className="text-xl font-bold text-gray-900">
                ${cart.totalAmount?.toFixed(2) || "0.00"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={placing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md text-sm transition disabled:opacity-50"
            >
              {placing ? "Processing Order..." : "Confirm & Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
