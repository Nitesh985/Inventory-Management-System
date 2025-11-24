import React, { useState, useEffect, useMemo } from 'react';

import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ProductFormModal from './components/ProductFormModal';
import ProductTable from './components/ProductTable';
import FilterToolbar from './components/FilterToolbar';
import LowStockAlert from './components/LowStockAlert';
import BulkImportModal from './components/BulkImportModal';
import InventoryStats from './components/InventoryStats';

const InventoryManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    priceRange: ''
  });
  const [syncStatus, setSyncStatus] = useState('online');

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      sku: "IPH15PRO001",
      category: "electronics",
      description: "Latest iPhone model with Pro features and titanium design",
      currentStock: 25,
      minStock: 5,
      maxStock: 100,
      unitPrice: 999.00,
      costPrice: 750.00,
      supplier: "supplier1",
      location: "warehouse-a",
      lastUpdated: "2025-11-01T10:30:00Z"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      sku: "SGS24001",
      category: "electronics",
      description: "Premium Android smartphone with advanced camera system",
      currentStock: 3,
      minStock: 5,
      maxStock: 50,
      unitPrice: 899.00,
      costPrice: 650.00,
      supplier: "supplier1",
      location: "warehouse-a",
      lastUpdated: "2025-10-30T14:15:00Z"
    },
    {
      id: 3,
      name: "MacBook Air M3",
      sku: "MBA-M3-001",
      category: "electronics",
      description: "Latest MacBook Air with M3 chip and improved performance",
      currentStock: 8,
      minStock: 2,
      maxStock: 20,
      unitPrice: 1299.00,
      costPrice: 950.00,
      supplier: "supplier4",
      location: "warehouse-b",
      lastUpdated: "2025-10-28T09:45:00Z"
    },
    {
      id: 4,
      name: "Wireless Earbuds Pro",
      sku: "WEB001",
      category: "electronics",
      description: "Bluetooth wireless earbuds with active noise cancellation",
      currentStock: 0,
      minStock: 10,
      maxStock: 200,
      unitPrice: 79.99,
      costPrice: 45.00,
      supplier: "supplier1",
      location: "store-front",
      lastUpdated: "2025-10-25T16:20:00Z"
    },
    {
      id: 5,
      name: "Gaming Mechanical Keyboard",
      sku: "GMK001",
      category: "electronics",
      description: "RGB mechanical keyboard with blue switches for gaming",
      currentStock: 15,
      minStock: 8,
      maxStock: 50,
      unitPrice: 129.99,
      costPrice: 85.00,
      supplier: "supplier4",
      location: "warehouse-a",
      lastUpdated: "2025-10-29T11:30:00Z"
    },
    {
      id: 6,
      name: "Organic Cotton T-Shirt",
      sku: "OCT001",
      category: "clothing",
      description: "100% organic cotton t-shirt in various colors and sizes",
      currentStock: 45,
      minStock: 20,
      maxStock: 200,
      unitPrice: 24.99,
      costPrice: 12.00,
      supplier: "supplier2",
      location: "store-front",
      lastUpdated: "2025-11-02T08:15:00Z"
    },
    {
      id: 7,
      name: "Premium Coffee Beans",
      sku: "PCB001",
      category: "food",
      description: "Single-origin arabica coffee beans, medium roast",
      currentStock: 2,
      minStock: 15,
      maxStock: 100,
      unitPrice: 18.99,
      costPrice: 9.50,
      supplier: "supplier3",
      location: "storage-room",
      lastUpdated: "2025-10-31T13:45:00Z"
    },
    {
      id: 8,
      name: "Yoga Mat Premium",
      sku: "YMP001",
      category: "sports",
      description: "Non-slip yoga mat with alignment guides and carrying strap",
      currentStock: 22,
      minStock: 10,
      maxStock: 80,
      unitPrice: 49.99,
      costPrice: 25.00,
      supplier: "supplier5",
      location: "display-area",
      lastUpdated: "2025-10-27T15:30:00Z"
    },
    {
      id: 9,
      name: "Skincare Serum Set",
      sku: "SSS001",
      category: "health",
      description: "Anti-aging serum set with vitamin C and hyaluronic acid",
      currentStock: 12,
      minStock: 8,
      maxStock: 60,
      unitPrice: 89.99,
      costPrice: 45.00,
      supplier: "supplier5",
      location: "store-front",
      lastUpdated: "2025-11-01T12:00:00Z"
    },
    {
      id: 10,
      name: "Smart Home Hub",
      sku: "SHH001",
      category: "electronics",
      description: "Voice-controlled smart home hub with WiFi connectivity",
      currentStock: 6,
      minStock: 5,
      maxStock: 30,
      unitPrice: 149.99,
      costPrice: 95.00,
      supplier: "supplier4",
      location: "warehouse-b",
      lastUpdated: "2025-10-26T10:15:00Z"
    }
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      // Category filter
      if (filters?.category && product?.category !== filters?.category) {
        return false;
      }

      // Stock status filter
      if (filters?.stockStatus) {
        const stockStatus = getProductStockStatus(product);
        if (filters?.stockStatus !== stockStatus) {
          return false;
        }
      }

      // Price range filter
      if (filters?.priceRange) {
        const price = product?.unitPrice;
        switch (filters?.priceRange) {
          case '0-10':
            if (price > 10) return false;
            break;
          case '10-50':
            if (price <= 10 || price > 50) return false;
            break;
          case '50-100':
            if (price <= 50 || price > 100) return false;
            break;
          case '100-500':
            if (price <= 100 || price > 500) return false;
            break;
          case '500+':
            if (price <= 500) return false;
            break;
        }
      }

      return true;
    });
  }, [products, filters]);

  // Get low stock products
  const lowStockProducts = useMemo(() => {
    return products?.filter(product => 
      product?.currentStock === 0 || 
      (product?.minStock && product?.currentStock <= product?.minStock)
    );
  }, [products]);

  const getProductStockStatus = (product) => {
    if (product?.currentStock === 0) return 'out-of-stock';
    if (product?.minStock && product?.currentStock <= product?.minStock) return 'low-stock';
    return 'in-stock';
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setProducts(prev => prev?.filter(p => p?.id !== productId));
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev?.map(p => 
        p?.id === editingProduct?.id ? { ...productData, id: editingProduct?.id } : p
      ));
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Date.now(), // Simple ID generation for demo
        lastUpdated: new Date()?.toISOString()
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleQuickStockUpdate = (productId, newStock) => {
    setProducts(prev => prev?.map(p => 
      p?.id === productId 
        ? { ...p, currentStock: newStock, lastUpdated: new Date()?.toISOString() }
        : p
    ));
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      stockStatus: '',
      priceRange: ''
    });
  };

  const handleBulkImport = () => {
    setShowBulkImportModal(true);
  };

  const handleBulkExport = () => {
    // Create CSV content
    const headers = ['Product Name', 'SKU', 'Category', 'Current Stock', 'Min Stock', 'Max Stock', 'Unit Price', 'Cost Price', 'Description'];
    const csvContent = [
      headers?.join(','),
      ...filteredProducts?.map(product => [
        `"${product?.name}"`,
        product?.sku,
        product?.category,
        product?.currentStock,
        product?.minStock || '',
        product?.maxStock || '',
        product?.unitPrice,
        product?.costPrice || '',
        `"${product?.description || ''}"`
      ]?.join(','))
    ]?.join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_export_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    window.URL?.revokeObjectURL(url);
  };

  const handleImportComplete = (results) => {
    // In a real app, this would refresh the products from the server
    console.log('Import completed:', results);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        syncStatus={syncStatus}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        syncStatus={syncStatus}
      />
      <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage your product catalog, track stock levels, and monitor inventory performance
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBulkImport}
                iconName="Upload"
                iconPosition="left"
              >
                Import Products
              </Button>
              
              <Button
                variant="default"
                onClick={handleAddProduct}
                iconName="Plus"
                iconPosition="left"
              >
                Add Product
              </Button>
            </div>
          </div>

          {/* Inventory Statistics */}
          <InventoryStats products={products} />

          {/* Low Stock Alert */}
          <LowStockAlert
            lowStockProducts={lowStockProducts}
            onViewProduct={handleEditProduct}
            onDismiss={() => {/* Handle dismiss */}}
          />

          {/* Filter Toolbar */}
          <FilterToolbar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onBulkImport={handleBulkImport}
            onBulkExport={handleBulkExport}
            totalProducts={products?.length}
            filteredCount={filteredProducts?.length}
          />

          {/* Products Table */}
          <div className="mt-6">
            <ProductTable
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onQuickStockUpdate={handleQuickStockUpdate}
            />
          </div>
        </div>
      </main>
      {/* Modals */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onImport={handleImportComplete}
      />
    </div>
  );
};

export default InventoryManagement;