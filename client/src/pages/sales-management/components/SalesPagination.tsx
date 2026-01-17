import Button from '@/components/ui/Button'
import Icon from '@/components/AppIcon'

interface Props {
  page: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

const SalesPagination = ({ page, total, pageSize, onChange }: Props) => {
  const totalPages = Math.ceil(total / pageSize)
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  if (totalPages <= 1) return null

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = page - 1; i <= page + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startItem}</span> to{' '}
        <span className="font-medium text-foreground">{endItem}</span> of{' '}
        <span className="font-medium text-foreground">{total}</span> results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="h-9 px-3"
        >
          <Icon name="ChevronLeft" size={16} className="mr-1" />
          Previous
        </Button>

        {/* Page numbers - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1 mx-2">
          {getPageNumbers().map((pageNum, idx) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onChange(pageNum as number)}
                className={`
                  h-9 min-w-[36px] px-3 rounded-md text-sm font-medium transition-colors
                  ${page === pageNum 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-foreground'
                  }
                `}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        {/* Page indicator for mobile */}
        <div className="flex sm:hidden items-center px-3">
          <span className="text-sm font-medium">
            {page} / {totalPages}
          </span>
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="h-9 px-3"
        >
          Next
          <Icon name="ChevronRight" size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}

export default SalesPagination
