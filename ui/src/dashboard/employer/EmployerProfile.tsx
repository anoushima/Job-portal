import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("access")}` };
}

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education",
  "Retail", "Manufacturing", "Other",
];

const SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

export default function EmployerProfile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState<any>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    company: {
      name: "",
      industry: "",
      company_size: "",
      location: "",
      website: "",
      description: "",
    },
  });

  const [form, setForm] = useState<any>({ ...profile });

  useEffect(() => {
    axios
      .get(`${API}/profile/employer/`, { headers: authHeaders() })
      .then((r) => {
        setProfile(r.data);
        setForm(r.data);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleUserChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e: any) => {
    setForm({ ...form, company: { ...form.company, [e.target.name]: e.target.value } });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await axios.put(`${API}/profile/employer/`, form, {
        headers: authHeaders(),
      });
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
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() ||
    profile.company?.name?.[0]?.toUpperCase() || "E";

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
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-gray-600">JobPortal</div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: "Dashboard", path: "/employer-dashboard" },
            { label: "Post Job", path: "/create-job" },
            { label: "Manage Applications", path: "/employer/applications" },
            { label: "My Job Listings", path: "/employer/jobs" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              {item.label}
            </button>
          ))}
          <button className="block w-full text-left px-4 py-2 rounded bg-gray-600 font-semibold">
            Profile
          </button>
        </nav>
        <div className="p-4 border-t border-gray-600">
          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Company Profile</h1>
              <p className="text-gray-500 mt-1">Manage your employer information</p>
            </div>
            {!editing ? (
              <button
                onClick={() => { setEditing(true); setError(""); setSuccess(""); }}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition font-medium"
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
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition font-medium disabled:opacity-60"
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

          {/* Company hero card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              {editing ? (
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Company name</label>
                  <input
                    name="name"
                    value={form.company?.name}
                    onChange={handleCompanyChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800">{profile.company?.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {profile.company?.industry} {profile.company?.company_size ? `· ${profile.company.company_size} employees` : ""}
                  </p>
                  <p className="text-gray-400 text-sm">{profile.company?.location}</p>
                </>
              )}
            </div>
          </div>

          {/* Account info */}
          <Section title="Account">
            <div className="grid grid-cols-2 gap-4">
              <EField label="First name" name="first_name" value={profile.first_name || "—"}
                editValue={form.first_name} editing={editing} onChange={handleUserChange} />
              <EField label="Last name" name="last_name" value={profile.last_name || "—"}
                editValue={form.last_name} editing={editing} onChange={handleUserChange} />
            </div>
            <EField label="Email" name="email" value={profile.email}
              editValue={form.email} editing={false} onChange={handleUserChange} />
            <EField label="Phone" name="phone" value={profile.phone || "—"}
              editValue={form.phone} editing={editing} onChange={handleUserChange}
              placeholder="+91 98765 43210" />
          </Section>

          {/* Company details */}
          <Section title="Company details">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Industry</label>
                {editing ? (
                  <select
                    name="industry"
                    value={form.company?.industry}
                    onChange={handleCompanyChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i.toLowerCase()}>{i}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-700 text-sm capitalize">{profile.company?.industry || "—"}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Company size</label>
                {editing ? (
                  <select
                    name="company_size"
                    value={form.company?.company_size}
                    onChange={handleCompanyChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                  >
                    <option value="">Select size</option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s} employees</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-700 text-sm">
                    {profile.company?.company_size ? `${profile.company.company_size} employees` : "—"}
                  </p>
                )}
              </div>
            </div>
            <EField label="Location" name="location" value={profile.company?.location || "—"}
              editValue={form.company?.location} editing={editing} onChange={handleCompanyChange}
              placeholder="Kozhikode, Kerala" />
            <EField label="Website" name="website" value={profile.company?.website || "—"}
              editValue={form.company?.website} editing={editing} onChange={handleCompanyChange}
              placeholder="https://yourcompany.com" />
          </Section>

          {/* Description */}
          <Section title="About the company">
            {editing ? (
              <textarea
                name="description"
                value={form.company?.description}
                onChange={handleCompanyChange}
                rows={4}
                placeholder="Tell candidates what your company does, your mission, culture…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              />
            ) : (
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {profile.company?.description || <span className="text-gray-400">No description added yet.</span>}
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

function EField({
  label, name, value, editValue, editing, onChange, placeholder = "",
}: {
  label: string; name: string; value: string; editValue: string;
  editing: boolean; onChange: (e: any) => void; placeholder?: string;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="text-xs text-gray-500 font-medium mb-1 block">{label}</label>
      {editing ? (
        <input
          name={name}
          value={editValue ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      ) : (
        <p className="text-gray-700 text-sm">{value}</p>
      )}
    </div>
  );
}