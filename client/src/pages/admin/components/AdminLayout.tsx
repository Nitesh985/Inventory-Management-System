import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSession } from '@/lib/auth-client'
import { useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout: React.FC = () => {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (isPending) return
    if (!session) {
      navigate('/admin/sign-in', { replace: true })
      return
    }
    if ((session.user as any)?.role !== 'admin') {
      navigate('/business-dashboard', { replace: true })
    }
  }, [session, isPending, navigate])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <AdminHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main
        className={`pt-20 pb-20 lg:pb-8 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="px-4 sm:px-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
