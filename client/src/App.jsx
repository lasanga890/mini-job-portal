import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CandidateDashboard from './pages/candidate/CandidateDashboard.jsx'
import CandidateHome from './pages/candidate/pages/CandidateHome.jsx'
import CandidateApplications from './pages/candidate/pages/CandidateApplications.jsx'
import CandidateProfile from './pages/candidate/pages/CandidateProfile.jsx'
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx'
import EmployerHome from './pages/employer/pages/EmployerHome.jsx'
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
          <Route path="post-job" />
          <Route path="my-jobs" />
          <Route path="profile" />
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
