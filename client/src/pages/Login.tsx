import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, loginVendor } from "../api";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<"user" | "vendor">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "user") {
        const res = await loginUser(email, password);
        const userData: User = {
          id: res.user?.id || "",
          name: res.user?.name || "Customer",
          email: res.user?.email || email,
          role: "user",
          isVerified: true,
        };
        login(res.accessToken, userData, "user", res.refreshToken);
        toast.success(`Welcome back, ${userData.name}!`);
        navigate("/");
      } else {
        const res = await loginVendor(email, password);
        const vendorData: User = {
          id: res.vendor?.id || "",
          name: res.vendor?.name || "Vendor",
          email: res.vendor?.email || email,
          role: "vendor",
          isVerified: true,
        };
        login(res.accessToken, vendorData, "vendor", res.refreshToken);
        toast.success(`Welcome back, ${vendorData.name}!`);
        navigate("/vendor/dashboard");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Sign In</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Choose account type and enter credentials
        </p>

        <div className="flex bg-gray-100 p-1 rounded-md mb-6">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              role === "user"
                ? "bg-white text-blue-600 shadow-sm font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              role === "vendor"
                ? "bg-white text-blue-600 shadow-sm font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Vendor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md text-sm transition disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
