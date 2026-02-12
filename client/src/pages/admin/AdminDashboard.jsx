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
          {/* Sidebar Navigation */}
          <div className="w-64 bg-card-bg/40 backdrop-blur-xl border-r border-white/10 min-h-screen pt-24">
            <nav className="p-6 space-y-2">
              <button
                onClick={() => navigate('/admin/jobs')}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                  isJobsPage
                    ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20'
                    : 'text-text-dim hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  All Jobs
                </div>
              </button>
            </nav>
          </div>

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