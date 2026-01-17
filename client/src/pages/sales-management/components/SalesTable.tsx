import { useState, useMemo } from 'react'
import Icon from '@/components/AppIcon'
import Button from '@/components/ui/Button'
import * as LucideIcons from 'lucide-react'

interface Sale {
  _id: string
  invoiceNo: string
  customerName: string
  items: {
    productId: string
    name: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  totalAmount: number
  paidAmount: number
  paymentMethod: string
  status: string
  createdAt: string
}

interface Props {
  sales: Sale[]
  loading?: boolean
  onViewSale: (sale: Sale) => void
  onRefresh?: () => void
}

interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

const SalesTable = ({ sales, loading = false, onViewSale, onRefresh }: Props) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' })

  const handleSort = (key: string): void => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIcon = (columnKey: string): keyof typeof LucideIcons => {
    if (sortConfig?.key !== columnKey) {
      return 'ArrowUpDown'
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'
  }

  const sortedSales = useMemo(() => {
    if (!sortConfig?.key) return sales

    return [...sales].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Sale]
      let bValue: any = b[sortConfig.key as keyof Sale]

      // Handle special cases
      if (sortConfig.key === 'items') {
        aValue = a.items?.length || 0
        bValue = b.items?.length || 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [sales, sortConfig])
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: keyof typeof LucideIcons }> = {
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', icon: 'CheckCircle' },
      PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'Clock' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', icon: 'XCircle' },
      REFUNDED: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'RotateCcw' }
    }
    const config = statusConfig[status] || statusConfig.COMPLETED
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon name={config.icon} size={12} />
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    )
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig: Record<string, { bg: string; text: string; icon: keyof typeof LucideIcons }> = {
      CASH: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'Banknote' },
      CREDIT: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'Book' },
      ESEWA: { bg: 'bg-green-50', text: 'text-green-700', icon: 'Smartphone' },
      KHALTI: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'Wallet' }
    }
    const config = methodConfig[method] || methodConfig.CASH

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon name={config.icon} size={12} />
        {method}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg animate-pulse">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-4 bg-muted rounded w-32 flex-1"></div>
            <div className="h-4 bg-muted rounded w-16"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-8 w-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (!sales.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Receipt" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No sales found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
          There are no sales matching your current filters. Try adjusting your search criteria or create a new sale.
        </p>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th 
              className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('createdAt')}
            >
              <div className="flex items-center space-x-2">
                <span>Date</span>
                <Icon name={getSortIcon('createdAt')} size={14} className="text-muted-foreground" />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('invoiceNo')}
            >
              <div className="flex items-center space-x-2">
                <span>Invoice</span>
                <Icon name={getSortIcon('invoiceNo')} size={14} className="text-muted-foreground" />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('customerName')}
            >
              <div className="flex items-center space-x-2">
                <span>Customer</span>
                <Icon name={getSortIcon('customerName')} size={14} className="text-muted-foreground" />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('items')}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Items</span>
                <Icon name={getSortIcon('items')} size={14} className="text-muted-foreground" />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('paymentMethod')}
            >
              <div className="flex items-center space-x-2">
                <span>Payment</span>
                <Icon name={getSortIcon('paymentMethod')} size={14} className="text-muted-foreground" />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('totalAmount')}
            >
              <div className="flex items-center justify-end space-x-2">
                <span>Amount</span>
                <Icon name={getSortIcon('totalAmount')} size={14} className="text-muted-foreground" />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Status</span>
                <Icon name={getSortIcon('status')} size={14} className="text-muted-foreground" />
              </div>
            </th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {sortedSales.map(sale => (
            <tr
              key={sale._id}
              className="hover:bg-muted/40 transition-colors group"
            >
              <td className="py-4 px-4">
                <span className="font-medium text-foreground">
                  {formatDate(sale.createdAt)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="font-mono font-medium text-foreground bg-muted/50 px-2 py-1 rounded">
                  {sale.invoiceNo}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="font-medium text-foreground">
                  {sale.customerName}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {sale.items?.length || 0}
                </span>
              </td>
              <td className="py-4 px-4">
                {getPaymentMethodBadge(sale.paymentMethod)}
              </td>
              <td className="py-4 px-4 text-right">
                <span className="font-semibold text-foreground">
                  ₹ {Math.round(sale.totalAmount || 0).toLocaleString()}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                {getStatusBadge(sale.status)}
              </td>
              <td className="py-4 px-4 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewSale(sale)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="Eye" size={16} className="mr-1" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SalesTable
