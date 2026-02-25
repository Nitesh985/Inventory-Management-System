import React, { useEffect, useState, useCallback } from 'react'
import { Search, Trash2, Loader2, Store as StoreIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { getShops, deleteShop, type AdminShop } from '@/api/admin'

const ShopsSection: React.FC = () => {
  const [shops, setShops] = useState<AdminShop[]>([])
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
      const res = await getShops(page, 20, search)
      setShops(res.data.shops)
      setTotalPages(res.data.totalPages)
      setTotal(res.data.total)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load shops')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { load() }, [load])

  const handleSearch = () => { setPage(1); load() }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete shop "${name}" and all its associated data?`)) return
    setActionLoading(id)
    try {
      await deleteShop(id)
      setShops(prev => prev.filter(s => s._id !== id))
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
          <h1 className="text-2xl font-bold text-slate-800">Shops</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} registered shops</p>
        </div>

        <div className="flex gap-2 max-w-md w-full sm:w-auto">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search shop, owner or type..."
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
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Shop</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Owner</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Created</th>
                <th className="text-right px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                    <td className="px-5 py-4 hidden sm:table-cell"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-4 bg-slate-100 rounded w-28" /></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-10 ml-auto" /></td>
                  </tr>
                ))
              ) : shops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-slate-400">No shops found.</td>
                </tr>
              ) : (
                shops.map(shop => (
                  <tr key={shop._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <StoreIcon size={16} className="text-emerald-600" />
                        </div>
                        <span className="font-semibold text-slate-800 truncate max-w-[160px]">{shop.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {shop.businessType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="font-medium text-slate-700 text-xs">{shop.ownerName}</p>
                      <p className="text-xs text-slate-400">{shop.ownerEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">
                      {[shop.city, shop.district].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">{fmt(shop.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(shop._id, shop.name)}
                          disabled={actionLoading === shop._id}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Delete shop"
                        >
                          {actionLoading === shop._id
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 transition-colors">
                <ChevronLeft size={14} />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopsSection
