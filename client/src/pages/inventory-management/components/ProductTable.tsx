import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductTable = ({ products, onEdit, onDelete, onQuickStockUpdate }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');

  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = products?.filter(product =>
      product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      product?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      product?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (typeof aValue === 'string') {
          aValue = aValue?.toLowerCase();
          bValue = bValue?.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [products, sortConfig, searchTerm]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStockStatus = (current, min) => {
    if (!min) return 'normal';
    if (current === 0) return 'out-of-stock';
    if (current <= min) return 'low-stock';
    return 'normal';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'out-of-stock': return 'text-error bg-error/10';
      case 'low-stock': return 'text-warning bg-warning/10';
      default: return 'text-success bg-success/10';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleStockEdit = (productId, currentStock) => {
    setEditingStock(productId);
    setStockValue(currentStock?.toString());
  };

  const handleStockSave = (productId) => {
    const newStock = parseInt(stockValue);
    if (!isNaN(newStock) && newStock >= 0) {
      onQuickStockUpdate(productId, newStock);
    }
    setEditingStock(null);
    setStockValue('');
  };

  const handleStockCancel = () => {
    setEditingStock(null);
    setStockValue('');
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {sortedAndFilteredProducts?.length} of {products?.length} products
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {[
                { key: 'name', label: 'Product Name' },
                { key: 'sku', label: 'SKU' },
                { key: 'category', label: 'Category' },
                { key: 'currentStock', label: 'Stock' },
                { key: 'unitPrice', label: 'Unit Price' },
                { key: 'lastUpdated', label: 'Last Updated' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column?.label}</span>
                    <Icon name={getSortIcon(column?.key)} size={14} className="text-muted-foreground" />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedAndFilteredProducts?.map((product) => {
              const stockStatus = getStockStatus(product?.currentStock, product?.minStock);
              return (
                <tr key={product?.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-foreground">{product?.name}</div>
                      {product?.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {product?.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-mono text-foreground">{product?.sku}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary">
                      {product?.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {editingStock === product?.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={stockValue}
                          onChange={(e) => setStockValue(e?.target?.value)}
                          className="w-20"
                          min="0"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStockSave(product?.id)}
                        >
                          <Icon name="Check" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleStockCancel}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStockStatusColor(stockStatus)}`}>
                          {product?.currentStock}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStockEdit(product?.id, product?.currentStock)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="Edit2" size={12} />
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">
                    {formatCurrency(product?.unitPrice)}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {formatDate(product?.lastUpdated)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Icon name="Edit2" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product?.id)}
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {sortedAndFilteredProducts?.map((product) => {
          const stockStatus = getStockStatus(product?.currentStock, product?.minStock);
          return (
            <div key={product?.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{product?.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{product?.sku}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Icon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product?.id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary">
                      {product?.category}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Stock:</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStockStatusColor(stockStatus)}`}>
                      {product?.currentStock}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <div className="mt-1 font-medium text-foreground">
                    {formatCurrency(product?.unitPrice)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated:</span>
                  <div className="mt-1 text-foreground">
                    {formatDate(product?.lastUpdated)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {sortedAndFilteredProducts?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first product.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;