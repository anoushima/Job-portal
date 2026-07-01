import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminDashboard";
import NotificationBell from "../../components/NotificationBell";
import { ShieldCheck, Mail, KeyRound, Database, Server } from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem("email") || "—";
  const role = localStorage.getItem("role") || "admin";

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar navigate={navigate} currentPath={location.pathname} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Your admin account and platform info.</p>
          </div>
          <NotificationBell />
        </header>

        <div className="flex-1 p-8">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <Mail size={13} className="text-gray-400" /> {email}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{role} access</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-500">
                <KeyRound size={14} className="text-gray-400" />
                Password changes aren't available from this panel yet — contact your platform administrator.
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Platform</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><Server size={13} /> Environment</span>
                  <span className="text-gray-900 font-medium">Django REST + React</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><Database size={13} /> Data source</span>
                  <span className="text-gray-900 font-medium">Live database</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
