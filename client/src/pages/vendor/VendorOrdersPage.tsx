import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getVendorOrders, updateOrderStatus } from "../../api";
import type { Order } from "../../types";

const STATUS_OPTIONS = ["placed", "processing", "shipped", "delivered", "cancelled"];

function statusColor(status: string) {
  switch (status) {
    case "placed":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await getVendorOrders();
      setOrders(res.orders || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load vendor orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to "${newStatus}"`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Orders</h1>
        <p className="text-sm text-gray-500">
          Orders placed by customers for your vendor products ({orders.length} total)
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading incoming orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500 text-sm">
          No customer orders placed yet for your products.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Products Ordered</th>
                  <th className="px-6 py-3">Buyer ID</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Change Status</th>
                  <th className="px-6 py-3 text-right">Order Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{o._id}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {o.items && o.items.length > 0 ? (
                        <div className="space-y-1">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="text-xs text-gray-900">
                              <span className="font-semibold text-gray-900">
                                {it.productName || "Product"}
                              </span>{" "}
                              <span className="text-gray-500">
                                × {it.quantity} (${it.price})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-900 font-semibold">
                          {o.productName || "Product"} (Qty: {o.quantity || 1})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {o.userId?.toString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${statusColor(o.status || "placed")} text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize`}
                      >
                        {o.status || "placed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.status || "placed"}
                        disabled={updatingId === o._id || o.status === "delivered" || o.status === "cancelled"}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-right">
                      ${o.totalAmount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
