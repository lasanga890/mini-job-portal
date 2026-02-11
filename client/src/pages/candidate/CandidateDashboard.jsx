import { Outlet } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'

function CandidateDashboard() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default CandidateDashboard