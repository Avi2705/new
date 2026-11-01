import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../../hooks/useAuth";

export default function Layout() {
  const { isLoading, networkError, retrySession } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Validating session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {networkError && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between">
          <span>⚠️ {networkError}</span>
          <button
            type="button"
            onClick={retrySession}
            className="bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
          >
            Retry Connection
          </button>
        </div>
      )}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
