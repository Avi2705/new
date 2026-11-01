import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVendorProducts } from "../../api";
import type { Product } from "../../types";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorProducts()
      .then((res) => setProducts(res.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Products Inventory</h1>
          <p className="text-sm text-gray-500">
            Total {products.length} products listed under your vendor account
          </p>
        </div>

        <Link
          to="/vendor/add-product"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition"
        >
          + Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading your inventory...</div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-gray-500 mb-4">You have not listed any products yet.</p>
          <Link
            to="/vendor/add-product"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition inline-block"
          >
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Media</th>
                  <th className="px-6 py-3">Active Price</th>
                  <th className="px-6 py-3">Product ID</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const price = p.currentPrice ?? p.price;
                  const category = p.productCategory || p.category || "General";
                  const images = p.productImages || p.images || [];
                  const mainImage = images[0];

                  return (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            {mainImage ? (
                              <img
                                src={mainImage}
                                alt={p.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">{p.productName}</span>
                            <span className="text-xs text-gray-500 line-clamp-1">
                              {p.productDescription || p.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded capitalize">
                          {category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <span>{images.length} image{images.length === 1 ? "" : "s"}</span>
                        {p.productVideos && p.productVideos.length > 0 && (
                          <span className="ml-2 text-blue-600 font-medium">1 video</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {price != null ? `$${price.toFixed(2)}` : (
                          <span className="text-red-500 font-normal text-xs">No price set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{p._id}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/vendor/set-price?productId=${p._id}`}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-2.5 py-1 rounded transition"
                        >
                          Edit Price
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
