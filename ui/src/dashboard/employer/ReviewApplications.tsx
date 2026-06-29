import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getEmployerApplications, updateApplicationStatus } from "../../services/jobService";
import { EmployerSidebar } from "./EmployerDashboard";
import {
  Bell, Users, CheckCircle, XCircle, Clock, Eye,
  User, Briefcase, Calendar, AlertCircle, ChevronDown,
} from "lucide-react";

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  viewed: { label: "Viewed", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  shortlisted: { label: "Shortlisted", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
};

export default function ReviewApplications() {
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status") || "all";
    setFilter(status);
  }, [location.search]);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = filter === "all" ? await getEmployerApplications() : await getEmployerApplications(filter);
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [filter]);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await updateApplicationStatus(id, status);
      setApplications((prev) => prev.map((app) => app.id === id ? { ...app, status } : app));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    viewed: applications.filter((a) => a.status === "viewed").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const tabs = [
    { key: "all", label: "All", icon: Users },
    { key: "pending", label: "Pending", icon: Clock },
    { key: "viewed", label: "Viewed", icon: Eye },
    { key: "shortlisted", label: "Shortlisted", icon: CheckCircle },
    { key: "rejected", label: "Rejected", icon: XCircle },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <EmployerSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500">Review and manage candidates across all your listings.</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Bell size={20} className="text-gray-600" />
          </button>
        </header>

        <div className="flex-1 p-8 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { key: "all", label: "Total", icon: Users, color: "text-gray-600 bg-gray-100" },
              { key: "pending", label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50" },
              { key: "shortlisted", label: "Shortlisted", icon: CheckCircle, color: "text-green-600 bg-green-50" },
              { key: "rejected", label: "Rejected", icon: XCircle, color: "text-red-600 bg-red-50" },
            ].map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => navigate(`?status=${key}`)}
                className={`bg-white rounded-2xl border p-5 text-left transition-all hover:shadow-md ${filter === key ? "border-red-500 ring-1 ring-red-500" : "border-gray-100"}`}
              >
                <div className={`inline-flex p-2 rounded-lg mb-3 ${color}`}><Icon size={16} /></div>
                <p className="text-2xl font-bold text-gray-900">{counts[key as keyof typeof counts]}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </button>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => navigate(`?status=${key}`)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === key ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Application list */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-24 h-8 bg-gray-100 rounded-xl" />
                      <div className="w-20 h-8 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <AlertCircle size={40} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No applications found</h3>
              <p className="text-sm text-gray-400 mt-1">Applications will appear here once candidates apply.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app: any) => {
                const st = statusConfig[app.status] || statusConfig["pending"];
                return (
                  <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-6">
                    <div className="flex items-center gap-5">
                      {/* Avatar */}
                      <div className="p-3 bg-gray-100 rounded-xl shrink-0">
                        <User size={22} className="text-gray-500" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {app.user?.username || app.applicant || "Unknown Applicant"}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                            {st.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Briefcase size={11} /> {app.job?.title || app.job_title || "Unknown Job"}
                          </span>
                          {app.applied_at && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(app.applied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {app.status !== "viewed" && app.status !== "shortlisted" && app.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusChange(app.id, "viewed")}
                            disabled={updating === app.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition disabled:opacity-50"
                          >
                            <Eye size={13} /> Mark Viewed
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(app.id, "shortlisted")}
                          disabled={updating === app.id || app.status === "shortlisted"}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition disabled:opacity-40"
                        >
                          <CheckCircle size={13} />
                          {app.status === "shortlisted" ? "Shortlisted" : "Shortlist"}
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, "rejected")}
                          disabled={updating === app.id || app.status === "rejected"}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-40"
                        >
                          <XCircle size={13} />
                          {app.status === "rejected" ? "Rejected" : "Reject"}
                        </button>

                        {/* Status dropdown for finer control */}
                        <div className="relative group">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                            <ChevronDown size={14} />
                          </button>
                        </div>
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