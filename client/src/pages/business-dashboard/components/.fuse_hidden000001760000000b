import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useFetch } from '@/hooks/useFetch';
import { getAllProducts } from '@/api/products';
import Loader from '@/components/Loader';

interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'overstocked';
  product: string;
  sku: string;
  currentStock: number;
  minStock?: number;
  expiryDate?: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastUpdated: string;
}

const InventoryAlerts = () => {
  const { data: productsData, loading } = useFetch(getAllProducts, []);
  
  const products = useMemo(() => {
    if (Array.isArray(productsData)) return productsData;
    if (Array.isArray(productsData?.data)) return productsData.data;
    return [];
  }, [productsData]);


  const alerts: Alert[] = useMemo(() => {
    if (!products || products?.length === 0) return [];
    
    return products
      .filter((product: any) => {
        const stock = product.stock ?? product.quantity ?? 0;
        const minStock = product.minStock ?? product.reorderLevel ?? 10;
        return stock <= minStock;
      })
      .map((product: any) => {
        const stock = product.stock ?? product.quantity ?? 0;
        const minStock = product.minStock ?? product.reorderLevel ?? 10;
        
        let type: Alert['type'] = 'low_stock';
        let priority: Alert['priority'] = 'medium';
        
        if (stock === 0) {
          type = 'out_of_stock';
          priority = 'critical';
        } else if (stock <= minStock * 0.3) {
          priority = 'high';
        }
        
        return {
          id: product._id || `alert-${Date.now()}`,
          type,
          product: product.name || 'Unknown Product',
          sku: product.sku || product._id?.slice(-6) || 'N/A',
          currentStock: stock,
          minStock,
          category: product.category || 'Uncategorized',
          priority,
          lastUpdated: product.updatedAt || product.createdAt || new Date().toISOString()
        };
      })
      .sort((a: Alert, b: Alert) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 5);
  }, [products]);

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      critical: 'bg-error/10 text-error border-error/20',
      high: 'bg-warning/10 text-warning border-warning/20',
      medium: 'bg-accent/10 text-accent border-accent/20',
      low: 'bg-muted text-muted-foreground border-border'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getAlertIcon = (type: string): string => {
    const icons: Record<string, string> = {
      low_stock: 'AlertTriangle',
      out_of_stock: 'XCircle',
      expiring_soon: 'Clock',
      overstocked: 'TrendingUp'
    };
    return icons?.[type] || 'AlertCircle';
  };

  const getAlertMessage = (alert: Alert): string => {
    switch (alert?.type) {
      case 'low_stock':
        return `Only ${alert?.currentStock} units left (Min: ${alert?.minStock})`;
      case 'out_of_stock':
        return `Out of stock - Reorder needed`;
      case 'expiring_soon':
        return `Expires on ${new Date(alert.expiryDate || '')?.toLocaleDateString('en-US')}`;
      default:
        return 'Attention required';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-foreground">Inventory Alerts</h2>
          {!loading && (
            <span className="px-2 py-1 bg-error/10 text-error text-xs font-medium rounded-full">
              {alerts?.length}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/inventory-management'}
        >
          Manage Inventory
        </Button>
      </div>
      <Loader loading={loading}>
      <div className="space-y-3">
        {alerts?.map((alert) => (
          <div
            key={alert?.id}
            className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-sm ${getPriorityColor(alert?.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Icon name={getAlertIcon(alert?.type)} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground">
                      {alert?.product}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      SKU: {alert?.sku}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-2">
                    {getAlertMessage(alert)}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-muted rounded">
                      {alert?.category}
                    </span>
                    <span>Updated: {new Date(alert.lastUpdated)?.toLocaleDateString('en-US')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(alert?.priority)}`}>
                  {alert?.priority}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = `/inventory-management?sku=${alert?.sku}`}
                >
                  <Icon name="ExternalLink" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </Loader>
      {alerts?.length === 0 && !loading && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">All Good!</h3>
          <p className="text-muted-foreground">
            No inventory alerts at the moment. Your stock levels are healthy.
          </p>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Last inventory sync: Today at 12:45 PM
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location?.reload()}
          >
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlerts;