import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./authentication/login"
import JobSeekerRegister from "./authentication/JobseekerRegister"
import EmployerRegister from "./authentication/EmployerRegister"
import JobSeekerDashboard from "./dashboard/jobseeker/JobSeekerDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import EmployerDashboard from "./dashboard/employer/EmployerDashboard"
import AdminDashboard from "./dashboard/admin/AdminDashboard"
import CreateJob from "./dashboard/employer/Createjob"
import JobsList from "./dashboard/jobseeker/JobsList"
import JobDetails from "./dashboard/jobseeker/JobDetails"
import TrackApplications from "./dashboard/jobseeker/TrackApplications"
import LandingPage from "./dashboard/landing_page/Landing_page"
import ReviewApplications from "./dashboard/employer/ReviewApplications"
import JobSeekerInfo from "./dashboard/landing_page/JobSeekerInfo"
import EmployerInfo from "./dashboard/landing_page/EmployerInfo"
import JobseekerProfile from "./dashboard/jobseeker/JobseekerProfile"
import EmployerProfile from "./dashboard/employer/EmployerProfile"
import PublicJobs from "./dashboard/landing_page/PublicJobs"
import AdminUsers from "./dashboard/admin/AdminUsers"
import AdminEmployers from "./dashboard/admin/AdminEmployers"
import AdminJobs from "./dashboard/admin/AdminJobs"
import AdminApplications from "./dashboard/admin/AdminApplications"
import AdminReports from "./dashboard/admin/AdminReports"
import AdminSettings from "./dashboard/admin/AdminSettings"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<JobSeekerRegister />} />
        <Route path="/register-jobseeker" element={<JobSeekerRegister />} />
        <Route path="/register-employer" element={<EmployerRegister />} />
        <Route path="/jobseeker-info" element={<JobSeekerInfo />} />
        <Route path="/employer-info" element={<EmployerInfo />} />

        {/* Public jobs browse — no login needed to view, login needed to apply */}
        <Route path="/public-jobs" element={<PublicJobs />} />

        {/* Protected routes */}
        <Route path="/jobseeker-dashboard" element={<ProtectedRoute allowedRole="jobseeker"><JobSeekerDashboard /></ProtectedRoute>} />
        <Route path="/employer-dashboard" element={<ProtectedRoute allowedRole="employer"><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/employers" element={<ProtectedRoute allowedRole="admin"><AdminEmployers /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute allowedRole="admin"><AdminJobs /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute allowedRole="admin"><AdminApplications /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />
        <Route path="/create-job" element={<ProtectedRoute allowedRole="employer"><CreateJob /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute allowedRole="jobseeker"><JobsList /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/my-applications" element={<ProtectedRoute allowedRole="jobseeker"><TrackApplications /></ProtectedRoute>} />
        <Route path="/employer/applications" element={<ProtectedRoute allowedRole="employer"><ReviewApplications /></ProtectedRoute>} />
        <Route path="/profile/jobseeker" element={<ProtectedRoute allowedRole="jobseeker"><JobseekerProfile /></ProtectedRoute>} />
        <Route path="/profile/employer" element={<ProtectedRoute allowedRole="employer"><EmployerProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App