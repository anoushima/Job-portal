import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

import hireImg from "../../assets/download (19).jpg";
import manageImg from "../../assets/HOME.jpg";
import growthImg from "../../assets/Mailbox Customizable Cartoon Illustrations _ Bro Style.jpg";

import { Users, Filter, Zap, ClipboardList, BarChart, TrendingUp } from "lucide-react";

export default function EmployerInfo() {
  const navigate = useNavigate();
  const [active, setActive] = useState("hire");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Navbar />

      {/* 🔹 HERO */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-4"
        >
          Hire Smarter, Faster
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 text-lg mb-10"
        >
          Find the right candidates with powerful hiring tools.
        </motion.p>

        <motion.div
          className="flex bg-gray-100 rounded-full p-1 w-[420px] shadow-inner"
        >
          <button
            onClick={() => {
              setActive("hire");
              navigate("/register");
            }}
            className={`w-1/2 py-3 rounded-full font-medium
              ${active === "hire"
                ? "bg-black text-white"
                : "text-black hover:bg-gray-200"}`}
          >
            Start Hiring
          </button>

          <button
            onClick={() => navigate("/jobs")}
            className="w-1/2 py-3 rounded-full font-medium text-black hover:bg-gray-200"
          >
            Browse Talent
          </button>
        </motion.div>
      </section>

      {/* 🔥 FEATURES */}
      <div className="bg-white py-16 px-6 space-y-20">

        {/* 🔹 Section 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <motion.div
            className="flex justify-center relative order-1 md:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img src={hireImg} className="w-[80%] max-w-[380px]" />
          </motion.div>

          {/* TEXT */}
          <motion.div
            className="flex flex-col justify-center order-2 md:order-1"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4">Find Top Talent</h3>

            <ul className="space-y-4 mb-6">
              <li className="flex gap-3"><Users /> Access a wide pool of candidates</li>
              <li className="flex gap-3"><Filter /> Filter by skills & experience</li>
              <li className="flex gap-3"><Zap /> Hire faster with smart tools</li>
            </ul>

            <button
              onClick={() => navigate("/register")}
              className="mt-4 px-6 py-3 bg-black text-white rounded-full"
            >
              Post a Job
            </button>
          </motion.div>
        </div>

        {/* 🔹 Section 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center bg-red-50 p-10 rounded-2xl">

          {/* IMAGE */}
          <motion.div
            className="flex justify-center relative order-1"
          >
            <img src={manageImg} className="w-[80%] max-w-[380px]" />
          </motion.div>

          {/* TEXT */}
          <motion.div className="flex flex-col justify-center order-2">
            <h3 className="text-3xl font-bold mb-4">Manage Applications Easily</h3>

            <ul className="space-y-4 mb-6">
              <li className="flex gap-3"><ClipboardList /> Track applicants in one place</li>
              <li className="flex gap-3"><Filter /> Shortlist top candidates</li>
              <li className="flex gap-3"><Zap /> Streamline hiring workflow</li>
            </ul>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-full"
            >
              View Dashboard
            </button>
          </motion.div>
        </div>

        {/* 🔹 Section 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <motion.div
            className="flex justify-center relative order-1 md:order-2"
          >
            <img src={growthImg} className="w-[80%] max-w-[380px]" />
          </motion.div>

          {/* TEXT */}
          <motion.div className="flex flex-col justify-center order-2 md:order-1">
            <h3 className="text-3xl font-bold mb-4">Grow Your Team</h3>

            <ul className="space-y-4 mb-6">
              <li className="flex gap-3"><TrendingUp /> Build strong teams</li>
              <li className="flex gap-3"><BarChart /> Improve hiring decisions</li>
              <li className="flex gap-3"><Users /> Find long-term talent</li>
            </ul>

            <button
              onClick={() => navigate("/register")}
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full"
            >
              Get Started
            </button>
          </motion.div>
        </div>

      </div>

      {/* 🔻 Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 text-center">
        <p>© {new Date().getFullYear()} NextRole. All rights reserved.</p>
      </footer>

    </div>
  );
}