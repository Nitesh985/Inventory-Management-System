import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

interface Product {
  id: string | number;
  name?: string;
  currentStock: number;
  minStock?: number;
}

interface LowStockAlertProps {
  lowStockProducts: Product[];
  onViewProduct: (product: Product) => void;
  onDismiss: () => void;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ lowStockProducts, onViewProduct, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [dismissedItems, setDismissedItems] = useState<Set<string | number>>(new Set());

  if (!lowStockProducts || lowStockProducts?.length === 0) {
    return null;
  }

  const visibleProducts = lowStockProducts?.filter(product => !dismissedItems?.has(product?.id));

  if (visibleProducts?.length === 0) {
    return null;
  }

  const handleDismissItem = (productId: string | number): void => {
    setDismissedItems(prev => new Set([...prev, productId]));
  };

  const handleDismissAll = (): void => {
    onDismiss();
  };

  const formatStockStatus = (current: number, min: number): { text: string; color: string } => {
    if (current === 0) return { text: 'Out of Stock', color: 'text-error bg-error/10' };
    if (current <= min) return { text: 'Low Stock', color: 'text-warning bg-warning/10' };
    return { text: 'In Stock', color: 'text-success bg-success/10' };
  };

  return (
    <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={18} className="text-warning" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground">
              Stock Alert: {visibleProducts?.length} product{visibleProducts?.length !== 1 ? 's' : ''} need attention
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {visibleProducts?.filter(p => p?.currentStock === 0)?.length > 0 && 
                `${visibleProducts?.filter(p => p?.currentStock === 0)?.length} out of stock, `}
              {visibleProducts?.filter(p => p?.currentStock > 0 && p?.currentStock <= (p?.minStock || 0))?.length > 0 && 
                `${visibleProducts?.filter(p => p?.currentStock > 0 && p?.currentStock <= (p?.minStock || 0))?.length} low stock`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Hide' : 'View'} Details
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismissAll}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3">
            {visibleProducts?.slice(0, 5)?.map((product) => {
              const stockStatus = formatStockStatus(product?.currentStock, product?.minStock);
              
              return (
                <div
                  key={product?.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {product?.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono">
                        SKU: {product?.sku}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${stockStatus?.color}`}>
                          {product?.currentStock} units
                        </div>
                        {product?.minStock && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Min: {product?.minStock}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewProduct(product)}
                    >
                      Update Stock
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDismissItem(product?.id)}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleProducts?.length > 5 && (
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {/* Handle view all */}}
              >
                View all {visibleProducts?.length} products
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;