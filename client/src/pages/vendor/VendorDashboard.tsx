import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getVendorProfile,
  getVendorProducts,
  getVendorOrders,
  getVendorOffers,
  getVendorReviews,
} from "../../api";
import type { Vendor } from "../../types";

export default function VendorDashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Vendor | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || role !== "vendor") {
      navigate("/login");
      return;
    }

    Promise.allSettled([
      getVendorProfile(),
      getVendorProducts(),
      getVendorOrders(),
      getVendorOffers(),
      getVendorReviews(),
    ]).then(([pr, p, o, of, r]) => {
      if (pr.status === "fulfilled") setProfile(pr.value.vendor);
      if (p.status === "fulfilled") setProductCount(p.value.count || p.value.products?.length || 0);
      if (o.status === "fulfilled") setOrderCount(o.value.orders?.length || 0);
      if (of.status === "fulfilled") setOfferCount(of.value.count || of.value.offers?.length || 0);
      if (r.status === "fulfilled") setReviewCount(r.value.count || r.value.reviews?.length || 0);
      setLoading(false);
    });
  }, [user, role, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Merchant Operations Hub
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back, {profile?.name || user?.name}! Monitor products, pricing, reviews, and export data.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading dashboard analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                My Products
              </span>
              <div className="text-3xl font-extrabold text-gray-900 mb-2">{productCount}</div>
              <Link to="/vendor/products" className="text-xs text-blue-600 hover:underline font-medium">
                Manage Inventory &rarr;
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Customer Orders
              </span>
              <div className="text-3xl font-extrabold text-gray-900 mb-2">{orderCount}</div>
              <Link to="/vendor/orders" className="text-xs text-blue-600 hover:underline font-medium">
                View Incoming Orders &rarr;
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Active Coupons
              </span>
              <div className="text-3xl font-extrabold text-gray-900 mb-2">{offerCount}</div>
              <Link to="/vendor/offers" className="text-xs text-blue-600 hover:underline font-medium">
                Manage Offers &rarr;
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Customer Reviews
              </span>
              <div className="text-3xl font-extrabold text-gray-900 mb-2">{reviewCount}</div>
              <Link to="/vendor/reviews" className="text-xs text-blue-600 hover:underline font-medium">
                Review Feedback &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Vendor Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/vendor/add-product"
                className="p-4 border border-blue-100 bg-blue-50/50 hover:bg-blue-50 rounded-lg text-center transition"
              >
                <div className="font-semibold text-sm text-blue-900 mb-1">+ Add New Product</div>
                <div className="text-xs text-blue-700">List an item in the store</div>
              </Link>
              <Link
                to="/vendor/set-price"
                className="p-4 border border-gray-200 hover:bg-gray-50 rounded-lg text-center transition"
              >
                <div className="font-semibold text-sm text-gray-900 mb-1">Update Prices</div>
                <div className="text-xs text-gray-500">Change product price point</div>
              </Link>
              <Link
                to="/vendor/offers"
                className="p-4 border border-gray-200 hover:bg-gray-50 rounded-lg text-center transition"
              >
                <div className="font-semibold text-sm text-gray-900 mb-1">Create Offer Code</div>
                <div className="text-xs text-gray-500">Run a promotional discount</div>
              </Link>
              <Link
                to="/vendor/export"
                className="p-4 border border-gray-200 hover:bg-gray-50 rounded-lg text-center transition"
              >
                <div className="font-semibold text-sm text-gray-900 mb-1">Export Catalog</div>
                <div className="text-xs text-gray-500">Trigger ZIP & CSV download</div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
