
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
import ManageApplications from "./dashboard/employer/ManageApplications"
import TrackApplications from "./dashboard/jobseeker/TrackApplications"
import LandingPage from "./dashboard/landing_page/Landing_page"
import ReviewApplications from "./dashboard/employer/ReviewApplications"
import JobSeekerInfo from "./dashboard/landing_page/JobSeekerInfo"
import EmployerInfo from "./dashboard/landing_page/EmployerInfo"


function App(){
  return (


    <>

     <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register-jobseeker" element={<JobSeekerRegister />} />
        <Route path="/register-employer" element={<EmployerRegister />} />
        <Route path="/jobseeker-dashboard" element={<ProtectedRoute allowedRole="jobseeker"><JobSeekerDashboard/></ProtectedRoute>}></Route>
        <Route path="/employer-dashboard" element={<ProtectedRoute allowedRole="employer"><EmployerDashboard/></ProtectedRoute>}></Route>
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard/></ProtectedRoute>}></Route>
        <Route path="/create-job" element={<ProtectedRoute allowedRole="employer"><CreateJob/></ProtectedRoute>}></Route>
        <Route path="/jobs" element={<ProtectedRoute allowedRole="jobseeker"><JobsList/></ProtectedRoute>}></Route>
        <Route path="/jobs/:id" element={<JobDetails />} />
        {/* <Route path="/employer/applications" element={<ProtectedRoute allowedRole="employer"><ManageApplications/></ProtectedRoute>}/> */}
        <Route path="/my-applications"element={<ProtectedRoute allowedRole="jobseeker"><TrackApplications /></ProtectedRoute>}/>

        <Route path="/employer/applications" element={<ProtectedRoute allowedRole="employer"><ReviewApplications /></ProtectedRoute>}/>
        <Route path="/jobseeker-info" element={<JobSeekerInfo />} />
        <Route path="/employer-info" element={<EmployerInfo />} />


      </Routes>
    </BrowserRouter>
    </>
   
  )
}
  


export default App