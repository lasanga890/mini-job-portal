import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CandidateDashboard from './pages/candidate/CandidateDashboard.jsx'
import CandidateHome from './pages/candidate/pages/CandidateHome.jsx'
import CandidateApplications from './pages/candidate/pages/CandidateApplications.jsx'
import CandidateProfile from './pages/candidate/pages/CandidateProfile.jsx'
import JobDetails from './pages/candidate/pages/JobDetails.jsx'
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx'
import EmployerHome from './pages/employer/pages/EmployerHome.jsx'
import JobPost from './pages/employer/pages/JobPost.jsx'
import MyJobs from './pages/employer/pages/MyJobs.jsx'
import EmployerProfile from './pages/employer/pages/EmployerProfile.jsx'
import EmployerApplications from './pages/employer/pages/EmployerApplications.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

import ProtectedRoute from './routes/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/candidate/*"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<CandidateHome />} />
          <Route path="applications" element={<CandidateApplications />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="job/:jobId" element={<JobDetails />} />
        </Route>
        <Route
          path="/employer/*"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<EmployerHome />} />
          <Route path="post-job" element={<JobPost />} />
          <Route path="edit-job/:jobId" element={<JobPost />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="profile" element={<EmployerProfile />} />
          <Route path="applications" element={<EmployerApplications />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
