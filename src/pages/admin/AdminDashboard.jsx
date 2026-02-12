import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const isJobsPage = location.pathname === '/admin/jobs' || location.pathname === '/admin';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary-bg">
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard