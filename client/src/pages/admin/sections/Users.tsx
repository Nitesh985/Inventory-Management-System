import React, { useEffect, useState, useCallback } from 'react'
import { Search, Trash2, Loader2, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  getUsers,
  deleteUser,
  type AdminUser,
} from '@/api/admin'

const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getUsers(page, 20, search)
      setUsers(res.data.users)
      setTotalPages(res.data.totalPages)
      setTotal(res.data.total)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { load() }, [load])

  const handleSearch = () => { setPage(1); load() }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This removes their shops & reviews too.`)) return
    setActionLoading(id)
    try {
      await deleteUser(id)
      setUsers(prev => prev.filter(u => u._id !== id))
      setTotal(prev => prev - 1)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete')
    } finally {
      setActionLoading(null)
    }
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} registered users</p>
        </div>

        {/* Search */}
        <div className="flex gap-2 max-w-md w-full sm:w-auto">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search name or email..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Email</th>
                <th className="text-center px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">Shop</th>
                <th className="text-center px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Verified</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Joined</th>
                <th className="text-right px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-28" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-4 bg-slate-100 rounded w-36" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-14 mx-auto" /></td>
                    <td className="px-5 py-4 hidden sm:table-cell"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 bg-slate-100 rounded w-8 mx-auto" /></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-slate-400">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-600">{user.name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                        )}
                        <span className="font-semibold text-slate-800 truncate max-w-[140px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 hidden md:table-cell truncate max-w-[200px]">{user.email}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden sm:table-cell">
                      {user.shopNames.length > 0
                        ? <>
                            {user.shopNames[0]}
                            {user.shopNames.length > 1 && (
                              <span className="text-slate-400 ml-1">+{user.shopNames.length - 1}</span>
                            )}
                          </>
                        : <span className="text-slate-300">No shop</span>}
                    </td>
                    <td className="px-5 py-4 text-center hidden lg:table-cell">
                      {user.emailVerified
                        ? <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                        : <XCircle size={16} className="text-slate-300 mx-auto" />}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">{fmt(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          disabled={actionLoading === user._id}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Delete user"
                        >
                          {actionLoading === user._id
                            ? <Loader2 size={15} className="animate-spin" />
                            : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersSection
