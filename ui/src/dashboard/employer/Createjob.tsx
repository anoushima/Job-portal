import { useState } from "react";
import { createJob } from "../../services/jobService";
import type { CreateJobType } from "../../types/jobType";
import { useNavigate } from "react-router-dom";

export default function CreateJob(){

    const[job,setJob]=useState<CreateJobType>({
        title:"",
        description:"",
        location:"",
        salary:"",
    });

    const navigate = useNavigate();

    const handleChange=(
        e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    )=>{
        const name=e.target.name as keyof CreateJobType
        setJob({
            ...job,
            [name]:e.target.value,
        });
    };

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();

        try{
            await createJob(job);
            alert("Job posted succesfully!");
            navigate("/employer-dashboard");
        }catch(error){
            console.error("Error posting job",error);
        }
    };

    return(

        <div className="p-10 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Create Job Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={job.title}
          placeholder="Job Title"
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <textarea
          name="description"
          value={job.description}
          placeholder="Job Description"
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <input
          name="location"
          value={job.location}
          placeholder="Location"
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <input
          name="salary"
          value={job.salary}
          placeholder="Salary"
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Post Job
        </button>

      </form>

    </div>

    )
}