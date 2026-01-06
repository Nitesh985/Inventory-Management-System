import React from 'react';
import Icon from '../../../components/AppIcon';

interface Product {
  id?: string | number;
  currentStock?: number;
  minStock?: number;
  unitPrice?: number;
  category?: string;
}

interface InventoryStatsProps {
  products: Product[];
}

interface Stats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoriesCount: number;
}

const InventoryStats: React.FC<InventoryStatsProps> = ({ products }) => {  
    const calculateStats = (): Stats => {
      // SAFETY: if products is not a valid array, return zeros
      if (!Array.isArray(products) || products.length === 0) {
        return {
          totalProducts: 0,
          totalValue: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
          categoriesCount: 0
        };
      }
  
      const totalProducts = products.length || 0;
  
      const totalValue = products.reduce((sum, product) => {
        const stock = product?.currentStock ?? 0;
        const price = product?.unitPrice ?? 0;
        return sum + stock * price;
      }, 0);
  
      const lowStockCount = products.filter(product =>
        product &&
        product.minStock != null &&
        product.currentStock <= product.minStock
      ).length;
  
      const outOfStockCount = products.filter(product =>
        product?.currentStock === 0
      ).length;
  
      const categoriesCount = new Set(
        products
          .map(product => product?.category)
          .filter(Boolean) // remove null/undefined
      ).size;
  
      return {
        totalProducts,
        totalValue,
        lowStockCount,
        outOfStockCount,
        categoriesCount
      };
    };
  
    const stats = calculateStats();
  
    const formatCurrency = (amount: number): string => {
      const safeAmount = Number(amount) || 0;
      return `Rs. ${safeAmount.toLocaleString('ne-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };
  
  //   const statCards = [
  //     {
  //       title: 'Total Products',
  //       value: stats.totalProducts?.toLocaleString() ?? "0",
  //       icon: 'Package',
  //       color: 'text-primary bg-primary/10',
  //       description: `${stats.categoriesCount ?? 0} categories`
  //     },
  //     {
  //       title: 'Inventory Value',
  //       value: formatCurrency(stats.totalValue),
  //       icon: 'DollarSign',
  //       color: 'text-success bg-success/10',
  //       description: 'Total stock value'
  //     },
  //     {
  //       title: 'Low Stock Items',
  //       value: stats.lowStockCount?.toString() ?? "0",
  //       icon: 'AlertTriangle',
  //       color:
  //         stats.lowStockCount > 0
  //           ? 'text-warning bg-warning/10'
  //           : 'text-muted-foreground bg-muted/10',
  //       description: 'Need restocking'
  //     },
  //     {
  //       title: 'Out of Stock',
  //       value: stats.outOfStockCount?.toString() ?? "0",
  //       icon: 'XCircle',
  //       color:
  //         stats.outOfStockCount > 0
  //           ? 'text-error bg-error/10'
  //           : 'text-muted-foreground bg-muted/10',
  //       description: 'Unavailable items'
  //     }
  //   ];
  
  //   return null; // or your UI rendering for cards
  // };


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