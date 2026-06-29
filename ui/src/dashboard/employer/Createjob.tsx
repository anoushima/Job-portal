import { useState } from "react";
import { createJob } from "../../services/jobService";
import type { CreateJobType } from "../../types/jobType";
import { useNavigate, useLocation } from "react-router-dom";
import { EmployerSidebar } from "./EmployerDashboard";
import {
  Bell, Briefcase, MapPin, DollarSign, FileText, CheckCircle, ArrowLeft,
} from "lucide-react";

export default function CreateJob() {
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState<CreateJobType>({ title: "", description: "", location: "", salary: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setJob({ ...job, [e.target.name as keyof CreateJobType]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createJob(job);
      setSuccess(true);
      setTimeout(() => navigate("/employer-dashboard"), 2000);
    } catch (err) {
      console.error("Error posting job", err);
      setError("Failed to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "title", label: "Job Title", placeholder: "e.g. Senior Software Engineer", icon: Briefcase, type: "input" },
    { name: "location", label: "Location", placeholder: "e.g. Bangalore, Remote", icon: MapPin, type: "input" },
    { name: "salary", label: "Salary / CTC", placeholder: "e.g. ₹12,00,000 per annum", icon: DollarSign, type: "input" },
    { name: "description", label: "Job Description", placeholder: "Describe the role, responsibilities, requirements…", icon: FileText, type: "textarea" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <EmployerSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Post a Job</h1>
            <p className="text-sm text-gray-500">Fill in the details below to publish a new listing.</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Bell size={20} className="text-gray-600" />
          </button>
        </header>

        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
              <ArrowLeft size={15} /> Back
            </button>

            {success ? (
              <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Job Posted!</h2>
                <p className="text-sm text-gray-500 mt-2">Your listing is live. Redirecting to dashboard…</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                {/* Card header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 rounded-xl">
                      <Briefcase size={22} className="text-red-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">New Job Listing</h2>
                      <p className="text-xs text-gray-500">All fields are required</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {fields.map(({ name, label, placeholder, icon: Icon, type }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {type !== "textarea" && <Icon size={16} className="text-gray-400" />}
                        </div>
                        {type === "textarea" ? (
                          <textarea
                            name={name}
                            value={(job as any)[name]}
                            placeholder={placeholder}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:bg-white transition resize-none"
                          />
                        ) : (
                          <input
                            name={name}
                            value={(job as any)[name]}
                            placeholder={placeholder}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:bg-white transition"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-wait"
                    >
                      {submitting ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Publishing…</>
                      ) : (
                        <><Briefcase size={15} /> Publish Job</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/employer-dashboard")}
                      className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}