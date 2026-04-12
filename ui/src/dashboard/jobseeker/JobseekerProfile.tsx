import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("access")}` };
}

export default function JobseekerProfile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
  });

  const [form, setForm] = useState({ ...profile });

  useEffect(() => {
    axios
      .get(`${API}/profile/jobseeker/`, { headers: authHeaders() })
      .then((r) => {
        setProfile(r.data);
        setForm(r.data);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await axios.put(
        `${API}/profile/jobseeker/`,
        form,
        { headers: authHeaders() }
      );
      setProfile(data);
      setForm(data);
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "JS";

  const skillsList = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-gray-500 text-lg">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-gray-600">JobPortal</div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: "Dashboard", path: "/jobseeker-dashboard" },
            { label: "Find Jobs", path: "/jobs" },
            { label: "My Applications", path: "/my-applications" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="block w-full text-left px-4 py-2 rounded hover:bg-indigo-600 transition"
            >
              {item.label}
            </button>
          ))}
          <button className="block w-full text-left px-4 py-2 rounded bg-indigo-600 font-semibold">
            Profile
          </button>
        </nav>
        <div className="p-4 border-t border-gray-600">
          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto">

          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-500 mt-1">Your professional information</p>
            </div>
            {!editing ? (
              <button
                onClick={() => { setEditing(true); setError(""); setSuccess(""); }}
                className="px-5 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => { setEditing(false); setForm(profile); setError(""); }}
                  className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition font-medium disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {success && (
            <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Avatar + name card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-900 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 font-medium mb-1 block">First name</label>
                    <input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Last name</label>
                    <input
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Contact */}
          <Section title="Contact">
            <Field
              label="Email"
              value={profile.email}
              editValue={form.email}
              name="email"
              editing={false}
              onChange={handleChange}
              disabled
            />
            <Field
              label="Phone"
              value={profile.phone || "—"}
              editValue={form.phone}
              name="phone"
              editing={editing}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </Section>

          {/* Skills */}
          <Section title="Skills">
            {editing ? (
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">
                  Comma-separated list
                </label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Python, SQL…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            ) : skillsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillsList.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-indigo-50 text-indigo-800 text-sm rounded-full font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No skills added yet.</p>
            )}
          </Section>

          {/* Experience */}
          <Section title="Experience">
            {editing ? (
              <textarea
                name="experience"
                value={form.experience}
                onChange={handleChange}
                rows={4}
                placeholder="e.g. 2 years at Infosys as a backend developer…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            ) : (
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {profile.experience || <span className="text-gray-400">No experience added yet.</span>}
              </p>
            )}
          </Section>

          {/* Education */}
          <Section title="Education">
            {editing ? (
              <textarea
                name="education"
                value={form.education}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. B.Tech in Computer Science, NIT Calicut, 2022…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            ) : (
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {profile.education || <span className="text-gray-400">No education added yet.</span>}
              </p>
            )}
          </Section>

        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label, value, editValue, name, editing, onChange, placeholder = "", disabled = false,
}: {
  label: string; value: string; editValue: string; name: string;
  editing: boolean; onChange: (e: any) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="text-xs text-gray-500 font-medium mb-1 block">{label}</label>
      {editing && !disabled ? (
        <input
          name={name}
          value={editValue}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      ) : (
        <p className="text-gray-700 text-sm">{value}</p>
      )}
    </div>
  );
}