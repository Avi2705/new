import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser, verifyUserOtp, loginUser, registerVendor, verifyVendorOtp, loginVendor } from "../api";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<"user" | "vendor">("user");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "user") {
        await registerUser(name, email, password);
      } else {
        await registerVendor(name, email, password);
      }
      toast.info(`OTP sent to ${email}. Check your inbox.`);
      setStep("otp");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "user") {
        await verifyUserOtp(email, otp);
        const res = await loginUser(email, password);
        const userData: User = {
          id: res.user?.id || "",
          name: res.user?.name || name,
          email: res.user?.email || email,
          role: "user",
          isVerified: true,
        };
        login(res.accessToken, userData, "user", res.refreshToken);
        toast.success(`Account created! Welcome, ${userData.name}!`);
        navigate("/");
      } else {
        await verifyVendorOtp(email, otp);
        const res = await loginVendor(email, password);
        const vendorData: User = {
          id: res.vendor?.id || "",
          name: res.vendor?.name || name,
          email: res.vendor?.email || email,
          role: "vendor",
          isVerified: true,
        };
        login(res.accessToken, vendorData, "vendor", res.refreshToken);
        toast.success(`Vendor account created! Welcome, ${vendorData.name}!`);
        navigate("/vendor/dashboard");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {step === "form" ? "Create an Account" : "Verify Your Email"}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {step === "form"
            ? "Choose your account type below"
            : `Enter the 6-digit OTP code sent to ${email}`}
        </p>

        {step === "form" && (
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
              Vendor / Seller
            </button>
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {role === "vendor" ? "Vendor / Merchant Name *" : "Full Name *"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "vendor" ? "Apex Tech Store" : "John Doe"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition text-sm disabled:opacity-50"
            >
              {loading ? "Registering..." : `Register as ${role === "vendor" ? "Vendor" : "Customer"}`}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-center text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition text-sm disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code & Start"}
            </button>

            <button
              type="button"
              onClick={() => setStep("form")}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-800"
            >
              Back to form
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
