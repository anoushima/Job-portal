import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../services/jobService";
import type { Job } from "../../types/jobType";
import { applyJob } from "../../services/jobService";

export default function JobDetails() {

  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {

    const fetchJob = async () => {

      if (!id) return;

      const jobId = Number(id);

      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (error) {
        console.error(error);
      }

    };

    fetchJob();

  }, [id]);

  if (!job) return <p className="p-10">Loading...</p>;

  const handleApply=async()=>{
    try{
        await applyJob(job.id)
        setJob({
            ...job,
            applied:true
        })
    }catch(error){
        console.error(error)
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{job.title}</h1>
      <p className="mt-4">{job.description}</p>
      <p className="mt-2">{job.location}</p>
      <p className="mt-2 text-green-600">₹ {job.salary}</p>
      <button disabled={job.applied}
      onClick={handleApply}
      className={`mt-6 px-6 py-2 rounded font-medium
      ${job.applied?"bg-grey-400 cursor-not-allowed":
        "bg-indigo-600 hover:bg-indigo-700 text-white"
      }` }>{job.applied?"Applied":"Apply Now"}</button>
    </div>
  );
}