import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

interface LineItem {
  id: number | string;
  total: number;
  quantity: number;
}

interface TransactionSummaryProps {
  lineItems: LineItem[];
  taxRate?: number;
  discountAmount?: number;
  onDiscountChange?: (discount: number) => void;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ 
  lineItems, 
  taxRate = 8.25, 
  discountAmount = 0,
  onDiscountChange 
}) => {
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [tempDiscount, setTempDiscount] = useState(discountAmount.toString());

  // Sync tempDiscount with discountAmount prop when not editing
  useEffect(() => {
    if (!isEditingDiscount) {
      setTempDiscount(discountAmount.toString());
    }
  }, [discountAmount, isEditingDiscount]);

  const subtotal = lineItems?.reduce((sum, item) => sum + item?.total, 0);
  const discountTotal = discountAmount;
  const taxableAmount = subtotal - discountTotal;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const handleDiscountEdit = () => {
    setTempDiscount(discountAmount.toString());
    setIsEditingDiscount(true);
  };

  const handleDiscountSave = () => {
    const newDiscount = parseFloat(tempDiscount) || 0;
    if (newDiscount >= 0 && newDiscount <= subtotal) {
      onDiscountChange?.(newDiscount);
    }
    setIsEditingDiscount(false);
  };

  const handleDiscountKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDiscountSave();
    } else if (e.key === 'Escape') {
      setIsEditingDiscount(false);
      setTempDiscount(discountAmount.toString());
    }
  };

  const summaryItems = [
    { label: 'Subtotal', value: subtotal, icon: 'Calculator' },
    { label: 'Discount', value: -discountTotal, icon: 'Percent', isDiscount: true },
    { label: `Tax (${taxRate}%)`, value: taxAmount, icon: 'Receipt' },
    { label: 'Total', value: grandTotal, icon: 'Wallet', isTotal: true }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-muted border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center space-x-2">
          <Icon name="FileText" size={18} />
          <span>Transaction Summary</span>
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {summaryItems?.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between py-2 ${
              item?.isTotal ? 'border-t border-border pt-3' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon 
                name={item?.icon} 
                size={16} 
                className={`${
                  item?.isTotal 
                    ? 'text-primary' 
                    : item?.isDiscount 
                    ? 'text-success' :'text-muted-foreground'
                }`} 
              />
              <span className={`${
                item?.isTotal 
                  ? 'font-semibold text-foreground' 
                  : 'text-muted-foreground'
              }`}>
                {item?.label}
              </span>
            </div>
            {item?.isDiscount && onDiscountChange ? (
              <div className="flex items-center gap-2">
                {isEditingDiscount ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Rs.</span>
                    <input
                      type="number"
                      value={tempDiscount}
                      onChange={(e) => setTempDiscount(e.target.value)}
                      onBlur={handleDiscountSave}
                      onKeyDown={handleDiscountKeyDown}
                      className="w-20 h-7 px-2 text-sm text-right font-medium text-success bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                      max={subtotal}
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleDiscountEdit}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-muted transition-colors group border border-transparent hover:border-border"
                    title="Click to edit discount"
                  >
                    <span className="font-medium text-success">
                      {item?.value !== 0 ? '-' : ''}<span className="text-xs">Rs.</span> {Math.round(Math.abs(item?.value)).toLocaleString()}
                    </span>
                    <Icon name="Pencil" size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                )}
              </div>
            ) : (
              <span className={`font-medium ${
                item?.isTotal 
                  ? 'text-lg text-primary' 
                  : item?.isDiscount 
                  ? 'text-success' :'text-foreground'
              }`}>
                {item?.isDiscount && item?.value !== 0 ? '-' : ''}<span className="text-xs">Rs.</span> {Math.round(Math.abs(item?.value)).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
      {lineItems?.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-primary">
              <Icon name="TrendingUp" size={16} />
              <span className="text-sm font-medium">
                {lineItems?.length} item{lineItems?.length !== 1 ? 's' : ''} • 
                Total Qty: {lineItems?.reduce((sum, item) => sum + item?.quantity, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
      {lineItems?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No items added to sale</p>
          <p className="text-sm text-muted-foreground mt-1">Add products to see transaction summary</p>
        </div>
      )}
    </div>
  );
};

export default TransactionSummary;