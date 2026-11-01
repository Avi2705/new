import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserOrders } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import type { Order } from "../../types";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    getUserOrders()
      .then((res) => setOrders(res.orders || []))
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load order history");
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">You have not placed any orders yet.</p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-3 mb-3 gap-2">
                <div>
                  <span className="text-xs text-gray-400 block">Order ID</span>
                  <span className="font-mono text-xs font-semibold text-gray-700">{o._id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize">
                    {o.status || "Placed"}
                  </span>
                </div>
              </div>

              <div className="text-sm space-y-1 mb-3">
                {o.items && o.items.length > 0 ? (
                  <div className="space-y-1">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                        <span className="font-medium text-gray-900">
                          {it.productName || `Product (${it.productId})`}
                        </span>
                        <span className="text-gray-500">
                          Qty: {it.quantity} × ${it.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Product:</span>{" "}
                    {o.productName || "Product"} (Qty: {o.quantity || 1})
                  </p>
                )}
                {o.shippingAddress && (
                  <p className="text-gray-600 text-xs mt-2">
                    <span className="font-medium text-gray-700">Destination:</span>{" "}
                    {o.shippingAddress}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-sm">
                <span className="font-medium text-gray-700">Total Paid:</span>
                <span className="text-base font-bold text-gray-900">
                  ${o.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
