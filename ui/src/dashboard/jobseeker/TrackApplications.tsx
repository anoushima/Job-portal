import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { trackApplications, withdrawApplication } from "../../services/jobService";
import {
  ClipboardList, Search, User, LogOut, LayoutDashboard,
  Briefcase, MapPin, Calendar, ChevronRight, Bell,
  Clock, Eye, CheckCircle, XCircle, AlertCircle, Undo2,
} from "lucide-react";

function Sidebar({ navigate, currentPath }: { navigate: any; currentPath: string }) {
  const links = [
    { label: "Dashboard", path: "/jobseeker-dashboard", icon: LayoutDashboard },
    { label: "Find Jobs", path: "/jobs", icon: Search },
    { label: "My Applications", path: "/my-applications", icon: ClipboardList },
    { label: "Profile", path: "/profile/jobseeker", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-black text-white flex flex-col min-h-screen shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-extrabold tracking-wide cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-white">Next</span>
          <span className="text-red-500">Rol</span>
          <span className="text-white">E</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Jobseeker Portal</p>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        {links.map(({ label, path, icon: Icon }) => {
          const active = currentPath === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                active ? "bg-red-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-5 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

const statusConfig: Record<string, { label: string; icon: any; bg: string; text: string; border: string }> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  viewed: {
    label: "Viewed",
    icon: Eye,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  shortlisted: {
    label: "Shortlisted",
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  rejected: {
    label: "Not Selected",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export default function TrackApplications() {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await trackApplications();
        setApplications(data);
      } catch (error) {
        console.error("error fetching applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdraw = async (id: number) => {
    setWithdrawingId(id);
    try {
      await withdrawApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("error withdrawing application", error);
    } finally {
      setWithdrawingId(null);
      setConfirmingId(null);
    }
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    viewed: applications.filter((a) => a.status === "viewed").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar navigate={navigate} currentPath={location.pathname} />

      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
            <p className="text-sm text-gray-500">Track and manage all your job applications.</p>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
            <Bell size={20} className="text-gray-600" />
          </button>
        </header>

        <div className="flex-1 p-8 space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { key: "all", label: "Total", icon: ClipboardList, accent: false },
              { key: "pending", label: "Pending", icon: Clock, accent: false },
              { key: "shortlisted", label: "Shortlisted", icon: CheckCircle, accent: false },
              { key: "rejected", label: "Not Selected", icon: XCircle, accent: false },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`bg-white rounded-2xl border p-5 text-left transition-all duration-150 hover:shadow-md ${
                  filter === key
                    ? "border-red-500 ring-1 ring-red-500 shadow-sm"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className={filter === key ? "text-red-600" : "text-gray-400"} />
                  {filter === key && <div className="w-2 h-2 rounded-full bg-red-500" />}
                </div>
                <p className="text-2xl font-bold text-gray-900">{statusCounts[key as keyof typeof statusCounts]}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </button>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            {["all", "pending", "viewed", "shortlisted", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === s
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Application cards */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <AlertCircle size={40} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No applications yet</h3>
              <p className="text-sm text-gray-400 mt-1">Start applying to jobs and they'll appear here.</p>
              <button
                onClick={() => navigate("/jobs")}
                className="mt-6 px-6 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((app: any) => {
                const st = statusConfig[app.status] || statusConfig["pending"];
                const StatusIcon = st.icon;
                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 p-6"
                  >
                    <div className="flex items-start gap-5">
                      {/* Job icon */}
                      <div className="p-3 bg-red-50 rounded-xl shrink-0">
                        <Briefcase size={22} className="text-red-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base">{app.job_title}</h3>
                            <div className="flex items-center gap-4 mt-1.5">
                              {app.location && (
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin size={13} /> {app.location}
                                </span>
                              )}
                              <span className="text-sm text-gray-400 flex items-center gap-1">
                                <Calendar size={13} />
                                Applied {new Date(app.applied_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Status badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 ${st.bg} ${st.text} ${st.border}`}
                          >
                            <StatusIcon size={12} />
                            {st.label}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="flex items-center gap-1">
                            {["pending", "viewed", "shortlisted"].map((step, i) => {
                              const steps = ["pending", "viewed", "shortlisted"];
                              const currentIdx = steps.indexOf(app.status);
                              const isDone = currentIdx >= i;
                              const isRejected = app.status === "rejected";
                              return (
                                <div key={step} className="flex items-center gap-1 flex-1">
                                  <div
                                    className={`h-1.5 w-full rounded-full transition-colors ${
                                      isRejected
                                        ? "bg-red-200"
                                        : isDone
                                        ? "bg-red-500"
                                        : "bg-gray-100"
                                    }`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-1">
                            {["Applied", "Reviewed", "Shortlisted"].map((lbl) => (
                              <span key={lbl} className="text-xs text-gray-400">{lbl}</span>
                            ))}
                          </div>
                        </div>

                        {/* Undo / withdraw — lets a jobseeker fix an accidental application */}
                        <div className="mt-4 pt-3 border-t border-gray-50">
                          {confirmingId === app.id ? (
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs text-gray-500">Withdraw this application?</span>
                              <button
                                onClick={() => handleWithdraw(app.id)}
                                disabled={withdrawingId === app.id}
                                className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition disabled:opacity-60"
                              >
                                {withdrawingId === app.id ? "Withdrawing…" : "Yes, withdraw"}
                              </button>
                              <button
                                onClick={() => setConfirmingId(null)}
                                disabled={withdrawingId === app.id}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg transition"
                              >
                                Keep it
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmingId(app.id)}
                              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition"
                            >
                              <Undo2 size={13} /> Applied by mistake? Undo
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <button
                        onClick={() => navigate(`/jobs/${app.job_id}`)}
                        className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition shrink-0 self-start"
                      >
                        <ChevronRight size={18} />
                      </button>
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

// export default TrackApplications;