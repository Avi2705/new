import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllProducts, addToCart } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import type { Product } from "../../types";

const CATEGORIES = ["all", "watch", "fridge", "grocery", "tv", "laptop", "mobile", "buds", "furniture", "electronics"];

export default function ProductsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const activeCategory = searchParams.get("category") ?? "all";

  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res.products || []))
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleQuickAddToCart(productId: string) {
    if (!user) {
      toast.warning("Please sign in as a customer to add items to your cart.");
      return;
    }

    try {
      await addToCart(productId, 1);
      toast.success("Item added to cart!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    }
  }

  const filtered = products.filter((p) => {
    const rawCat = p.productCategory || p.category || "";
    const matchCategory =
      activeCategory === "all" || rawCat.toLowerCase() === activeCategory.toLowerCase();
    const rawDesc = p.productDescription || p.description || "";
    const matchSearch =
      !search.trim() ||
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      rawDesc.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Store Catalog</h1>
        <p className="text-sm text-gray-500">
          Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
        <div className="w-full md:w-80">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or keyword..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSearchParams(cat === "all" ? {} : { category: cat })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading products catalog...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500 text-sm">
          No products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const price = product.currentPrice ?? product.price;
            const category = product.productCategory || product.category || "General";
            const desc = product.productDescription || product.description;
            const images = product.productImages || product.images || [];
            const mainImage = images[0];

            return (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  <Link
                    to={`/products/${product._id}`}
                    className="block w-full aspect-[4/3] bg-gray-50 rounded-md overflow-hidden mb-3 border border-gray-100 relative"
                  >
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded capitalize">
                      {category}
                    </span>
                    <span className="text-xs text-green-600 font-medium">In Stock</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
                    <Link to={`/products/${product._id}`} className="hover:text-blue-600">
                      {product.productName}
                    </Link>
                  </h3>
                  {desc && (
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                      {desc}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-xs text-gray-400 block">Price</span>
                    <span className="text-lg font-bold text-gray-900">
                      {price != null ? `$${price.toFixed(2)}` : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickAddToCart(product._id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1.5 rounded transition"
                      title="Quick Add to Cart"
                    >
                      + Cart
                    </button>
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
