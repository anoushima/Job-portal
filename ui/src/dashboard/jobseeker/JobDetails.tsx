import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, applyJob, reportJob } from "../../services/jobService";
import type { Job } from "../../types/jobType";
import {
  MapPin, DollarSign, Briefcase, ArrowLeft, Send, CheckCircle,
  Building2, Clock, ChevronRight, Flag, X,
} from "lucide-react";

const REPORT_REASONS = [
  { value: "spam", label: "Spam or misleading" },
  { value: "fraud", label: "Looks fraudulent / scam" },
  { value: "offensive", label: "Offensive content" },
  { value: "expired", label: "Job no longer exists" },
  { value: "other", label: "Other" },
];

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("spam");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportError, setReportError] = useState("");

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

  const handleSubmitReport = async () => {
    if (!job) return;
    setReportSubmitting(true);
    setReportError("");
    try {
      await reportJob(job.id, reportReason, reportDescription);
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSubmitted(false);
        setReportDescription("");
        setReportReason("spam");
      }, 1800);
    } catch (err: any) {
      setReportError(err?.response?.data?.error || "Couldn't submit the report. Please try again.");
    } finally {
      setReportSubmitting(false);
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
          <button
            onClick={() => setShowReportModal(true)}
            className="ml-4 flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition"
            title="Report this job"
          >
            <Flag size={14} /> Report
          </button>
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

      {/* Report job modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            {reportSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Report submitted</h3>
                <p className="text-sm text-gray-500 mt-1">Our admin team will review it shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Flag size={16} className="text-red-600" /> Report this job
                  </h3>
                  <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>

                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 bg-white"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>

                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                  Additional details <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={3}
                  placeholder="Tell us what looks off about this posting…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />

                {reportError && (
                  <p className="text-sm text-red-600 mb-3">{reportError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={reportSubmitting}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-60"
                  >
                    {reportSubmitting ? "Submitting…" : "Submit Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}