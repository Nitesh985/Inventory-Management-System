import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import Header from '@/components/ui/Header'
import Sidebar from '@/components/ui/Sidebar'
import Icon from '@/components/AppIcon'
import Button from '@/components/ui/Button'
import SalesStats from './components/SalesStats'
import SalesFilterToolbar from './components/SalesFilterToolbar'
import SalesTable from './components/SalesTable'
import SalesPagination from './components/SalesPagination'
import SaleDetailsModal from './components/SaleDetailsModal'
import { getAllSales } from '@/api/sales'
import { useNavigate } from 'react-router-dom'

const PAGE_SIZE = 10

// Backend sale structure
interface BackendSale {
  _id: string
  invoiceNo: string
  customerId?: string
  customerName?: string
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
  updatedAt: string
}

// Frontend sale structure
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

interface SalesFilters {
  search: string
  paymentMethod: string
  startDate: string
  endDate: string
  status: string
}

const SalesManagementPage = () => {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [filters, setFilters] = useState<SalesFilters>({
    search: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    status: ''
  })

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    setLoading(true)
    try {
      const data = await getAllSales()
      const transformedSales: Sale[] = (data || []).map((sale: BackendSale) => ({
        _id: sale._id,
        invoiceNo: sale.invoiceNo || `INV-${sale._id.slice(-6).toUpperCase()}`,
        customerName: sale.customerName || 'Walk-in Customer',
        items: sale.items || [],
        totalAmount: sale.totalAmount || 0,
        paidAmount: sale.paidAmount || 0,
        paymentMethod: sale.paymentMethod || 'CASH',
        status: sale.status || 'COMPLETED',
        createdAt: sale.createdAt
      }))
      setSales(transformedSales)
    } catch (error) {
      console.error('Error fetching sales:', error)
      setSales([])
    } finally {
      setLoading(false)
    }
  }

  // Filter sales based on current filters
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          sale.invoiceNo?.toLowerCase().includes(searchLower) ||
          sale.customerName?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Payment method filter
      if (filters.paymentMethod && sale.paymentMethod !== filters.paymentMethod) {
        return false
      }

      // Status filter
      if (filters.status && sale.status !== filters.status) {
        return false
      }

      // Date range filter
      if (filters.startDate) {
        const saleDate = new Date(sale.createdAt)
        const startDate = new Date(filters.startDate)
        if (saleDate < startDate) return false
      }

      if (filters.endDate) {
        const saleDate = new Date(sale.createdAt)
        const endDate = new Date(filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        if (saleDate > endDate) return false
      }

      return true
    })
  }, [sales, filters])

  // Paginate filtered sales
  const start = (page - 1) * PAGE_SIZE
  const paginatedSales = filteredSales.slice(start, start + PAGE_SIZE)

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [filters])

  const handleFilterChange = (newFilters: Partial<SalesFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      status: ''
    })
  }

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale)
  }

  const handleCloseSaleModal = () => {
    setSelectedSale(null)
  }

  const handleNewSale = () => {
    navigate('/sales-recording')
  }

  const handleExport = () => {
    // Export functionality placeholder
    console.log('Exporting sales data...')
  }

  return (
    <>
      <Helmet>
        <title>Sales Management - Digital Khata</title>
        <meta 
          name="description" 
          content="View and manage all your completed sales transactions. Track revenue, analyze sales trends, and export reports." 
        />
          <link rel="icon" type="image/jpeg" href="/src/assets/logo.jpeg" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          syncStatus="online"
        />
        
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          syncStatus="online"
        />

        <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        }`}>
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="Receipt" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Sales Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      View and manage all completed sales transactions
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    iconName="Download"
                    iconPosition="left"
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={handleNewSale}
                  >
                    New Sale
                  </Button>
                </div>
              </div>
            </div>

            {/* Sales Statistics */}
            <SalesStats sales={filteredSales} loading={loading} />

            {/* Main Content Card */}
            <div className="bg-card rounded-xl border border-border shadow-card mt-6">
              {/* Filter Toolbar */}
              <div className="p-4 border-b border-border">
                <SalesFilterToolbar 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  totalSales={sales.length}
                  filteredCount={filteredSales.length}
                />
              </div>

              {/* Sales Table */}
              <div className="p-4">
                <SalesTable
                  sales={paginatedSales}
                  loading={loading}
                  onViewSale={handleViewSale}
                  onRefresh={fetchSales}
                />
              </div>

              {/* Pagination */}
              <div className="px-4 pb-4">
                <SalesPagination
                  page={page}
                  total={filteredSales.length}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={handleCloseSaleModal}
        />
      )}
    </>
  )
}

export default SalesManagementPage
