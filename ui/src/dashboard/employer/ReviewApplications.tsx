import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getEmployerApplications,
  updateApplicationStatus,
} from "../../services/jobService";

export default function ReviewApplications() {
  const location = useLocation();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");

  // ✅ Sync filter with URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status") || "all";
    setFilter(status);
  }, [location.search]);

  // ✅ Fetch applications based on filter
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data =
          filter === "all"
            ? await getEmployerApplications()
            : await getEmployerApplications(filter);

        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [filter]);

  // ✅ Update status
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateApplicationStatus(id, status);
      // refresh list
      const updated =
        filter === "all"
          ? await getEmployerApplications()
          : await getEmployerApplications(filter);

      setApplications(updated);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {filter === "shortlisted"
            ? "Shortlisted Candidates"
            : filter === "rejected"
            ? "Rejected Candidates"
            : "All Applications"}
        </h1>

        <button
          onClick={() => navigate("/employer-dashboard")}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {["all", "applied", "shortlisted", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => navigate(`?status=${tab}`)}
            className={`px-4 py-2 rounded ${
              filter === tab
                ? "bg-indigo-600 text-white"
                : "bg-white border"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app: any) => (
          <div
            key={app.id}
            className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
          >
            {/* Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
  {app.user?.username || "Unknown User"}
</h3>

              <p className="text-gray-600">
  Applied for: {app.job?.title || "Unknown Job"}
</p>

              <span
                className={`text-sm font-medium ${
                  app.status === "shortlisted"
                    ? "text-green-600"
                    : app.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {app.status.toUpperCase()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleStatusChange(app.id, "shortlisted")
                }
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Shortlist
              </button>

              <button
                onClick={() =>
                  handleStatusChange(app.id, "rejected")
                }
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <p className="text-gray-500 mt-6">
          No applications found.
        </p>
      )}
    </div>
  );
}