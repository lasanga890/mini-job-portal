import { Outlet } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'

function EmployerDashboard() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default EmployerDashboard