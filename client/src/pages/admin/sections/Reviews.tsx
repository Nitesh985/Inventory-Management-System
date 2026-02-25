import React, { useEffect, useState, useCallback } from 'react'
import { Star, Trash2, Loader2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { getReviews, deleteReview, type AdminReview } from '@/api/admin'

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getReviews(page, 20)
      setReviews(res.data.reviews)
      setTotalPages(res.data.totalPages)
      setTotal(res.data.total)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    setActionLoading(id)
    try {
      await deleteReview(id)
      setReviews(prev => prev.filter(r => r._id !== id))
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reviews</h1>
        <p className="text-sm text-slate-500 mt-0.5">{total} total reviews</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-100 rounded w-28" />
                  <div className="h-3 bg-slate-100 rounded w-44" />
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded w-full mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
            <MessageSquare size={40} className="mx-auto mb-3 text-slate-200" />
            <p className="text-slate-400 font-medium">No reviews yet</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {review.userImage ? (
                    <img src={review.userImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">{review.userName?.charAt(0)?.toUpperCase()}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{review.userName}</p>
                    <p className="text-xs text-slate-400 truncate">{review.userEmail}</p>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={actionLoading === review._id}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40 flex-shrink-0"
                  title="Delete review"
                >
                  {actionLoading === review._id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Trash2 size={15} />}
                </button>
              </div>

              {/* Shop badge */}
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {review.shopName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                  {review.businessType || 'General'}
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < review.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                  />
                ))}
                <span className="text-xs text-slate-400 ml-2">{fmt(review.createdAt)}</span>
              </div>

              {/* Content */}
              <p className="text-sm text-slate-700 mt-3 leading-relaxed">"{review.content}"</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
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
  )
}

export default ReviewsSection
