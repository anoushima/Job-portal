import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full">

      {/* 🔹 Top Navbar */}
      <div className="grid grid-cols-3 items-center p-6">

  {/* 🔹 Left - Logo */}
  <div className="flex justify-start">
    <div onClick={() => navigate("/")} className="cursor-pointer">
      <h1 className="text-2xl font-extrabold tracking-wide">
        <span className="text-black">Next</span>
        <span className="text-red-600">Rol</span>
        <span className="text-black">E</span>
      </h1>
    </div>
  </div>

  {/* 🔹 Center - Menu */}
  <div className="hidden md:flex justify-center space-x-8 items-center">
    <button onClick={() => navigate("/")}>Home</button>
    <button onClick={() => navigate("/jobs")}>Jobs</button>
    <button onClick={() => navigate("/jobs")}>Companies</button>
    <button onClick={() => navigate("/jobs")}>Remote</button>
  </div>

  {/* 🔹 Right - Auth */}
  <div className="hidden md:flex justify-end space-x-4">
    <button
      onClick={() => navigate("/login")}
      className="px-4 py-2 rounded-lg font-medium text-black border border-black
      transition-all duration-300 hover:bg-black hover:text-white"
    >
      Login
    </button>

    <button
      onClick={() => navigate("/register")}
      className="px-4 py-2 rounded-lg font-medium text-red-600 border border-red-600
      transition-all duration-300 hover:bg-red-600 hover:text-white"
    >
      Register
    </button>
  </div>

  {/* 🔹 Mobile Hamburger (overrides right side) */}
  <div className="md:hidden absolute right-6">
    <button onClick={() => setMenuOpen(!menuOpen)}>
      ☰
    </button>
  </div>

</div>

      {/* 🔹 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-white shadow-md py-6 space-y-4">

          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/jobs")}>Jobs</button>
          <button onClick={() => navigate("/jobs")}>Companies</button>
          <button onClick={() => navigate("/jobs")}>Remote</button>
          

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg font-medium text-black border border-black w-40"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-lg font-medium text-red-600 border border-red-600 w-40"
          >
            Register
          </button>

        </div>
      )}

    </div>
  );
}