import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getCart } from "../../api";

export default function CustomerNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      getCart()
        .then((res) => {
          const total = res.cart?.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0;
          setCartCount(total);
        })
        .catch(() => {});
    }
  }, [user]);

  function handleLogout() {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  }

  function isActive(path: string) {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }

  function linkClass(path: string) {
    return isActive(path)
      ? "text-blue-600 font-semibold text-sm"
      : "text-gray-700 hover:text-blue-600 font-medium text-sm";
  }

  function mobileLinkClass(path: string) {
    return isActive(path)
      ? "block text-blue-600 font-semibold py-1 text-sm"
      : "block text-gray-700 hover:text-blue-600 py-1 text-sm font-medium";
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              ShopEase
            </Link>
            <div className="hidden md:flex ml-8 space-x-6">
              <Link to="/" className={linkClass("/")}>
                Home
              </Link>
              <Link to="/products" className={linkClass("/products")}>
                Shop Catalog
              </Link>
              {user && (
                <>
                  <Link to="/cart" className={`${linkClass("/cart")} flex items-center gap-1`}>
                    Cart
                    {cartCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" className={linkClass("/orders")}>
                    My Orders
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 ${linkClass("/profile")}`}
                >
                  <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    Customer
                  </span>
                  <span>{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-md text-xs font-medium transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-1.5 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 p-2"
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
        <div className="md:hidden border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 bg-white">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass("/")}
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass("/products")}
          >
            Shop Catalog
          </Link>
          {user ? (
            <>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLinkClass("/cart")}
              >
                Shopping Cart ({cartCount})
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLinkClass("/orders")}
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLinkClass("/profile")}
              >
                Profile ({user.name})
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left text-red-600 py-1 text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-gray-100 text-gray-800 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-blue-600 text-white py-2 rounded-md text-sm font-medium"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
