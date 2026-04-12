import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import homeImg from "../../assets/HOME.jpg"
import careerImg from "../../assets/download (19).jpg"
import hereImg from "../../assets/Mailbox Customizable Cartoon Illustrations _ Bro Style.jpg"
import { MousePointerClick, Sparkles, Filter, Bell, Clock, TrendingUp, Target, Briefcase, Brain } from "lucide-react";




export default function JobSeekerInfo() {
  const navigate = useNavigate();
  const [active, setActive] = useState("browse");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Navbar />

      {/* 🔹 Hero Section */}
       <section className="h-screen flex flex-col items-center justify-center text-center px-4">
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-4"
        >
          The right job, right here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 text-lg mb-10"
        >
          Discover roles made for you.
        </motion.p>

        {/* 🔹 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex bg-gray-100 rounded-full p-1 w-[420px] shadow-inner"
        >
          <button
            onMouseEnter={() => setActive("register")}
            onClick={() => navigate("/register")}
            className={`w-1/2 py-3 rounded-full font-medium transition-all duration-300
              ${active === "register"
                ? "bg-black text-white shadow-md"
                : "text-black hover:bg-gray-200"}`}
          >
            Register
          </button>

          <button
            onMouseEnter={() => setActive("browse")}
            onClick={() => navigate("/jobs")}
            className={`w-1/2 py-3 rounded-full font-medium transition-all duration-300
              ${active === "browse"
                ? "bg-black text-white shadow-md"
                : "text-black hover:bg-gray-200"}`}
          >
            Browse Jobs
          </button>
        </motion.div>

        {/* 🔽 Scroll Indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 text-gray-400 text-sm"
        >
          ↓ Scroll to explore
        </motion.div> */}

      </section>

      {/* 🔥 Features Section */}
      <div className="bg-white py-16 px-6 space-y-20">

        {/* 🔹 Section 1 */}
       <div className="grid md:grid-cols-2 gap-12 items-center">

  {/* 🔹 TEXT */}
  <motion.div
    className="flex flex-col justify-center order-2 md:order-1"
    initial={{ opacity: 0, x: -60 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h3 className="text-3xl md:text-4xl font-bold mb-5">
   Quick & Easy Applications
</h3>

<p className="text-lg text-gray-500 mb-8 max-w-xl">
  Apply faster with a seamless experience designed to save your time.
  Discover opportunities that match your skills instantly.
</p>

<ul className="space-y-6 max-w-xl">

  <li className="flex items-start gap-4">
    <MousePointerClick className="text-green-500 mt-1" size={26} />

    <div>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
        Apply instantly
      </p>
      <p className="text-base md:text-lg text-gray-600">
        Apply to jobs in just a few clicks without lengthy forms.
      </p>
    </div>
  </li>

  <li className="flex items-start gap-4">
    <Sparkles className="text-green-500 mt-1" size={26} />

    <div>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
        Personalized for you
      </p>
      <p className="text-base md:text-lg text-gray-600">
        Get job recommendations tailored to your profile.
      </p>
    </div>
  </li>

  <li className="flex items-start gap-4">
    <Filter className="text-green-500 mt-1" size={26} />

    <div>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
        Smarter search
      </p>
      <p className="text-base md:text-lg text-gray-600">
        Use advanced filters to quickly find the right role.
      </p>
    </div>
  </li>

  <button
  onClick={() => navigate("/jobs")}
  className="mt-8 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
>
  Browse Jobs
</button>

</ul>
  </motion.div>

  {/* 🔹 IMAGE (CLEAN FLOATING STYLE) */}
  <motion.div
    className="flex justify-center relative order-1 md:order-2"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <motion.img
      src={homeImg}
      alt="feature"
      className="w-[80%] max-w-[380px]"
      animate={{
        y: [0, -18, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* SAME subtle shadow (optional like your original) */}
    <div className="absolute bottom-0 w-40 h-6 bg-black/10 blur-xl rounded-full"></div>
  </motion.div>

</div>

{/* section2 */}

        {/* 🔹 Section 2 */}
<div className="grid md:grid-cols-2 gap-12 items-center bg-red-50 p-10 rounded-2xl">

  {/* 🔹 IMAGE (LEFT on desktop) */}
  <motion.div
    className="flex justify-center relative order-1 md:order-1"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <motion.img
      src={hereImg}
      alt="feature"
      className="w-[80%] max-w-[380px]"
      animate={{
        y: [0, -18, 0],
        rotate: [0, -2, 2, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    <div className="absolute bottom-0 w-40 h-6 bg-black/10 blur-xl rounded-full"></div>
  </motion.div>

  {/* 🔹 TEXT */}
  <motion.div
    className="flex flex-col justify-center order-2 md:order-2"
    initial={{ opacity: 0, x: 60 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h3 className="text-3xl md:text-4xl font-bold mb-3">
      Stay Updated Always
    </h3>

    <p className="text-lg text-gray-500 mb-6 max-w-xl">
      Stay informed with real-time updates and never miss an opportunity.
      Get alerts tailored to your preferences.
    </p>

    <ul className="space-y-6 max-w-xl">

      <li className="flex items-start gap-4">
        <Bell className="text-blue-500 mt-1" size={26} />
        <div>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            Stay in the know
          </p>
          <p className="text-base md:text-lg text-gray-600">
            Get notified about new job openings as soon as they go live.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-4">
        <Clock className="text-blue-500 mt-1" size={26} />
        <div>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            Never miss opportunities
          </p>
          <p className="text-base md:text-lg text-gray-600">
            Stay updated in real-time so you never miss the right role.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-4">
        <TrendingUp className="text-blue-500 mt-1" size={26} />
        <div>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            Stay ahead
          </p>
          <p className="text-base md:text-lg text-gray-600">
            Be among the first to apply and increase your chances.
          </p>
        </div>
      </li>

      <button
  onClick={() => navigate("/register")}
  className="mt-8 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
>
  Create Profile
</button>

    </ul>
  </motion.div>

</div>

        {/* 🔹 Section 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

  {/* 🔹 TEXT */}
  <motion.div
    className="flex flex-col justify-center order-2 md:order-1"
    initial={{ opacity: 0, x: -60 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h3 className="text-3xl md:text-4xl font-bold mb-3">
   Find the Right Fit
</h3>

<p className="text-lg text-gray-500 mb-6 max-w-xl">
  Discover roles that truly align with your skills and career goals.
  Make smarter decisions with better job matches.
</p>

<ul className="space-y-6 max-w-xl">

  <li className="flex items-start gap-4">
    <Target className="text-purple-500 mt-1" size={26} />

    <div>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
        Find the right fit
      </p>
      <p className="text-base md:text-lg text-gray-600">
        Discover jobs tailored to your skills and interests.
      </p>
    </div>
  </li>

  <li className="flex items-start gap-4">
    <Briefcase className="text-purple-500 mt-1" size={26} />

    <div>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
        Better career matches
      </p>
      <p className="text-base md:text-lg text-gray-600">
        Explore roles aligned with your long-term career goals.
      </p>
    </div>
  </li>

  <li className="flex items-start gap-4">
    <Brain className="text-purple-500 mt-1" size={26} />

    <div>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
        Smarter discovery
      </p>
      <p className="text-base md:text-lg text-gray-600">
        Use intelligent matching to find opportunities that suit you best.
      </p>
    </div>
  </li>

  <button
  onClick={() => navigate("/register")}
  className="mt-8 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
>
  Get Started
</button>

</ul>
          </motion.div>

  {/* 🔹 IMAGE (CLEAN FLOATING STYLE) */}
  <motion.div
    className="flex justify-center relative order-1 md:order-2"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <motion.img
      src={careerImg}
      alt="feature"
      className="w-[80%] max-w-[380px]"
      animate={{
        y: [0, -18, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* SAME subtle shadow (optional like your original) */}
    <div className="absolute bottom-0 w-40 h-6 bg-black/10 blur-xl rounded-full"></div>
  </motion.div>

</div>

      </div>

      <footer className="bg-black text-gray-300 py-10 mt-20">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

    {/* 🔹 Brand */}
    <div>
      <h2 className="text-white text-2xl font-bold mb-3">NextRole</h2>
      <p className="text-sm">
        Helping you find the right job faster with smarter tools.
      </p>
    </div>

    {/* 🔹 Links */}
    <div>
      <h3 className="text-white font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li onClick={() => navigate("/jobs")} className="cursor-pointer hover:text-white">
          Browse Jobs
        </li>
        <li onClick={() => navigate("/register")} className="cursor-pointer hover:text-white">
          Create Profile
        </li>
        <li className="cursor-pointer hover:text-white">
          About Us
        </li>
      </ul>
    </div>

    {/* 🔹 Contact */}
    <div>
      <h3 className="text-white font-semibold mb-3">Contact</h3>
      <p className="text-sm">support@nextrole.com</p>
      <p className="text-sm">+91 XXXXX XXXXX</p>
    </div>

  </div>

  {/* 🔻 Bottom */}
  <div className="text-center text-sm text-gray-500 mt-8">
    © {new Date().getFullYear()} NextRole. All rights reserved.
  </div>
</footer>
    </div>
  );
}