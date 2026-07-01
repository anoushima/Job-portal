import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminDashboard";
import NotificationBell from "../../components/NotificationBell";
import { getAdminUsers,toggleUserActive } from "../../services/adminService";
import { Users, Search, ShieldCheck, ShieldOff, Mail, Phone, ClipboardList, AlertCircle } from "lucide-react";

export default function AdminUsers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      if (err?.response?.status === 403) setError("You don't have permission to view this page.");
      else setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try {
      const result = await toggleUserActive(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_active: result.is_active } : u)));
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = users.filter((u) =>
    !search ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">Manage jobseeker accounts — {users.length} total.</p>
          </div>
          <NotificationBell />
        </header>

        <div className="flex-1 p-8 space-y-6">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-semibold">Jobseeker</th>
                  <th className="text-left px-6 py-3 font-semibold">Contact</th>
                  <th className="text-left px-6 py-3 font-semibold">Applications</th>
                  <th className="text-left px-6 py-3 font-semibold">Joined</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-right px-6 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-40" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-10" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      <Users size={32} className="mx-auto mb-3 text-gray-200" />
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                            {u.full_name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-gray-900">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center gap-1.5"><Mail size={12} />{u.email}</div>
                        {u.phone && <div className="flex items-center gap-1.5 mt-0.5"><Phone size={12} />{u.phone}</div>}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="inline-flex items-center gap-1.5">
                          <ClipboardList size={13} className="text-gray-400" /> {u.applications_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(u.date_joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          u.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                        }`}>
                          {u.is_active ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggle(u.id)}
                          disabled={togglingId === u.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50 ${
                            u.is_active
                              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                              : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                          }`}
                        >
                          {u.is_active ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                          {togglingId === u.id ? "Updating…" : u.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
