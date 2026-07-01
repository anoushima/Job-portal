import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminDashboard";
import NotificationBell from "../../components/NotificationBell";
import { getAdminApplications } from "../../services/adminService";
import { ClipboardList, Search, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  viewed: { label: "Viewed", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  shortlisted: { label: "Shortlisted", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
};

export default function AdminApplications() {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = await getAdminApplications();
        setApplications(data);
      } catch (err: any) {
        if (err?.response?.status === 403) setError("You don't have permission to view this page.");
        else setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filtered = applications.filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch = !search ||
      a.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      a.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500">Platform-wide application pipeline — {applications.length} total.</p>
          </div>
          <NotificationBell />
        </header>

        <div className="flex-1 p-8 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { key: "all", label: "Total", icon: ClipboardList },
              { key: "pending", label: "Pending", icon: Clock },
              { key: "shortlisted", label: "Shortlisted", icon: CheckCircle },
              { key: "rejected", label: "Rejected", icon: XCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`bg-white rounded-2xl border p-5 text-left transition-all hover:shadow-md ${filter === key ? "border-red-500 ring-1 ring-red-500" : "border-gray-100"}`}
              >
                <Icon size={18} className="text-gray-400 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{counts[key as keyof typeof counts]}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </button>
            ))}
          </div>

          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job, company, or applicant…"
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

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-semibold">Applicant</th>
                  <th className="text-left px-6 py-3 font-semibold">Job</th>
                  <th className="text-left px-6 py-3 font-semibold">Company</th>
                  <th className="text-left px-6 py-3 font-semibold">Applied</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4" colSpan={5}><div className="h-4 bg-gray-100 rounded w-full" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">
                      <ClipboardList size={32} className="mx-auto mb-3 text-gray-200" />
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => {
                    const st = statusConfig[a.status] || statusConfig["pending"];
                    return (
                      <tr key={a.id} className="hover:bg-gray-50/60 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{a.applicant_name}</div>
                          <div className="text-xs text-gray-400">{a.applicant_email}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{a.job_title}</td>
                        <td className="px-6 py-4 text-gray-500">{a.company_name}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(a.applied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
