import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getApplicationCount, getEmployerJobs, getShortlistedCount } from "../../services/jobService";
import NotificationBell from "../../components/NotificationBell";
import {
  LayoutDashboard, PlusCircle, ClipboardList, User, LogOut,
  Briefcase, Users, CheckCircle, ArrowRight, TrendingUp,
  MapPin, DollarSign, ChevronRight, Eye,
} from "lucide-react";

export function EmployerSidebar({ navigate, currentPath }: { navigate: any; currentPath: string }) {
  const links = [
    { label: "Dashboard", path: "/employer-dashboard", icon: LayoutDashboard },
    { label: "Post a Job", path: "/create-job", icon: PlusCircle },
    { label: "Applications", path: "/employer/applications", icon: ClipboardList },
    { label: "Profile", path: "/profile/employer", icon: User },
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
        <p className="text-xs text-gray-400 mt-1">Employer Portal</p>
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

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobCount, setJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsData = await getEmployerJobs();
        setJobs(jobsData);
        setJobCount(jobsData.length);
        const appData = await getApplicationCount();
        setApplicationCount(appData.applications_count);
        const shortData = await getShortlistedCount();
        setShortlistedCount(shortData.shortlisted_count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Jobs Posted", value: jobCount, icon: Briefcase, color: "bg-red-50 text-red-600" },
    { label: "Total Applications", value: applicationCount, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Shortlisted", value: shortlistedCount, icon: CheckCircle, color: "bg-green-50 text-green-600" },
    { label: "Conversion Rate", value: applicationCount > 0 ? `${Math.round((shortlistedCount / applicationCount) * 100)}%` : "—", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <EmployerSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your job listings and review applicants.</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={() => navigate("/create-job")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition"
            >
              <PlusCircle size={16} /> Post a Job
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-5">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${color}`}><Icon size={22} /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "—" : value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action cards */}
          <div className="grid grid-cols-3 gap-5">
            {[
              { title: "Post a New Job", desc: "Create a listing and start receiving applications.", path: "/create-job", icon: PlusCircle, accent: true },
              { title: "Review Applications", desc: "Shortlist or reject candidates across all listings.", path: "/employer/applications", icon: ClipboardList, accent: false },
              { title: "Company Profile", desc: "Keep your company info up to date for applicants.", path: "/profile/employer", icon: User, accent: false },
            ].map(({ title, desc, path, icon: Icon, accent }) => (
              <button
                key={title}
                onClick={() => navigate(path)}
                className={`group text-left rounded-2xl border p-6 transition-all duration-200 hover:shadow-md ${
                  accent ? "bg-red-600 text-white border-red-600 hover:bg-red-700" : "bg-white text-gray-900 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className={`mb-4 inline-flex p-3 rounded-xl ${accent ? "bg-white/15" : "bg-gray-100"}`}>
                  <Icon size={20} className={accent ? "text-white" : "text-gray-700"} />
                </div>
                <h3 className={`font-semibold text-base ${accent ? "text-white" : "text-gray-900"}`}>{title}</h3>
                <p className={`text-sm mt-1 ${accent ? "text-red-100" : "text-gray-500"}`}>{desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${accent ? "text-white" : "text-red-600"}`}>
                  Go <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Recent job listings */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Your Job Listings</h2>
              <button onClick={() => navigate("/employer/applications")} className="text-sm text-red-600 font-medium flex items-center gap-1 hover:underline">
                View applications <ChevronRight size={14} />
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Briefcase size={36} className="text-gray-200 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700">No jobs posted yet</h3>
                <p className="text-sm text-gray-400 mt-1">Post your first job to start receiving applications.</p>
                <button onClick={() => navigate("/create-job")} className="mt-5 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition">
                  Post a Job
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-5 flex items-center gap-5">
                    <div className="p-2.5 bg-red-50 rounded-xl shrink-0">
                      <Briefcase size={20} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        {job.location && <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={11} />{job.location}</span>}
                        {job.salary && <span className="text-xs text-green-600 font-medium flex items-center gap-1"><DollarSign size={11} />₹{job.salary}</span>}
                      </div>
                    </div>
                    <button onClick={() => navigate("/employer/applications")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50">
                      <Eye size={14} /> Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}