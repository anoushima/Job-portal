import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminDashboard";
import NotificationBell from "../../components/NotificationBell";
import { getAdminEmployers,toggleUserActive } from "../../services/adminService";
import { Building2, Search, ShieldCheck, ShieldOff, Mail, MapPin, Briefcase, AlertCircle, Globe } from "lucide-react";

export default function AdminEmployers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchEmployers = async () => {
    setLoading(true);
    try {
      const data = await getAdminEmployers();
      setEmployers(data);
    } catch (err: any) {
      if (err?.response?.status === 403) setError("You don't have permission to view this page.");
      else setError("Failed to load employers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployers(); }, []);

  const handleToggle = async (userId: number) => {
    setTogglingId(userId);
    try {
      const result = await toggleUserActive(userId);
      setEmployers((prev) => prev.map((e) => (e.user_id === userId ? { ...e, is_active: result.is_active } : e)));
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = employers.filter((e) =>
    !search ||
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Employers</h1>
            <p className="text-sm text-gray-500">Manage employer accounts — {employers.length} total.</p>
          </div>
          <NotificationBell />
        </header>

        <div className="flex-1 p-8 space-y-6">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-40" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <Building2 size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No employers found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((e) => (
                <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                        {e.name?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{e.name}</h3>
                        <p className="text-xs text-gray-400 capitalize">{e.industry || "Industry not set"}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${
                      e.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                    }`}>
                      {e.is_active ? "Active" : "Deactivated"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                    <p className="flex items-center gap-1.5"><Mail size={12} /> {e.email}</p>
                    {e.location && <p className="flex items-center gap-1.5"><MapPin size={12} /> {e.location}</p>}
                    {e.website && <p className="flex items-center gap-1.5"><Globe size={12} /> {e.website}</p>}
                    <p className="flex items-center gap-1.5"><Briefcase size={12} /> {e.jobs_count} job{e.jobs_count !== 1 ? "s" : ""} posted</p>
                  </div>

                  <button
                    onClick={() => handleToggle(e.user_id)}
                    disabled={togglingId === e.user_id}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50 ${
                      e.is_active
                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                    }`}
                  >
                    {e.is_active ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                    {togglingId === e.user_id ? "Updating…" : e.is_active ? "Deactivate account" : "Activate account"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
