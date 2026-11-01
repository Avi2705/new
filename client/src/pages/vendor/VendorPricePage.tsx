import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getVendorProducts, setProductPrice, getProductPriceHistory, activateExistingPrice } from "../../api";
import type { Product, PriceRecord } from "../../types";

export default function VendorPricePage() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("productId") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(preselectedId);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [priceHistory, setPriceHistory] = useState<PriceRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await getVendorProducts();
      setProducts(res.products || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function loadPriceHistory(productId: string) {
    if (!productId) {
      setPriceHistory([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const res = await getProductPriceHistory(productId);
      setPriceHistory(res.prices || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load price history");
      setPriceHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      loadPriceHistory(selectedProductId);
    } else {
      setPriceHistory([]);
    }
  }, [selectedProductId]);

  async function handlePriceUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProductId || !newPrice) return;
    setUpdating(true);
    try {
      await setProductPrice(selectedProductId, parseFloat(newPrice));
      toast.success("New price set successfully!");
      setNewPrice("");
      await loadProducts();
      await loadPriceHistory(selectedProductId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update price");
    } finally {
      setUpdating(false);
    }
  }

  async function handleActivatePrice(priceId: string) {
    setActivatingId(priceId);
    try {
      await activateExistingPrice(priceId, selectedProductId);
      toast.success("Price activated successfully!");
      await loadProducts();
      await loadPriceHistory(selectedProductId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to activate price");
    } finally {
      setActivatingId(null);
    }
  }

  function handleProductChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedProductId(e.target.value);
    setNewPrice("");
  }

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Product Prices</h1>
        <p className="text-sm text-gray-500 mb-6">
          View price history, reactivate old prices, or set a new price
        </p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading inventory items...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products found. Add products first.</p>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Product *
            </label>
            <select
              value={selectedProductId}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Choose from your listed products --</option>
              {products.map((p) => {
                const currentP = p.currentPrice ?? p.price;
                return (
                  <option key={p._id} value={p._id}>
                    {p.productName} (Current: {currentP != null ? `$${currentP.toFixed(2)}` : "None"})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1 mb-6">
            <p>
              <strong>Product:</strong> {selectedProduct.productName}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.productCategory || selectedProduct.category}
            </p>
            <p>
              <strong>Current Price:</strong>{" "}
              {selectedProduct.currentPrice != null
                ? `$${selectedProduct.currentPrice.toFixed(2)}`
                : "No active price"}
            </p>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-3">Price History</h2>
          {historyLoading ? (
            <p className="text-gray-500 text-sm">Loading price history...</p>
          ) : priceHistory.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">No prices set yet for this product.</p>
          ) : (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-left text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Set On</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {priceHistory.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}{" "}
                        {new Date(p.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3">
                        {p.isActive ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!p.isActive && (
                          <button
                            onClick={() => handleActivatePrice(p._id)}
                            disabled={activatingId === p._id}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium disabled:opacity-50"
                          >
                            {activatingId === p._id ? "Activating..." : "Set as Active"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="text-lg font-semibold text-gray-900 mb-3">Add New Price</h2>
          <form onSubmit={handlePriceUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="e.g. 59.99"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md text-sm transition disabled:opacity-50"
            >
              {updating ? "Saving Price..." : "Save New Price"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
