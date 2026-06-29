import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, Briefcase, ClipboardList,
  BarChart2, Settings, LogOut, Bell, TrendingUp, TrendingDown,
  ArrowRight, Activity, ShieldCheck,
} from "lucide-react";

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

const stats = [
  { title: "Total Users", value: "1,200", change: "+8%", up: true, icon: Users, color: "bg-blue-50 text-blue-600" },
  { title: "Employers", value: "300", change: "+12%", up: true, icon: Building2, color: "bg-purple-50 text-purple-600" },
  { title: "Active Jobs", value: "560", change: "+5%", up: true, icon: Briefcase, color: "bg-red-50 text-red-600" },
  { title: "Applications", value: "2,100", change: "+18%", up: true, icon: ClipboardList, color: "bg-green-50 text-green-600" },
];

const recentActivity = [
  { id: 1, type: "user", message: "New jobseeker registered: Arjun Menon", time: "2 min ago", icon: Users, color: "bg-blue-50 text-blue-600" },
  { id: 2, type: "job", message: "New job posted: Frontend Engineer at Infosys", time: "14 min ago", icon: Briefcase, color: "bg-red-50 text-red-600" },
  { id: 3, type: "application", message: "Priya Nair shortlisted for Data Analyst role", time: "1 hr ago", icon: ClipboardList, color: "bg-green-50 text-green-600" },
  { id: 4, type: "employer", message: "New employer registered: TechCorp Solutions", time: "3 hr ago", icon: Building2, color: "bg-purple-50 text-purple-600" },
  { id: 5, type: "user", message: "Account deactivated: inactive 90+ days", time: "5 hr ago", icon: ShieldCheck, color: "bg-amber-50 text-amber-600" },
];

const quickActions = [
  { label: "Manage Users", desc: "View, activate or deactivate user accounts.", path: "/admin/users", icon: Users },
  { label: "Job Listings", desc: "Review and moderate all job postings.", path: "/admin/jobs", icon: Briefcase },
  { label: "Employer Accounts", desc: "Approve or suspend employer accounts.", path: "/admin/employers", icon: Building2 },
  { label: "All Applications", desc: "Oversee the full application pipeline.", path: "/admin/applications", icon: ClipboardList },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

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
            <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-700">
              <ShieldCheck size={15} className="text-red-600" />
              Admin
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-5">
            {stats.map(({ title, value, change, up, icon: Icon, color }) => (
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
                {recentActivity.map(({ id, message, time, icon: Icon, color }) => (
                  <div key={id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${color}`}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-700 leading-snug">{message}</p>
                      <p className="text-xs text-gray-400 mt-1">{time}</p>
                    </div>
                  </div>
                ))}
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