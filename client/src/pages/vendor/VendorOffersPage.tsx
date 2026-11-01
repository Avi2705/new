import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createOffer, getVendorOffers, deleteOffer } from "../../api";
import type { Offer } from "../../types";

export default function VendorOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadOffers() {
    setLoading(true);
    try {
      const res = await getVendorOffers();
      setOffers(res.offers || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load offers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOffers();
  }, []);

  async function handleCreateOffer(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    try {
      await createOffer({
        offerCode: code.toUpperCase(),
        discountPercent: parseInt(discount),
        validUntil: new Date(validUntil).toISOString(),
      });
      toast.success("Promotional offer created successfully!");
      setCode("");
      setDiscount("");
      setValidUntil("");
      await loadOffers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create offer");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(offerId: string) {
    try {
      await deleteOffer(offerId);
      toast.success("Offer deleted!");
      await loadOffers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete offer");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Discount Offers & Coupons</h1>
        <p className="text-sm text-gray-500">
          Create promotional discount codes for your customers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Create New Offer</h2>
          <form onSubmit={handleCreateOffer} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={20}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER25"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Discount Percentage (1 - 99%) *
              </label>
              <input
                type="number"
                min="1"
                max="99"
                required
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="25"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Expiration Date *
              </label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm transition disabled:opacity-50"
            >
              {creating ? "Creating..." : "Publish Offer"}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Active Offers ({offers.length})
          </h2>

          {loading ? (
            <p className="text-sm text-gray-500">Loading coupons...</p>
          ) : offers.length === 0 ? (
            <p className="text-sm text-gray-500">No discount offers created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm divide-y divide-gray-100">
                <thead className="text-xs text-gray-400 uppercase">
                  <tr>
                    <th className="py-2">Code</th>
                    <th className="py-2">Discount</th>
                    <th className="py-2">Valid Until</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {offers.map((o) => (
                    <tr key={o._id}>
                      <td className="py-2.5 font-mono font-bold text-blue-700">{o.offerCode}</td>
                      <td className="py-2.5 font-semibold text-green-700">{o.discountPercent}% OFF</td>
                      <td className="py-2.5 text-xs text-gray-600">
                        {new Date(o.validUntil).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(o._id)}
                          className="text-xs text-red-600 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
