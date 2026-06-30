import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NotificationBell from "../../components/NotificationBell";
import {
  LayoutDashboard, Users, Building2, Briefcase, ClipboardList,
  BarChart2, Settings, LogOut, TrendingUp, TrendingDown,
  ArrowRight, Activity, ShieldCheck,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

function AdminSidebar({ navigate, currentPath }: { navigate: any; currentPath: string }) {
  const links = [
    { label: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Employers", path: "/admin/employers", icon: Building2 },
    { label: "Jobs", path: "/admin/jobs", icon: Briefcase },
    { label: "Applications", path: "/admin/applications", icon: ClipboardList },
    { label: "Reports", path: "/admin/reports", icon: BarChart2 },
    { label: "Settings", path: "/admin/settings", icon: Settings },
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
          <span className="text-white">Next</span><span className="text-red-500">Rol</span><span className="text-white">E</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Admin Console</p>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        {links.map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
              currentPath === path ? "bg-red-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={18} />{label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-5 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all">
          <LogOut size={18} />Logout
        </button>
      </div>
    </aside>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────
interface StatItem {
  value: number;
  change: string;
  up: boolean;
}

interface AdminStats {
  jobseekers: StatItem;
  companies: StatItem;
  jobs: StatItem;
  applications: StatItem;
}

interface ActivityItem {
  type: "user" | "job" | "application" | "employer";
  message: string;
  timestamp: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function timeAgo(isoString: string): string {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
}

function activityStyle(type: string) {
  switch (type) {
    case "user":        return { color: "bg-blue-50 text-blue-600",   Icon: Users };
    case "job":         return { color: "bg-red-50 text-red-600",     Icon: Briefcase };
    case "application": return { color: "bg-green-50 text-green-600", Icon: ClipboardList };
    case "employer":    return { color: "bg-purple-50 text-purple-600", Icon: Building2 };
    default:            return { color: "bg-gray-50 text-gray-600",   Icon: Activity };
  }
}

const quickActions = [
  { label: "Manage Users",      desc: "View, activate or deactivate user accounts.",  path: "/admin/users",        icon: Users },
  { label: "Job Listings",      desc: "Review and moderate all job postings.",         path: "/admin/jobs",         icon: Briefcase },
  { label: "Employer Accounts", desc: "Approve or suspend employer accounts.",         path: "/admin/employers",    icon: Building2 },
  { label: "All Applications",  desc: "Oversee the full application pipeline.",        path: "/admin/applications", icon: ClipboardList },
];

// ── Main component ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_URL}/admin/stats/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats(res.data.stats);
        setActivity(res.data.recent_activity);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load dashboard data. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // stat cards config — maps API keys to display config
  const statCards = stats
    ? [
        {
          title: "Total Users",
          value: stats.jobseekers.value.toLocaleString(),
          change: stats.jobseekers.change,
          up: stats.jobseekers.up,
          icon: Users,
          color: "bg-blue-50 text-blue-600",
        },
        {
          title: "Companies",
          value: stats.companies.value.toLocaleString(),
          change: stats.companies.change,
          up: stats.companies.up,
          icon: Building2,
          color: "bg-purple-50 text-purple-600",
        },
        {
          title: "Active Jobs",
          value: stats.jobs.value.toLocaleString(),
          change: stats.jobs.change,
          up: stats.jobs.up,
          icon: Briefcase,
          color: "bg-red-50 text-red-600",
        },
        {
          title: "Applications",
          value: stats.applications.value.toLocaleString(),
          change: stats.applications.change,
          up: stats.applications.up,
          icon: ClipboardList,
          color: "bg-green-50 text-green-600",
        },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar navigate={navigate} currentPath={location.pathname} />

      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Platform overview and management tools.</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-700">
              <ShieldCheck size={15} className="text-red-600" />
              Admin
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 space-y-8">
          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 mb-4" />
                    <div className="h-7 w-20 bg-gray-100 rounded mb-2" />
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                  </div>
                ))
              : statCards.map(({ title, value, change, up, icon: Icon, color }) => (
                  <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl ${color}`}><Icon size={20} /></div>
                      <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-600" : "text-red-600"}`}>
                        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{title}</p>
                  </div>
                ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Quick actions */}
            <div className="col-span-2 space-y-4">
              <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map(({ label, desc, path, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => navigate(path)}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all p-5 text-left"
                  >
                    <div className="p-2.5 bg-gray-100 group-hover:bg-red-50 rounded-xl inline-flex mb-3 transition-colors">
                      <Icon size={18} className="text-gray-600 group-hover:text-red-600 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open <ArrowRight size={12} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Platform health */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-900">Platform Health</h2>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Activity size={12} /> All systems operational
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "User activation rate", value: 82, color: "bg-blue-500" },
                    { label: "Employer verification rate", value: 91, color: "bg-purple-500" },
                    { label: "Job fill rate", value: 47, color: "bg-red-500" },
                    { label: "Application response rate", value: 65, color: "bg-green-500" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-gray-100 rounded w-full" />
                          <div className="h-3 bg-gray-100 rounded w-2/3" />
                        </div>
                      </div>
                    ))
                  : activity.length === 0
                  ? (
                      <p className="text-sm text-gray-400 text-center py-4">No recent activity yet.</p>
                    )
                  : activity.map((item, idx) => {
                      const { color, Icon } = activityStyle(item.type);
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${color}`}>
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-700 leading-snug">{item.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{timeAgo(item.timestamp)}</p>
                          </div>
                        </div>
                      );
                    })}
                <button className="w-full text-center text-xs text-red-600 font-medium hover:underline pt-1">
                  View all activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
