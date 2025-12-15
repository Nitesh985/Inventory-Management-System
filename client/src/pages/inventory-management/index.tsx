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
import { useFetch } from '@/hooks/useFetch';
import { getProducts } from '@/api/products';

const InventoryManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const { data: products = [], loading, error } = useFetch(getProducts); 
  
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    priceRange: ''
  });
  
  const [syncStatus, setSyncStatus] = useState('online');
  
  
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
  
    return products.filter(product => {
      if (!product) return false;
  
      if (filters.category && product?.category !== filters.category) return false;
  
      if (filters.stockStatus) {
        const stockStatus = getProductStockStatus(product);
        if (filters.stockStatus !== stockStatus) return false;
      }
  
      if (filters.priceRange) {
        const price = product?.unitPrice ?? 0;
  
        switch (filters.priceRange) {
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
  
  
  const lowStockProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
  
    return products.filter(product => {
      if (!product) return false;
      return (
        product.currentStock === 0 ||
        (product.minStock != null && product.currentStock <= product.minStock)
      );
    });
  }, [products]);
  
  
  const getProductStockStatus = (product) => {
    if (!product) return 'unknown';
    if (product.currentStock === 0) return 'out-of-stock';
    if (product.minStock != null && product.currentStock <= product.minStock) return 'low-stock';
    return 'in-stock';
  };
  
  

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };
  
  const handleEditProduct = (product) => {
    if (!product) return;
    setEditingProduct(product);
    setShowProductModal(true);
  };
  
  const handleDeleteProduct = (productId) => {
    if (!productId) return;
  
    if (window.confirm('Are you sure you want to delete this product?')) {
      if (Array.isArray(products)) {
        setProducts(prev => (Array.isArray(prev) ? prev.filter(p => p?.id !== productId) : []));
      }
    }
  };
  
  
  const handleSaveProduct = (productData) => {
    if (!productData) return;
  
    if (editingProduct) {
      setProducts(prev =>
        Array.isArray(prev)
          ? prev.map(p => (p?.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p))
          : []
      );
    } else {
      const newProduct = {
        ...productData,
        id: Date.now(),
        lastUpdated: new Date().toISOString()
      };
  
      setProducts(prev => (Array.isArray(prev) ? [...prev, newProduct] : [newProduct]));
    }
  
    setShowProductModal(false);
    setEditingProduct(null);
  };
  
  
  const handleQuickStockUpdate = (productId, newStock) => {
    if (!productId) return;
  
    setProducts(prev =>
      Array.isArray(prev)
        ? prev.map(p =>
            p?.id === productId
              ? { ...p, currentStock: newStock, lastUpdated: new Date().toISOString() }
              : p
          )
        : []
    );
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
    const safeProducts = Array.isArray(filteredProducts) ? filteredProducts : [];
  
    const headers = [
      'Product Name',
      'SKU',
      'Category',
      'Current Stock',
      'Min Stock',
      'Max Stock',
      'Unit Price',
      'Cost Price',
      'Description'
    ];
  
    const csvContent = [
      headers.join(','),
      ...safeProducts.map(product => [
        `"${product?.name ?? ''}"`,
        product?.sku ?? '',
        product?.category ?? '',
        product?.currentStock ?? '',
        product?.minStock ?? '',
        product?.maxStock ?? '',
        product?.unitPrice ?? '',
        product?.costPrice ?? '',
        `"${product?.description ?? ''}"`
      ].join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  
  const handleImportComplete = (results) => {
    console.log('Import completed:', results || []);
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