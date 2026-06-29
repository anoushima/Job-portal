import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import type { Job } from "../../types/jobType";
import {
  LayoutDashboard, Search, ClipboardList, User, LogOut, Bell,
  MapPin, DollarSign, ArrowRight, SlidersHorizontal, Briefcase,
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
          <span className="text-white">Next</span><span className="text-red-500">Rol</span><span className="text-white">E</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Jobseeker Portal</p>
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

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error("error fetching jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = search.length >= 2
    ? jobs.filter((job) => job.title.toLowerCase().includes(search.toLowerCase()))
    : jobs;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar navigate={navigate} currentPath={location.pathname} />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Find Jobs</h1>
            <p className="text-sm text-gray-500">
              {jobs.length} openings available — find your next opportunity.
            </p>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
            <Bell size={20} className="text-gray-600" />
          </button>
        </header>

        <div className="flex-1 p-8 space-y-6">
          {/* Search bar */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition">
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {/* Results count */}
          {search.length >= 2 && (
            <p className="text-sm text-gray-500">
              {filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}

          {/* Job grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <Briefcase size={40} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No jobs found</h3>
              <p className="text-sm text-gray-400 mt-1">Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all duration-200 p-6 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-red-50 rounded-xl">
                      <Briefcase size={20} className="text-red-600" />
                    </div>
                    {job.applied && (
                      <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">
                        ✓ Applied
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-red-700 transition-colors">
                    {job.title}
                  </h3>

                  {/* Meta */}
                  <div className="mt-3 space-y-1.5 flex-1">
                    {job.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <MapPin size={13} className="text-gray-400" /> {job.location}
                      </p>
                    )}
                    {job.salary && (
                      <p className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                        <DollarSign size={13} /> ₹ {job.salary}
                      </p>
                    )}
                  </div>

                  {/* CTA — always shows View Job so even applied jobs can be opened & re-applied */}
                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 group/btn"
                    >
                      View Job
                      <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    {job.applied && (
                      <span className="text-xs text-gray-400">Apply again →</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}