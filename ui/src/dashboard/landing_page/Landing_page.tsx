import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("role");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 🔹 Navbar */}
      <div className="flex justify-between items-center p-6 relative">

        {/* Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-black">Next</span>
            <span className="text-red-600">Rol</span>
            <span className="text-black">E</span>
          </h1>
        </div>

        {/* 🔹 Desktop Nav */}
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
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
          >
            Register
          </button>
        </div>

        {/* 🔹 Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* 🔥 Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-20 right-6 bg-white shadow-lg rounded-xl p-6 w-56 space-y-4 md:hidden z-50">

            <button
              onClick={() => {
                navigate("/jobseeker-info");
                setMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700"
            >
              For Job Seekers
            </button>

            <button
              onClick={() => {
                navigate("/employer-info");
                setMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700"
            >
              For Companies
            </button>

            <hr />

            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700"
            >
              Login
            </button>

            <button
              onClick={() => {
                navigate("/register");
                setMenuOpen(false);
              }}
              className="block w-full text-left text-red-600"
            >
              Register
            </button>
          </div>
        )}
      </div>

      {/* 🔥 HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-4"
        >
          Find Your Next
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 text-lg mb-10"
        >
          Whether you're hiring or job hunting — we've got you covered.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex bg-gray-100 rounded-full p-1 w-[420px] shadow-inner"
        >
          <button
            onClick={() => {
              setActive("hire");
              navigate("/register-employer");
            }}
            className={`w-1/2 py-3 rounded-full font-medium
              ${active === "hire"
                ? "bg-black text-white"
                : "text-black hover:bg-gray-200"}`}
          >
            Find Your Next Hire
          </button>

          <button
            onClick={() => {
              setActive("role");
              navigate("/register-jobseeker");
            }}
            className={`w-1/2 py-3 rounded-full font-medium
              ${active === "role"
                ? "bg-black text-white"
                : "text-black hover:bg-gray-200"}`}
          >
            Find Your Next Role
          </button>
        </motion.div>
      </section>

      {/* 🔥 COMPARISON SECTION */}
      <div className="grid md:grid-cols-2 min-h-[600px]">

        {/* Job Seekers */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Job Seekers Choose Us
          </h2>

          <ul className="space-y-4 text-gray-700 mb-8">
            <li>🚀 Discover jobs tailored to your skills</li>
            <li>📄 Track applications in one place</li>
            <li>⚡ Quick applications</li>
            <li>🔔 Real-time alerts</li>
            <li>🎯 Better matches</li>
          </ul>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/jobseeker-info")}
              className="px-5 py-2 border border-black rounded-lg hover:bg-black hover:text-white"
            >
              Learn More
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Recruiters */}
        <div className="bg-red-50 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Recruiters Choose Us
          </h2>

          <ul className="space-y-4 text-gray-700 mb-8">
            <li>🎯 Reach candidates faster</li>
            <li>📊 Manage applications</li>
            <li>⚡ Post jobs quickly</li>
            <li>🔍 Smart filters</li>
            <li>📈 Streamlined hiring</li>
          </ul>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/employer-info")}
              className="px-5 py-2 border border-black rounded-lg hover:bg-black hover:text-white"
            >
              Learn More
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* 🔻 Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 text-center">
        <p>© {new Date().getFullYear()} NextRole. All rights reserved.</p>
      </footer>

    </div>
  );
}