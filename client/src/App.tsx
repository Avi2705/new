import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProductsPage from "./pages/customer/ProductsPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import OrdersPage from "./pages/customer/OrdersPage";
import ProfilePage from "./pages/customer/ProfilePage";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProductsPage from "./pages/vendor/VendorProductsPage";
import VendorAddProductPage from "./pages/vendor/VendorAddProductPage";
import VendorPricePage from "./pages/vendor/VendorPricePage";
import VendorOffersPage from "./pages/vendor/VendorOffersPage";
import VendorOrdersPage from "./pages/vendor/VendorOrdersPage";
import VendorReviewsPage from "./pages/vendor/VendorReviewsPage";
import VendorExportPage from "./pages/vendor/VendorExportPage";
import VendorProfilePage from "./pages/vendor/VendorProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      { path: "products", element: <ProductsPage /> },
      { path: "products/:productId", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "profile", element: <ProfilePage /> },

      { path: "vendor/dashboard", element: <VendorDashboard /> },
      { path: "vendor/products", element: <VendorProductsPage /> },
      { path: "vendor/add-product", element: <VendorAddProductPage /> },
      { path: "vendor/set-price", element: <VendorPricePage /> },
      { path: "vendor/offers", element: <VendorOffersPage /> },
      { path: "vendor/orders", element: <VendorOrdersPage /> },
      { path: "vendor/reviews", element: <VendorReviewsPage /> },
      { path: "vendor/export", element: <VendorExportPage /> },
      { path: "vendor/profile", element: <VendorProfilePage /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
