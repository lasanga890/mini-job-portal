import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CandidateDashboard from './pages/CandidateDashboard.jsx'
import EmployerDashboard from './pages/EmployerDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
