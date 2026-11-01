import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getVendorReviews } from "../../api";
import type { Review } from "../../types";

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorReviews()
      .then((res) => setReviews(res.reviews || []))
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load reviews");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Reviews & Ratings</h1>
        <p className="text-sm text-gray-500">
          Feedback submitted by customers on your products ({reviews.length} total)
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500 text-sm">
          No customer reviews received yet.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-bold text-sm">★ {r.rating}/5</span>
                  <span className="text-xs text-gray-600 font-medium">
                    {r.productName || r.productId}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              {r.userName && (
                <p className="text-xs text-gray-500 mb-1">By: {r.userName}</p>
              )}
              <p className="text-sm text-gray-800 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
