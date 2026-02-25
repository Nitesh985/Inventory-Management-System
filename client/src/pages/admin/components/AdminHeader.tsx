import React from 'react'
import { LogOut, Menu, Loader2 } from 'lucide-react'
import { signOut, useSession } from '@/lib/auth-client'

interface AdminHeaderProps {
  onMenuToggle: () => void
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  const { data: session } = useSession()
  const [signingOut, setSigningOut] = React.useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } catch (e) {
      console.error(e)
    } finally {
      window.location.href = '/sign-in'
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-auto h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Spacer for desktop (sidebar pushes content) */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Admin user info */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{session?.user?.name || 'Admin'}</p>
            <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {signingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
          <span className="hidden sm:inline">{signingOut ? 'Signing out...' : 'Exit'}</span>
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
