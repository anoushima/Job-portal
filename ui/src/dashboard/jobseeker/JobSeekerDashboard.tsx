import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "../../services/jobService";

export default function JobSeekerDashboard() {

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await getJobs();
      setJobs(data);
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">

        <div className="p-6 text-2xl font-bold border-b border-gray-500">
          JobPortal
        </div>

        <nav className="flex-1 p-4 space-y-4">

          <button
            onClick={() => navigate("/jobseeker/dashboard")}
            className="block w-full text-left px-4 py-2 rounded hover:bg-indigo-600"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/jobs")}
            className="block w-full text-left px-4 py-2 rounded hover:bg-indigo-600"
          >
            Find Jobs
          </button>

          <button
            onClick={() => navigate("/my-applications")}
            className="block w-full text-left px-4 py-2 rounded hover:bg-indigo-600"
          >
            My Applications
          </button>

          <button
            className="block w-full text-left px-4 py-2 rounded hover:bg-indigo-600"
          >
            Profile
          </button>

        </nav>

        <div className="p-4 border-t border-gray-500">
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-900">
            Logout
          </button>
        </div>

      </aside>


      {/* Main Content */}
      <main className="flex-1 p-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Jobseeker Dashboard
          </h1>

          <p className="text-gray-600">
            Explore jobs and track your applications.
          </p>
        </div>


        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div
            onClick={() => navigate("/jobs")}
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-indigo-900">
              Find Jobs
            </h3>
            <p className="text-gray-600 mt-2">
              Explore jobs from top companies.
            </p>
          </div>

          <div
            onClick={() => navigate("/my-applications")}
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-indigo-900">
              Track Applications
            </h3>
            <p className="text-gray-600 mt-2">
              Monitor your application status.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900">
              Build Profile
            </h3>
            <p className="text-gray-600 mt-2">
              Showcase your skills and experience.
            </p>
          </div>

        </div>


        {/* Recommended Jobs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recommended Jobs
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {jobs.slice(0, 3).map((job: any) => (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold text-indigo-900">
                  {job.title}
                </h3>

                <p className="text-gray-600">{job.location}</p>

                <p className="text-sm text-gray-500">
                  {job.salary}
                </p>

                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="mt-3 bg-indigo-900 text-white px-4 py-1 rounded hover:bg-indigo-800"
                >
                  View
                </button>
              </div>
            ))}

          </div>

          {/* Explore Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/jobs")}
              className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
            >
              Explore More Jobs
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}