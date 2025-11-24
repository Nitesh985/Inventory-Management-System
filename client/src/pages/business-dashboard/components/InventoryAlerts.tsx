import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryAlerts = () => {
  const alerts = [
    {
      id: "ALERT001",
      type: "low_stock",
      product: "Wireless Headphones",
      sku: "WH-001",
      currentStock: 3,
      minStock: 10,
      category: "Electronics",
      priority: "high",
      lastUpdated: "2025-11-03"
    },
    {
      id: "ALERT002",
      type: "out_of_stock",
      product: "USB Cables",
      sku: "USB-C-001",
      currentStock: 0,
      minStock: 25,
      category: "Accessories",
      priority: "critical",
      lastUpdated: "2025-11-02"
    },
    {
      id: "ALERT003",
      type: "low_stock",
      product: "Phone Cases",
      sku: "PC-iPhone-001",
      currentStock: 5,
      minStock: 15,
      category: "Accessories",
      priority: "medium",
      lastUpdated: "2025-11-03"
    },
    {
      id: "ALERT004",
      type: "expiring_soon",
      product: "Screen Protectors",
      sku: "SP-001",
      currentStock: 20,
      expiryDate: "2025-11-15",
      category: "Accessories",
      priority: "medium",
      lastUpdated: "2025-11-01"
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-error/10 text-error border-error/20',
      high: 'bg-warning/10 text-warning border-warning/20',
      medium: 'bg-accent/10 text-accent border-accent/20',
      low: 'bg-muted text-muted-foreground border-border'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getAlertIcon = (type) => {
    const icons = {
      low_stock: 'AlertTriangle',
      out_of_stock: 'XCircle',
      expiring_soon: 'Clock',
      overstocked: 'TrendingUp'
    };
    return icons?.[type] || 'AlertCircle';
  };

  const getAlertMessage = (alert) => {
    switch (alert?.type) {
      case 'low_stock':
        return `Only ${alert?.currentStock} units left (Min: ${alert?.minStock})`;
      case 'out_of_stock':
        return `Out of stock - Reorder needed`;
      case 'expiring_soon':
        return `Expires on ${new Date(alert.expiryDate)?.toLocaleDateString('en-US')}`;
      default:
        return 'Attention required';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-foreground">Inventory Alerts</h2>
          <span className="px-2 py-1 bg-error/10 text-error text-xs font-medium rounded-full">
            {alerts?.length}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/inventory-management'}
        >
          Manage Inventory
        </Button>
      </div>
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
      {alerts?.length === 0 && (
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