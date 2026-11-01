import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductById, getProductReviews, addReview, addToCart } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import ImageSlider from "../../components/common/ImageSlider";
import type { Product, Review } from "../../types";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [mediaTab, setMediaTab] = useState<"images" | "video">("images");

  useEffect(() => {
    if (!productId) return;
    Promise.allSettled([
      getProductById(productId),
      getProductReviews(productId),
    ]).then(([pRes, rRes]) => {
      if (pRes.status === "fulfilled") setProduct(pRes.value.product);
      if (rRes.status === "fulfilled") setReviews(rRes.value.reviews || []);
      setLoading(false);
    });
  }, [productId]);

  async function handleAddToCart() {
    if (!productId) return;
    if (!user) {
      toast.warning("Please sign in as a customer to add items to your cart.");
      return;
    }
    try {
      await addToCart(productId, quantity);
      toast.success(`Added ${quantity} item(s) to your shopping cart!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    }
  }

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    try {
      await addReview(productId, comment, rating);
      toast.success("Review submitted successfully!");
      setComment("");
      const updated = await getProductReviews(productId);
      setReviews(updated.reviews || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to post review");
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">Product not found.</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          &larr; Back to all products
        </Link>
      </div>
    );
  }

  const price = product.currentPrice ?? product.price;
  const category = product.productCategory || product.category || "General";
  const desc = product.productDescription || product.description;
  const images = product.productImages || product.images || [];
  const videos = product.productVideos || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/products"
        className="text-blue-600 hover:underline text-sm mb-6 inline-flex items-center gap-1"
      >
        <span>&larr;</span> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          {videos.length > 0 && (
            <div className="flex gap-2 mb-3 border-b border-gray-100 pb-2">
              <button
                type="button"
                onClick={() => setMediaTab("images")}
                className={`text-xs font-semibold px-3 py-1.5 rounded transition ${
                  mediaTab === "images"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Photos ({images.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaTab("video")}
                className={`text-xs font-semibold px-3 py-1.5 rounded transition ${
                  mediaTab === "video"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Video Preview
              </button>
            </div>
          )}

          {mediaTab === "images" || videos.length === 0 ? (
            <ImageSlider
              images={images}
              alt={product.productName}
              aspectRatio="aspect-square"
              showThumbnails={true}
            />
          ) : (
            <div className="w-full aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <video
                src={videos[0]}
                controls
                className="w-full h-full object-contain"
                playsInline
              />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded capitalize">
              {category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 mb-2">
              {product.productName}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {desc || "High quality product offered by verified seller."}
            </p>

            <div className="text-3xl font-extrabold text-gray-900 mb-6">
              {price != null ? `$${price.toFixed(2)}` : "Price on request"}
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
              <div className="w-24">
                <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md transition text-sm flex-1"
              >
                Add to Shopping Cart
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Customer Reviews ({reviews.length})
            </h2>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-2 mb-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-yellow-500">★ {r.rating}/5</span>
                      <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-800">{r.comment}</p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <form onSubmit={handleAddReview} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Post a Review</h3>
                  <div className="flex gap-4">
                    <div className="w-32">
                      <label className="block text-xs text-gray-500 mb-1">Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Comment</label>
                      <input
                        type="text"
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your feedback..."
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded transition"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <p className="text-xs text-gray-500">
                  <Link to="/login" className="text-blue-600 underline">
                    Sign in
                  </Link>{" "}
                  as customer to post a review.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
