import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminDashboard";
import NotificationBell from "../../components/NotificationBell";
import { getAdminJobs,toggleJobActive } from "../../services/adminService";
import { Briefcase, Search, ShieldCheck, ShieldOff, MapPin, Users, Flag, AlertCircle } from "lucide-react";

export default function AdminJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAdminJobs();
      setJobs(data);
    } catch (err: any) {
      if (err?.response?.status === 403) setError("You don't have permission to view this page.");
      else setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try {
      const result = await toggleJobActive(id);
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, is_active: result.is_active } : j)));
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = jobs.filter((j) =>
    !search ||
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Jobs</h1>
            <p className="text-sm text-gray-500">Review and moderate all job postings — {jobs.length} total.</p>
          </div>
          <NotificationBell />
        </header>

        <div className="flex-1 p-8 space-y-6">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or company…"
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

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-20" />
              ))
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <Briefcase size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No jobs found.</p>
              </div>
            ) : (
              filtered.map((j) => (
                <div key={j.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${j.is_active ? "bg-red-50" : "bg-gray-100"}`}>
                    <Briefcase size={20} className={j.is_active ? "text-red-600" : "text-gray-400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm">{j.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        j.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                      }`}>
                        {j.is_active ? "Active" : "Deactivated"}
                      </span>
                      {j.reports_count > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Flag size={10} /> {j.reports_count} report{j.reports_count !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500">{j.company_name}</span>
                      {j.location && (
                        <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} />{j.location}</span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={11} />{j.applications_count} applicant{j.applications_count !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(j.id)}
                    disabled={togglingId === j.id}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50 ${
                      j.is_active
                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                    }`}
                  >
                    {j.is_active ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                    {togglingId === j.id ? "Updating…" : j.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
