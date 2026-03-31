import { useEffect, useState } from "react";
import { getJobs, } from "../../services/jobService";
import type { Job } from "../../types/jobType";
import {  useNavigate } from "react-router-dom";

export default function JobsList(){
    const [jobs,seJobs]=useState<Job[]>([]);
    const navigate=useNavigate();
    const [search,setSearch]=useState("");

    useEffect(()=>{
        const fetchJobs=async()=>{
            try{
                const data=await getJobs();
                seJobs(data);
            }catch(error){
                console.error("error fetching jobs",error);
            }
        };

        fetchJobs();
    },[]);

    // search logic
    const filteredJobs=search.length>=3 ? jobs.filter((job)=> job.title.toLowerCase().includes(search.toLocaleLowerCase())):jobs

    return(

        <div className="min-h-screen bg-gray-50 p-10">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Explore Opportunities
      </h1>

      {/* searchbar */}
      <div className="flex justify-center mb-8">
        <input type="text" placeholder="search here" value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full md:w-1/2 p-3 border-gray-300 rounded-lg shadow-sm foucs:outline-none focus:ring-indigo-400" />
      </div>

      {/* No jobs message */}
      {jobs.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No jobs available right now.
        </p>
      )}

      {/* Job Cards */}
      <div className="grid md:grid-cols-3 gap-8">

        {filteredJobs.map((job) => (
  <div key={job.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
    <h3 className="font-bold text-xl text-indigo-700">{job.title}</h3>
    <p className="text-gray-600 mt-3 line-clamp-3"></p>
    <div className="mt-4 space-y-1 text-sm text-gray-500">
      <p><span className="font-medium">{job.location}</span></p>
      <p><span className="font-medium text-green-600">₹ {job.salary}</span></p>
    </div>
    <button
  disabled={job.applied}
  onClick={() => navigate(`/jobs/${job.id}`)}
  className={`mt-4 font-medium
    ${job.applied
      ? "text-green-600"
      : "text-indigo-600 hover:underline"
    }`}
>
  {job.applied ? "Applied" : "View Job"}
</button>
  </div>
))}
        

      </div>

    </div>
        
    )
}