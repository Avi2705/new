import { Link } from "react-router-dom";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const category = product.productCategory || product.category || "General";
  const desc = product.productDescription || product.description;
  const price = product.currentPrice ?? product.price;
  const images = product.productImages || product.images || [];
  const mainImage = images[0];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-3 sm:p-4 flex flex-col justify-between h-full group">
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

        <div className="flex justify-between items-center mb-1.5">
          <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded capitalize">
            {category}
          </span>
          <span className="text-[11px] text-green-600 font-medium">In Stock</span>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">
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
          <span className="text-[10px] text-gray-400 block uppercase tracking-wide">
            Price
          </span>
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {price != null ? `$${price.toFixed(2)}` : "TBD"}
          </span>
        </div>
        <Link
          to={`/products/${product._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3.5 py-2 rounded-md transition shadow-xs"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
