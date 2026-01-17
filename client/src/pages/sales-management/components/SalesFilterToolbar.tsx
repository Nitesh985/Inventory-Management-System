import Icon from '@/components/AppIcon'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface SalesFilters {
  search: string
  paymentMethod: string
  startDate: string
  endDate: string
  status: string
}

interface Props {
  filters: SalesFilters
  onFilterChange: (filters: Partial<SalesFilters>) => void
  onClearFilters: () => void
  totalSales: number
  filteredCount: number
}

const SalesFilterToolbar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  totalSales,
  filteredCount
}: Props) => {
  const hasActiveFilters = 
    filters.search || 
    filters.paymentMethod || 
    filters.startDate || 
    filters.endDate ||
    filters.status

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px] max-w-xs">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Search
          </label>
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Invoice, customer..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Payment Method Filter */}
        <div className="min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Payment
          </label>
          <Select
            value={filters.paymentMethod}
            onChange={(value) => onFilterChange({ paymentMethod: value as string })}
            placeholder="All methods"
            clearable
            options={[
              { label: 'Cash', value: 'CASH' },
              { label: 'Card', value: 'CARD' },
              { label: 'UPI', value: 'UPI' },
              { label: 'Bank Transfer', value: 'BANK' },
              { label: 'Credit', value: 'CREDIT' }
            ]}
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Status
          </label>
          <Select
            value={filters.status}
            onChange={(value) => onFilterChange({ status: value as string })}
            placeholder="All status"
            clearable
            options={[
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Cancelled', value: 'CANCELLED' },
              { label: 'Refunded', value: 'REFUNDED' }
            ]}
          />
        </div>

        {/* Date Range */}
        <div className="min-w-[130px]">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            From Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        <div className="min-w-[130px]">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            To Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-10 text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={14} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          {hasActiveFilters ? (
            <span>
              Showing <span className="font-medium text-foreground">{filteredCount}</span> of{' '}
              <span className="font-medium text-foreground">{totalSales}</span> sales
            </span>
          ) : (
            <span>
              <span className="font-medium text-foreground">{totalSales}</span> total sales
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalesFilterToolbar
