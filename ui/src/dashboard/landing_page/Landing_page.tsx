import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center p-6 relative">

        {/* Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-black">Next</span>
            <span className="text-red-600">Rol</span>
            <span className="text-black">E</span>
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => navigate("/jobseeker-info")}
            className="text-gray-700 hover:text-black transition"
          >
            For Job Seekers
          </button>

          <button
            onClick={() => navigate("/employer-info")}
            className="text-gray-700 hover:text-black transition"
          >
            For Companies
          </button>

          <button
            onClick={() => navigate("/public-jobs")}
            className="text-gray-700 hover:text-black transition"
          >
            Browse Jobs
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register-jobseeker")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-20 right-6 bg-white shadow-lg rounded-xl p-6 w-56 space-y-4 md:hidden z-50">
            <button
              onClick={() => { navigate("/jobseeker-info"); setMenuOpen(false); }}
              className="block w-full text-left text-gray-700"
            >
              For Job Seekers
            </button>
            <button
              onClick={() => { navigate("/employer-info"); setMenuOpen(false); }}
              className="block w-full text-left text-gray-700"
            >
              For Companies
            </button>
            <button
              onClick={() => { navigate("/public-jobs"); setMenuOpen(false); }}
              className="block w-full text-left text-gray-700"
            >
              Browse Jobs
            </button>
            <hr />
            <button
              onClick={() => { navigate("/login"); setMenuOpen(false); }}
              className="block w-full text-left text-gray-700 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => { navigate("/register-jobseeker"); setMenuOpen(false); }}
              className="block w-full text-left text-red-600 font-medium"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-4"
        >
          Find Your Next
          <span className="text-red-600"> Role</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 text-lg mb-10 max-w-md"
        >
          Whether you're hiring or job hunting — we've got you covered.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate("/public-jobs")}
            className="px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition shadow-lg"
          >
            Find Your Next Role →
          </button>

          <button
            onClick={() => navigate("/register-employer")}
            className="px-8 py-4 border-2 border-black text-black rounded-xl font-semibold text-lg hover:bg-black hover:text-white transition"
          >
            Post a Job
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-400 text-sm mt-6"
        >
          Browse jobs for free · No account needed to explore
        </motion.p>
      </section>

      {/* COMPARISON SECTION */}
      <div className="grid md:grid-cols-2 min-h-[600px]">

        {/* Job Seekers */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Why Job Seekers Choose Us</h2>
          <ul className="space-y-4 text-gray-700 mb-8">
            <li>🚀 Discover jobs tailored to your skills</li>
            <li>📄 Track applications in one place</li>
            <li>⚡ Quick one-click applications</li>
            <li>🔔 Real-time status updates</li>
            <li>🎯 Better job matches</li>
          </ul>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/jobseeker-info")}
              className="px-5 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
            >
              Learn More
            </button>
            <button
              onClick={() => navigate("/register-jobseeker")}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sign Up Free
            </button>
          </div>
        </div>

        {/* Recruiters */}
        <div className="bg-red-50 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Why Recruiters Choose Us</h2>
          <ul className="space-y-4 text-gray-700 mb-8">
            <li>🎯 Reach candidates faster</li>
            <li>📊 Manage all applications</li>
            <li>⚡ Post jobs in minutes</li>
            <li>🔍 Smart candidate filters</li>
            <li>📈 Streamlined hiring pipeline</li>
          </ul>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/employer-info")}
              className="px-5 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
            >
              Learn More
            </button>
            <button
              onClick={() => navigate("/register-employer")}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Post a Job
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 text-center">
        <p>© {new Date().getFullYear()} NextRole. All rights reserved.</p>
      </footer>
    </div>
  );
}