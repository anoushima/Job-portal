import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Job } from "../../types/jobType";

export default function PublicJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem("access");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Public endpoint — no auth needed
        const res = await axios.get("http://127.0.0.1:8000/api/jobs/public/");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching public jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = search.length >= 2
    ? jobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.location?.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  const handleApply = (jobId: number) => {
    if (!isLoggedIn) {
      // Redirect to login, then come back
      navigate("/login", { state: { from: `/jobs/${jobId}` } });
    } else {
      navigate(`/jobs/${jobId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-black">Next</span>
            <span className="text-red-600">Rol</span>
            <span className="text-black">E</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => {
                const role = localStorage.getItem("role");
                navigate(role === "employer" ? "/employer-dashboard" : "/jobseeker-dashboard");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register-jobseeker")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-14 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Find Your Next <span className="text-red-500">Role</span>
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Explore opportunities posted by top companies
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search jobs by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg"
          />
        </div>
      </div>

      {/* Login prompt banner for guests */}
      {!isLoggedIn && (
        <div className="bg-red-50 border-b border-red-100 px-6 py-3 text-center text-sm text-gray-600">
          👋 You're browsing as a guest.{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-600 font-semibold cursor-pointer hover:underline"
          >
            Sign in
          </span>{" "}
          or{" "}
          <span
            onClick={() => navigate("/register-jobseeker")}
            className="text-red-600 font-semibold cursor-pointer hover:underline"
          >
            create an account
          </span>{" "}
          to apply for jobs.
        </div>
      )}

      {/* Jobs Grid */}
      <div className="flex-1 px-6 py-10 max-w-7xl mx-auto w-full">

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> jobs
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Job Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{job.title}</h3>

                  {/* Location & Salary */}
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        📍 {job.location}
                      </span>
                    )}
                    {job.salary && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        💰 ₹{job.salary}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mb-5">
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {job.job_type || "Full-time"}
                    </span>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => handleApply(job.id)}
                    className="w-full py-2 rounded-lg text-sm font-medium border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    {isLoggedIn ? "View & Apply" : "Login to Apply"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} NextRole. All rights reserved.</p>
      </footer>
    </div>
  );
}