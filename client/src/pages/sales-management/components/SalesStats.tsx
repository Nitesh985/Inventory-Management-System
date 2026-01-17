import Icon from '@/components/AppIcon'
import * as LucideIcons from 'lucide-react'

interface Sale {
  _id: string
  totalAmount: number
  paidAmount: number
  paymentMethod: string
  status: string
  createdAt: string
}

interface Props {
  sales: Sale[]
  loading?: boolean
}

const SalesStats = ({ sales, loading = false }: Props) => {
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0)
  const totalPaid = sales.reduce((sum, sale) => sum + (sale.paidAmount || 0), 0)
  const pendingAmount = totalRevenue - totalPaid

  // Calculate today's sales
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt)
    saleDate.setHours(0, 0, 0, 0)
    return saleDate.getTime() === today.getTime()
  })
  const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0)

  const stats: {
    label: string
    value: string
    subtext: string
    icon: keyof typeof LucideIcons
    iconBg: string
    iconColor: string
  }[] = [
    { 
      label: 'Total Sales', 
      value: sales.length.toLocaleString(),
      subtext: `${todaySales.length} today`,
      icon: 'ShoppingCart',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Total Revenue', 
      value: `₹ ${totalRevenue.toLocaleString()}`,
      subtext: `₹ ${todayRevenue.toLocaleString()} today`,
      icon: 'IndianRupee',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      label: 'Pending Amount', 
      value: `₹ ${pendingAmount.toLocaleString()}`,
      subtext: pendingAmount > 0 ? 'To be collected' : 'All clear!',
      icon: 'Clock',
      iconBg: pendingAmount > 0 ? 'bg-amber-100' : 'bg-green-100',
      iconColor: pendingAmount > 0 ? 'text-amber-600' : 'text-green-600'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat.subtext}
              </p>
            </div>
            <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
              <Icon name={stat.icon} size={20} className={stat.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SalesStats
