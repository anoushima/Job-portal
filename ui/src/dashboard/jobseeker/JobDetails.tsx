import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, applyJob } from "../../services/jobService";
import type { Job } from "../../types/jobType";
import {
  MapPin, DollarSign, Briefcase, ArrowLeft, Send, CheckCircle,
  Building2, Clock, ChevronRight,
} from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const data = await getJobById(Number(id));
        setJob(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      await applyJob(job.id);
      setJob({ ...job, applied: true });
      setJustApplied(true);
      // Allow re-applying — don't permanently disable
      setTimeout(() => setJustApplied(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading job details…</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase size={40} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Job not found</h3>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-red-600 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top nav */}
      <header className="bg-black text-white px-8 py-4 flex items-center gap-4">
        <h1 className="text-lg font-extrabold tracking-wide cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-white">Next</span>
          <span className="text-red-500">Rol</span>
          <span className="text-white">E</span>
        </h1>
        <div className="flex items-center gap-1 text-gray-400 text-sm ml-auto">
          <button onClick={() => navigate("/jobs")} className="hover:text-white transition">Find Jobs</button>
          <ChevronRight size={14} />
          <span className="text-white truncate max-w-xs">{job.title}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft size={15} /> Back to jobs
        </button>

        {/* Job header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-red-50 rounded-2xl shrink-0">
              <Briefcase size={28} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {job.location && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin size={14} /> {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <DollarSign size={14} /> ₹ {job.salary}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Building2 size={14} /> Full Time
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock size={14} /> Posted recently
                </span>
              </div>
            </div>
          </div>

          {/* Apply section */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
            {/* Always enabled — even previously applied can re-apply */}
            <button
              onClick={handleApply}
              disabled={applying}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                justApplied
                  ? "bg-green-600 text-white"
                  : applying
                  ? "bg-gray-300 text-gray-500 cursor-wait"
                  : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
              }`}
            >
              {justApplied ? (
                <><CheckCircle size={16} /> Application Sent!</>
              ) : applying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying…
                </>
              ) : (
                <><Send size={15} /> Apply Now</>
              )}
            </button>

            {job.applied && !justApplied && (
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-500" />
                You've applied before — you can apply again.
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-base font-bold text-gray-900 mb-4">About This Role</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {/* Quick apply sticky footer on scroll */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{job.title}</p>
            <p className="text-sm text-gray-500">{job.location}</p>
          </div>
          <button
            onClick={handleApply}
            disabled={applying}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            <Send size={14} /> Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}