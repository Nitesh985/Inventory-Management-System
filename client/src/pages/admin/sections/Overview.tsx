import React, { useEffect, useState } from 'react'
import { Users, Store, MessageSquare, Star, TrendingUp, ArrowUpRight } from 'lucide-react'
import { getAdminStats, type AdminStats } from '@/api/admin'
import { Link } from 'react-router-dom'

const Overview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await getAdminStats()
      setStats(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      link: '/admin/users',
    },
    {
      label: 'Total Shops',
      value: stats?.totalShops ?? 0,
      icon: Store,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      link: '/admin/shops',
    },
    {
      label: 'Total Reviews',
      value: stats?.totalReviews ?? 0,
      icon: MessageSquare,
      color: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      link: '/admin/reviews',
    },
    {
      label: 'Average Rating',
      value: stats?.avgRating ? `${stats.avgRating} / 5` : '—',
      icon: Star,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      link: '/admin/reviews',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Platform overview at a glance</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon size={20} className={card.text} />
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-slate-100 rounded w-20 mb-1 animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              )}
              <p className="text-xs text-slate-500 font-medium mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-slate-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Manage Users', desc: 'View, edit roles, or remove users', link: '/admin/users', icon: Users, color: 'text-blue-600 bg-blue-50' },
            { label: 'Manage Shops', desc: 'Browse and moderate all shops', link: '/admin/shops', icon: Store, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Manage Reviews', desc: 'Moderate user reviews', link: '/admin/reviews', icon: Star, color: 'text-violet-600 bg-violet-50' },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.link}
              className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                <action.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{action.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Overview
