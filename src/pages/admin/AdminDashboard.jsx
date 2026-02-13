import { Outlet } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'

function AdminDashboard() {

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