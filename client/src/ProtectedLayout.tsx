import { Outlet } from 'react-router-dom'
import Protected from '@/components/Protected'


function ProtectedLayout() {
  return (
    <Protected>
      <Outlet />
    </Protected>
  )
}

export default ProtectedLayout