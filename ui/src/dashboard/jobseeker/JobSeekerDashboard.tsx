import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import NotificationBell from "../../components/NotificationBell";
import {
  Briefcase,
  ClipboardList,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  TrendingUp,
  MapPin,
  DollarSign,
  ArrowRight,
  ChevronRight,
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
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-extrabold tracking-wide cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-white">Next</span>
          <span className="text-red-500">Rol</span>
          <span className="text-white">E</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Jobseeker Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {links.map(({ label, path, icon: Icon }) => {
          const active = currentPath === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-5 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-150"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const stats = [
    { label: "Jobs Available", value: jobs.length || "—", icon: Briefcase, color: "bg-red-50 text-red-600" },
    { label: "Applied", value: jobs.filter((j: any) => j.applied).length, icon: ClipboardList, color: "bg-gray-100 text-gray-700" },
    { label: "Profile Views", value: "—", icon: TrendingUp, color: "bg-gray-100 text-gray-700" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar navigate={navigate} currentPath={location.pathname} />

      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back — here's what's happening today.</p>
          </div>
          <NotificationBell />
        </header>

        <div className="flex-1 p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-5">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                title: "Find Jobs",
                desc: "Browse hundreds of openings from top companies.",
                path: "/jobs",
                icon: Search,
                accent: true,
              },
              {
                title: "My Applications",
                desc: "Track the status of every application you've sent.",
                path: "/my-applications",
                icon: ClipboardList,
                accent: false,
              },
              {
                title: "Build Profile",
                desc: "Showcase your skills, education, and experience.",
                path: "/profile/jobseeker",
                icon: User,
                accent: false,
              },
            ].map(({ title, desc, path, icon: Icon, accent }) => (
              <button
                key={title}
                onClick={() => navigate(path)}
                className={`group text-left rounded-2xl border p-6 transition-all duration-200 hover:shadow-md ${
                  accent
                    ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                    : "bg-white text-gray-900 border-gray-100 hover:border-gray-200"
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

          {/* Recommended Jobs */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Recommended Jobs</h2>
              <button
                onClick={() => navigate("/jobs")}
                className="text-sm text-red-600 font-medium flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {jobs.slice(0, 3).map((job: any) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <Briefcase size={18} className="text-red-600" />
                      </div>
                      {job.applied && (
                        <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">Applied</span>
                      )}
                      {!job.applied && job.match && (
                        <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-700 rounded-full">Matches your skills</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{job.title}</h3>
                    <div className="mt-2 space-y-1 flex-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={11} /> {job.location}
                      </p>
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <DollarSign size={11} /> {job.salary}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="mt-4 text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 group"
                    >
                      View job <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
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