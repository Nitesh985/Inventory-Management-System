import React, { useState, useCallback } from 'react';
import { useFetch } from '@/hooks/useFetch';
import Icon from '@/components/AppIcon';
import Loader from '@/components/Loader';
import { getCustomerCreditHistory } from '@/api/credits';

interface HistoryItem {
  _id: string;
  type: 'CREDIT' | 'PAYMENT';
  date: string;
  amount: number;
  description: string;
  invoiceNo?: string;
  items?: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  paymentMethod?: string;
  note?: string;
  runningBalance?: number;
}

interface CreditHistoryData {
  customer: {
    _id: string;
    name: string;
    phone?: string;
  };
  summary: {
    totalCredit: number;
    totalPaid: number;
    currentBalance: number;
  };
  history: HistoryItem[];
}

interface CreditHistoryProps {
  customerId?: string;
  refreshKey?: number;
}

const CreditHistory: React.FC<CreditHistoryProps> = ({ customerId, refreshKey }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const fetchHistory = useCallback(() => {
    if (!customerId) return Promise.resolve(null);
    return getCustomerCreditHistory(customerId);
  }, [customerId]);

  const { data, loading } = useFetch<CreditHistoryData>(fetchHistory, [customerId, refreshKey]);

  const formatCurrency = (amount: number) => `Rs. ${Math.round(amount || 0).toLocaleString('en-NP')}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NP', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-NP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!customerId) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm p-8 text-center">
        <Icon name="History" size={48} className="mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">Select a customer to view credit history</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="History" size={20} className="text-primary" />
            Credit History
          </h2>
          {data?.history && (
            <span className="text-xs text-muted-foreground">
              {data.history.length} transactions
            </span>
          )}
        </div>

        {/* Summary Cards */}
        {data?.summary && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Credit</p>
              <p className="text-sm font-bold text-red-600">{formatCurrency(data.summary.totalCredit)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
              <p className="text-sm font-bold text-green-600">{formatCurrency(data.summary.totalPaid)}</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${
              data.summary.currentBalance > 0 
                ? 'bg-orange-50 dark:bg-orange-900/20' 
                : 'bg-blue-50 dark:bg-blue-900/20'
            }`}>
              <p className="text-xs text-muted-foreground mb-1">Balance Due</p>
              <p className={`text-sm font-bold ${
                data.summary.currentBalance > 0 ? 'text-orange-600' : 'text-blue-600'
              }`}>
                {formatCurrency(Math.abs(data.summary.currentBalance))}
                {data.summary.currentBalance < 0 && <span className="text-xs ml-1">(Advance)</span>}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* History List */}
      <Loader loading={loading}>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {data?.history && data.history.length > 0 ? (
            <div className="divide-y divide-border">
              {data.history.map((item) => (
                <div key={item._id} className="hover:bg-muted/30 transition-colors">
                  {/* Main Row */}
                  <div 
                    className={`p-4 flex items-center gap-3 ${item.items && item.items.length > 0 ? 'cursor-pointer' : ''}`}
                    onClick={() => item.items && item.items.length > 0 && toggleExpand(item._id)}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === 'CREDIT' 
                        ? 'bg-red-100 dark:bg-red-900/30' 
                        : 'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      <Icon 
                        name={item.type === 'CREDIT' ? 'ShoppingCart' : 'Banknote'} 
                        size={18} 
                        className={item.type === 'CREDIT' ? 'text-red-600' : 'text-green-600'} 
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.description}
                        </p>
                        {item.items && item.items.length > 0 && (
                          <Icon 
                            name={expandedItems.has(item._id) ? 'ChevronUp' : 'ChevronDown'} 
                            size={14} 
                            className="text-muted-foreground flex-shrink-0" 
                          />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.date)} • {formatTime(item.date)}
                        {item.paymentMethod && ` • ${item.paymentMethod}`}
                      </p>
                      {item.note && (
                        <p className="text-xs text-muted-foreground italic mt-1">"{item.note}"</p>
                      )}
                    </div>

                    {/* Amount & Balance */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${
                        item.type === 'CREDIT' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.type === 'CREDIT' ? '+' : '-'}{formatCurrency(item.amount)}
                      </p>
                      {item.runningBalance !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          Bal: {formatCurrency(item.runningBalance)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expanded Items (for Credit Sales) */}
                  {expandedItems.has(item._id) && item.items && item.items.length > 0 && (
                    <div className="px-4 pb-4 ml-14">
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Items</p>
                        {item.items.map((product, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {product.productName} 
                              <span className="text-muted-foreground ml-1">
                                × {product.quantity}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              {formatCurrency(product.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Icon name="FileText" size={32} className="mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground text-sm">No credit history found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Credit sales and payments will appear here
              </p>
            </div>
          )}
        </div>
      </Loader>
    </div>
  );
};

export default CreditHistory;