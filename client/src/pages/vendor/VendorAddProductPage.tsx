import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct, setProductPrice } from "../../api";

export default function VendorAddProductPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("electronics");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageField = (index: number) => {
    if (imageUrls.length <= 1) {
      setImageUrls([""]);
      return;
    }
    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const filteredImages = imageUrls
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const filteredVideos = videoUrl.trim() ? [videoUrl.trim()] : [];

    try {
      const res = await createProduct({
        productName: name,
        productCategory: category,
        productDescription: description,
        productImages: filteredImages,
        productVideos: filteredVideos,
      });

      const newProductId = res.product?._id;
      if (newProductId && price) {
        await setProductPrice(newProductId, parseFloat(price));
      }

      toast.success("Product created and published with media successfully!");
      setTimeout(() => navigate("/vendor/products"), 1500);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Product</h1>
        <p className="text-sm text-gray-500 mb-6">
          List a new product in the store with images, video, and pricing
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ultra HD 4K Smart Monitor"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="watch">Watch</option>
                <option value="laptop">Laptop</option>
                <option value="mobile">Mobile</option>
                <option value="buds">Buds</option>
                <option value="tv">TV</option>
                <option value="fridge">Fridge</option>
                <option value="grocery">Grocery</option>
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Initial Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 199.99"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              maxLength={100}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short product overview (max 100 characters)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-gray-700">
                Product Images (At least 2-3 image URLs for carousel)
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Another Image URL
              </button>
            </div>

            <div className="space-y-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 w-6 text-center">
                    #{idx + 1}
                  </span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                    placeholder={`Image URL ${idx + 1} (e.g. https://images.unsplash.com/...)`}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-3 overflow-x-auto">
              {imageUrls.filter((u) => u.trim().length > 0).map((u, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50"
                >
                  <img
                    src={u}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Video URL (Optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="e.g. https://assets.mixkit.co/...mp4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md text-sm transition disabled:opacity-50"
            >
              {loading ? "Publishing Product..." : "Create & Publish Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/vendor/products")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-md text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
