import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NAV_LINKS = [
  { to: "/vendor/dashboard", label: "Overview" },
  { to: "/vendor/products", label: "Inventory" },
  { to: "/vendor/add-product", label: "+ Add Product" },
  { to: "/vendor/set-price", label: "Set Price" },
  { to: "/vendor/offers", label: "Offers" },
  { to: "/vendor/orders", label: "Incoming Orders" },
  { to: "/vendor/reviews", label: "Reviews" },
  { to: "/vendor/export", label: "Catalog Export" },
];

const MOBILE_LINKS = [
  { to: "/vendor/dashboard", label: "Overview Dashboard" },
  { to: "/vendor/products", label: "Inventory & Products" },
  { to: "/vendor/add-product", label: "+ Add New Product" },
  { to: "/vendor/set-price", label: "Update Prices" },
  { to: "/vendor/offers", label: "Discount Offers & Coupons" },
  { to: "/vendor/orders", label: "Customer Orders" },
  { to: "/vendor/reviews", label: "Customer Reviews" },
  { to: "/vendor/export", label: "Export ZIP & CSV" },
];

export default function VendorNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  }

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/vendor/dashboard" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-yellow-500 text-gray-900 text-xs px-2 py-0.5 rounded font-black uppercase">
                Vendor
              </span>
              <span>ShopEase Hub</span>
            </Link>

            <div className="hidden lg:flex ml-8 space-x-5 text-xs font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    isActive(link.to)
                      ? "text-yellow-400 border-b-2 border-yellow-400 pb-0.5 transition"
                      : "text-gray-300 hover:text-white transition"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/vendor/profile"
              className={
                isActive("/vendor/profile")
                  ? "text-xs text-yellow-400 flex items-center gap-1.5"
                  : "text-xs text-gray-300 hover:text-white flex items-center gap-1.5"
              }
            >
              <span className="h-2 w-2 rounded-full bg-green-400"></span>
              <span>{user?.name || "Merchant"}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded transition"
            >
              Sign Out
            </button>
          </div>

          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700 px-4 pt-2 pb-4 space-y-2 text-xs">
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={
                isActive(link.to)
                  ? "block text-yellow-400 font-semibold py-1"
                  : "block text-gray-300 hover:text-white py-1"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/vendor/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={
              isActive("/vendor/profile")
                ? "block text-yellow-400 font-semibold py-1"
                : "block text-gray-300 hover:text-white py-1"
            }
          >
            Merchant Profile ({user?.name})
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left text-red-400 py-1"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
