import { useEffect, useState } from "react";
import { trackApplications } from "../../services/jobService";

const TrackApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await trackApplications();
        setApplications(data);
      } catch (error) {
        console.error("error fetching applications", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>

      {applications.map((app:any)=>(
  <div key={app.id} className="bg-white shadow rounded-lg p-4 mb-4">

    <h3 className="text-lg font-semibold">{app.job_title}</h3>

    <p className="text-gray-600">{app.location}</p>

    <p className="text-sm text-gray-500">
      Applied on {new Date(app.applied_at).toLocaleDateString()}
    </p>

    <span
  className={`px-2 py-1 rounded text-white text-sm
  ${app.status === "pending" ? "bg-yellow-500" :
    app.status === "viewed" ? "bg-blue-500" :
    app.status === "shortlisted" ? "bg-green-500" :
    "bg-red-500"}`}
>
  {app.status}
</span>

  </div>
))}
    </div>
  );
};

export default TrackApplications;