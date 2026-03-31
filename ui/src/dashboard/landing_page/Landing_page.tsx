import { useNavigate } from "react-router-dom";

export default function LandingPage() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="flex justify-between items-center p-6 bg-white shadow">

        <h1 className="text-2xl font-bold text-indigo-700">
          JobPortal
        </h1>

        <div className="space-x-4">

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Register
          </button>

        </div>
      </div>

      {/* Hero Section */}

      <div className="flex flex-col items-center justify-center text-center mt-40">

        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your Dream Job
        </h2>

        <p className="text-gray-600 mb-6">
          Connect with top employers and explore new opportunities.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Get Started
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 px-10">

  {/* Apply Easily */}
  <div
    onClick={() => navigate("/login")}
    className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:shadow-xl transition"
  >
    <h3 className="text-xl font-semibold text-indigo-700">
      Apply Easily
    </h3>

    <p className="text-gray-600 mt-2">
      Discover job opportunities and apply with just a few clicks.
    </p>
  </div>


  {/* Post Jobs */}
  <div
    onClick={() => navigate("/login")}
    className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:shadow-xl transition"
  >
    <h3 className="text-xl font-semibold text-indigo-700">
      Post Jobs Quickly
    </h3>

    <p className="text-gray-600 mt-2">
      Employers can create job listings and reach qualified candidates instantly.
    </p>
  </div>


  {/* Track Applications */}
  <div
    onClick={() => navigate("/login")}
    className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:shadow-xl transition"
  >
    <h3 className="text-xl font-semibold text-indigo-700">
      Track Applications
    </h3>

    <p className="text-gray-600 mt-2">
      Stay updated with application status and manage candidates efficiently.
    </p>
  </div>

</div>

    </div>
  );
}