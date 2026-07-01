import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminDashboard";
import NotificationBell from "../../components/NotificationBell";
import { getAdminReports,updateReportStatus,toggleJobActive } from "../../services/adminService";
import { Flag, AlertCircle, CheckCircle, XCircle, Clock, ShieldOff, Mail } from "lucide-react";

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Pending review", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  reviewed: { label: "Reviewed", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  dismissed: { label: "Dismissed", bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
};

export default function AdminReports() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deactivatingJob, setDeactivatingJob] = useState<number | null>(null);

  const fetchReports = async (status = filter) => {
    setLoading(true);
    try {
      const data = await getAdminReports(status);
      setReports(data);
    } catch (err: any) {
      if (err?.response?.status === 403) setError("You don't have permission to view this page.");
      else setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(filter); }, [filter]);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await updateReportStatus(id, status);
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeactivateJob = async (jobId: number, reportId: number) => {
    setDeactivatingJob(jobId);
    try {
      await toggleJobActive(jobId);
      await handleStatusChange(reportId, "reviewed");
    } catch (err) {
      console.error(err);
    } finally {
      setDeactivatingJob(null);
    }
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "reviewed", label: "Reviewed" },
    { key: "dismissed", label: "Dismissed" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-500">Job postings flagged by jobseekers as spam or fraudulent.</p>
          </div>
          <NotificationBell />
        </header>

        <div className="flex-1 p-8 space-y-6">
          <div className="flex items-center gap-2">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === key ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-28" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <Flag size={36} className="text-gray-200 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">No reports here</h3>
              <p className="text-sm text-gray-400 mt-1">Job reports from jobseekers will show up here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => {
                const st = statusConfig[r.status] || statusConfig["pending"];
                return (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <h3 className="font-semibold text-gray-900 text-sm">{r.job_title}</h3>
                          <span className="text-xs text-gray-400">at {r.employer_name}</span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                            {st.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          Reason: <span className="font-medium text-gray-700">{r.reason_display}</span>
                        </p>
                        {r.description && (
                          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mt-2">{r.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                          <span>Reported by {r.reporter_name}</span>
                          <span className="flex items-center gap-1"><Mail size={11} />{r.reporter_email}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {r.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleDeactivateJob(r.job_id, r.id)}
                              disabled={deactivatingJob === r.job_id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                            >
                              <ShieldOff size={13} />
                              {deactivatingJob === r.job_id ? "Deactivating…" : "Deactivate job"}
                            </button>
                            <button
                              onClick={() => handleStatusChange(r.id, "dismissed")}
                              disabled={updatingId === r.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
                            >
                              <XCircle size={13} /> Dismiss
                            </button>
                            <button
                              onClick={() => handleStatusChange(r.id, "reviewed")}
                              disabled={updatingId === r.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition disabled:opacity-50"
                            >
                              <CheckCircle size={13} /> Mark reviewed
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
