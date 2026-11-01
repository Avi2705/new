import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllProducts, addToCart } from "../api";
import { useAuth } from "../hooks/useAuth";
import type { Product } from "../types";

const CATEGORIES = [
  { name: "Watches", value: "watch" },
  { name: "Fridges", value: "fridge" },
  { name: "Groceries", value: "grocery" },
  { name: "TVs", value: "tv" },
  { name: "Laptops", value: "laptop" },
  { name: "Mobiles", value: "mobile" },
  { name: "Earbuds", value: "buds" },
  { name: "Furniture", value: "furniture" },
];

export default function Home() {
  const { role } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setProducts(res.products?.slice(0, 8) || []);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load featured products");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleQuickAdd(productId: string) {
    if (role === "vendor") return;
    try {
      await addToCart(productId, 1);
      toast.success("Product added to your cart!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    }
  }

  return (
    <div>
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Welcome to ShopEase
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover quality products from verified vendors — electronics, appliances, groceries, and home essentials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {role === "vendor" ? (
              <Link
                to="/vendor/dashboard"
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition"
              >
                Go to Vendor Portal &rarr;
              </Link>
            ) : (
              <>
                <Link
                  to="/products"
                  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition"
                >
                  Shop All Products
                </Link>
                {!role && (
                  <Link
                    to="/signup"
                    className="border-2 border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-blue-600 transition"
                  >
                    Create Account
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              to={`/products?category=${c.value}`}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-blue-500 hover:shadow-sm transition"
            >
              <span className="block font-medium text-sm text-gray-800">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            View all &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const price = product.currentPrice ?? product.price;
              const category = product.productCategory || product.category || "General";
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
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-gray-400 block">Price</span>
                      <span className="text-lg font-bold text-gray-900">
                        {price != null ? `$${price.toFixed(2)}` : "TBD"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {role !== "vendor" && (
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(product._id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1.5 rounded transition"
                        >
                          + Cart
                        </button>
                      )}
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
      </section>

      {role !== "vendor" && (
        <section className="bg-gray-100 border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Are you a merchant? Sell on ShopEase
            </h2>
            <p className="text-gray-600 text-sm mb-6 max-w-xl mx-auto">
              List your inventory, set real-time prices, handle orders, and export your catalog effortlessly.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-md text-sm transition"
            >
              Join as a Vendor
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
