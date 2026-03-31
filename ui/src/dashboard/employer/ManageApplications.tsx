import { useEffect, useState } from "react";
import { getEmployerApplications, updateApplicationStatus } from "../../services/jobService";

export default function ManageApplications() {

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getEmployerApplications();
        setApplications(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {

    await updateApplicationStatus(id, status);

    setApplications((prev: any) =>
      prev.map((app: any) =>
        app.id === id ? { ...app, status: status } : app
      )
    );
  };


  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">Manage Applications</h1>

      <table className="w-full bg-white shadow rounded-lg">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Applicant</th>
            <th className="p-3 text-left">Job</th>
            <th className="p-3 text-left">Applied Date</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>

          {applications.map((app: any) => (

            <tr key={app.id} className="border-t">

              <td className="p-3">{app.applicant}</td>

              <td className="p-3">{app.job_title}</td>

              <td className="p-3">
                {new Date(app.applied_at).toLocaleDateString()}
              </td>

              <td className="p-3 space-x-2">

<button
  onClick={() => handleStatusUpdate(app.id, "viewed")}
  disabled={app.status !== "pending"}
  className={`px-3 py-1 rounded text-white ${
    app.status === "viewed"
      ? "bg-blue-600"
      : "bg-gray-400 hover:bg-blue-500"
  }`}
>
  View
</button>

<button
  onClick={() => handleStatusUpdate(app.id, "shortlisted")}
  disabled={app.status === "rejected"}
  className={`px-3 py-1 rounded text-white ${
    app.status === "shortlisted"
      ? "bg-green-600"
      : "bg-gray-400 hover:bg-green-500"
  }`}
>
  Shortlist
</button>

<button
  onClick={() => handleStatusUpdate(app.id, "rejected")}
  disabled={app.status === "shortlisted"}
  className={`px-3 py-1 rounded text-white ${
    app.status === "rejected"
      ? "bg-red-600"
      : "bg-gray-400 hover:bg-red-500"
  }`}
>
  Reject
</button>

</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}