import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplicationCount, getEmployerJobs, getShortlistedCount } from "../../services/jobService";


export default function EmployerDashboard() {

  const navigate = useNavigate();
  const[jobs,setJobs]=useState([]);
  const[jobCount,setJobCount]=useState(0);
  const[applicationCount,setApplicationCount]=useState(0);
  const[shortlistedCount,setShortlistedCount]=useState(0);



useEffect(()=>{
  fetchData();
},[])



const fetchData=async()=>{
  try{
    const jobsData=await getEmployerJobs();
    setJobs(jobsData);
    setJobCount(jobsData.length);

    const appData=await getApplicationCount();
    setApplicationCount(appData.applications_count);

    const shortData=await getShortlistedCount();
    setShortlistedCount(shortData.shortlisted_count);

  }catch(error){
    console.error(error);
  }
};
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">

        <div className="p-6 text-2xl font-bold border-b border-gray-600">
          JobPortal
        </div>

        <nav className="flex-1 p-4 space-y-4">

          <button
            onClick={() => navigate("/employer/dashboard")}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/create-job")}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600"
          >
            Post Job
          </button>

          <button
            onClick={() => navigate("/employer/applications")}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600"
          >
            Manage Applications
          </button>

          <button
            onClick={() => navigate("/employer/jobs")}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600"
          >
            My Job Listings
          </button>

          <button
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600"
          >
            Profile
          </button>

        </nav>

        <div className="p-4 border-t border-gray-500">
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-600">
            Logout
          </button>
        </div>

      </aside>


      {/* Main Content */}
      <main className="flex-1 p-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Employer Dashboard
          </h1>

          <p className="text-gray-600">
            Manage job postings and track applicants.
          </p>
        </div>


        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-gray-500">Jobs Posted</h3>
            <p className="text-3xl font-bold text-indigo-900 mt-2">{jobCount}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-gray-500">Applications</h3>
            <p className="text-3xl font-bold text-indigo-900 mt-2">{applicationCount}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-gray-500">Shortlisted</h3>
            <p className="text-3xl font-bold text-indigo-900 mt-2">{shortlistedCount}</p>
          </div>

        </div>


        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          <div
            onClick={() => navigate("/create-job")}
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-indigo-900">
              Post a New Job
            </h3>

            <p className="text-gray-600 mt-2">
              Create job listings and attract candidates.
            </p>
          </div>


          <div
            onClick={() => navigate("/employer/applications?status=shortlisted")}
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-indigo-900">
              Review Applications
            </h3>

            <p className="text-gray-600 mt-2">
              Track applicants and update their status.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}