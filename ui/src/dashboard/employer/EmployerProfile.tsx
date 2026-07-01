import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { EmployerSidebar } from "./EmployerDashboard";
import NotificationBell from "../../components/NotificationBell";
import { Building2, Mail, Phone, Globe, MapPin, Users, CheckCircle, AlertCircle } from "lucide-react";

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
  const location = useLocation();
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
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <EmployerSidebar navigate={navigate} currentPath={location.pathname} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading profile…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <EmployerSidebar navigate={navigate} currentPath={location.pathname} />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Company Profile</h1>
            <p className="text-sm text-gray-500">Manage your employer information.</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            {!editing ? (
              <button
                onClick={() => { setEditing(true); setError(""); setSuccess(""); }}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(false); setForm(profile); setError(""); }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {success && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                <CheckCircle size={16} /> {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Company hero card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1">
                {editing ? (
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Company name</label>
                    <input
                      name="name"
                      value={form.company?.name ?? ""}
                      onChange={handleCompanyChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900">{profile.company?.name}</h2>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                      <Building2 size={13} />
                      {profile.company?.industry || "—"}
                      {profile.company?.company_size ? ` · ${profile.company.company_size} employees` : ""}
                    </p>
                    <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
                      <MapPin size={13} /> {profile.company?.location || "—"}
                    </p>
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
              <EField label="Email" name="email" value={profile.email} icon={Mail}
                editValue={form.email} editing={false} onChange={handleUserChange} />
              <EField label="Phone" name="phone" value={profile.phone || "—"} icon={Phone}
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
                      value={form.company?.industry ?? ""}
                      onChange={handleCompanyChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 bg-white"
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
                  <label className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                    <Users size={12} /> Company size
                  </label>
                  {editing ? (
                    <select
                      name="company_size"
                      value={form.company?.company_size ?? ""}
                      onChange={handleCompanyChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 bg-white"
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
              <EField label="Location" name="location" value={profile.company?.location || "—"} icon={MapPin}
                editValue={form.company?.location} editing={editing} onChange={handleCompanyChange}
                placeholder="Kozhikode, Kerala" />
              <EField label="Website" name="website" value={profile.company?.website || "—"} icon={Globe}
                editValue={form.company?.website} editing={editing} onChange={handleCompanyChange}
                placeholder="https://yourcompany.com" />
            </Section>

            {/* Description */}
            <Section title="About the company">
              {editing ? (
                <textarea
                  name="description"
                  value={form.company?.description ?? ""}
                  onChange={handleCompanyChange}
                  rows={4}
                  placeholder="Tell candidates what your company does, your mission, culture…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
                />
              ) : (
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {profile.company?.description || <span className="text-gray-400">No description added yet.</span>}
                </p>
              )}
            </Section>

          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EField({
  label, name, value, editValue, editing, onChange, placeholder = "", icon: Icon,
}: {
  label: string; name: string; value: string; editValue: string;
  editing: boolean; onChange: (e: any) => void; placeholder?: string; icon?: any;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
        {Icon && <Icon size={12} />} {label}
      </label>
      {editing ? (
        <input
          name={name}
          value={editValue ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
        />
      ) : (
        <p className="text-gray-700 text-sm">{value}</p>
      )}
    </div>
  );
}
