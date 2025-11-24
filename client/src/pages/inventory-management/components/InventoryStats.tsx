import React from 'react';
import Icon from '../../../components/AppIcon';

const InventoryStats = ({ products }) => {
  const calculateStats = () => {
    const totalProducts = products?.length;
    const totalValue = products?.reduce((sum, product) => sum + (product?.currentStock * product?.unitPrice), 0);
    const lowStockCount = products?.filter(product => 
      product?.minStock && product?.currentStock <= product?.minStock
    )?.length;
    const outOfStockCount = products?.filter(product => product?.currentStock === 0)?.length;
    const categoriesCount = new Set(products.map(product => product.category))?.size;

    return {
      totalProducts,
      totalValue,
      lowStockCount,
      outOfStockCount,
      categoriesCount
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toLocaleString(),
      icon: 'Package',
      color: 'text-primary bg-primary/10',
      description: `${stats?.categoriesCount} categories`
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(stats?.totalValue),
      icon: 'DollarSign',
      color: 'text-success bg-success/10',
      description: 'Total stock value'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockCount?.toString(),
      icon: 'AlertTriangle',
      color: stats?.lowStockCount > 0 ? 'text-warning bg-warning/10' : 'text-muted-foreground bg-muted/10',
      description: 'Need restocking'
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStockCount?.toString(),
      icon: 'XCircle',
      color: stats?.outOfStockCount > 0 ? 'text-error bg-error/10' : 'text-muted-foreground bg-muted/10',
      description: 'Unavailable items'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4 hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{stat?.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat?.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat?.description}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat?.color} flex items-center justify-center flex-shrink-0`}>
              <Icon name={stat?.icon} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;