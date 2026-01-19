import Button from '@/components/ui/Button'
import Icon from '@/components/AppIcon'
import * as LucideIcons from 'lucide-react'

interface SaleItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

interface Sale {
  _id: string
  invoiceNo: string
  customerName: string
  items: SaleItem[]
  totalAmount: number
  paidAmount: number
  paymentMethod: string
  status: string
  createdAt: string
}

interface Props {
  sale: Sale
  onClose: () => void
}

const SaleDetailsModal = ({ sale, onClose }: Props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
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

  const getStatusConfig = (status: string): { bg: string; text: string; icon: keyof typeof LucideIcons } => {
    const configs: Record<string, { bg: string; text: string; icon: keyof typeof LucideIcons }> = {
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', icon: 'CheckCircle' },
      PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'Clock' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', icon: 'XCircle' },
      REFUNDED: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'RotateCcw' }
    }
    return configs[status] || configs.COMPLETED
  }

  const getPaymentIcon = (method: string): keyof typeof LucideIcons => {
    const icons: Record<string, keyof typeof LucideIcons> = {
      CASH: 'Banknote',
      CREDIT: 'Book',
      ESEWA: 'Smartphone',
      KHALTI: 'Wallet'
    }
    return icons[method] || 'Banknote'
  }

  const statusConfig = getStatusConfig(sale.status)
  const subtotal = sale.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0
  const balance = sale.totalAmount - sale.paidAmount

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-5 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Icon name="Receipt" size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Invoice {sale.invoiceNo}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatDate(sale.createdAt)} at {formatTime(sale.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status and Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Icon name="User" size={14} />
                  <span>Customer</span>
                </div>
                <p className="font-semibold text-foreground">{sale.customerName}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Icon name="Tag" size={14} />
                  <span>Status</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                  <Icon name={statusConfig.icon} size={14} />
                  {sale.status.charAt(0) + sale.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="ShoppingBag" size={16} className="text-muted-foreground" />
                Items Purchased ({sale.items?.length || 0})
              </h3>
              <div className="bg-muted/20 rounded-xl overflow-hidden border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Item</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Qty</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Price</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sale.items?.map((item, index) => (
                      <tr key={item.productId || index} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-medium text-foreground">{item.name || 'Unknown Item'}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-muted px-2 py-1 rounded text-foreground">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          Rs. {Math.round(item.unitPrice || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-foreground">
                          Rs. {Math.round(item.total || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  Rs. {Math.round(sale.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-end">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button iconName="Printer" iconPosition="left">
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleDetailsModal
