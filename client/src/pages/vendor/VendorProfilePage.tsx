import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { getVendorProfile, updateVendorProfile } from "../../api";
import type { Vendor } from "../../types";

export default function VendorProfilePage() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Vendor | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getVendorProfile()
      .then((res) => {
        setProfile(res.vendor);
        setName(res.vendor?.name || "");
      })
      .catch((err: unknown) => {
        toast.error(err instanceof Error ? err.message : "Failed to load vendor profile");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateVendorProfile({ name });
      setProfile(res.vendor);
      toast.success("Company details updated successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    toast.info("You have been signed out.");
    navigate("/login");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Merchant Business Profile</h1>
            <p className="text-xs text-gray-500">{profile?.email || authUser?.email}</p>
          </div>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-semibold uppercase">
            Registered Seller
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading merchant details...</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Vendor Company Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Business Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || authUser?.email || ""}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md text-sm cursor-not-allowed"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition"
              >
                {saving ? "Saving..." : "Save Merchant Info"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-600 hover:underline text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
