import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactions = () => {
  const [activeTab, setActiveTab] = useState('all');

  const transactions = [
    {
      id: "TXN001",
      type: "sale",
      description: "Product Sale - Electronics",
      customer: "John Smith",
      amount: 1250.00,
      date: "2025-11-03",
      time: "10:30 AM",
      status: "completed",
      category: "Electronics"
    },
    {
      id: "TXN002",
      type: "expense",
      description: "Office Supplies Purchase",
      vendor: "Office Depot",
      amount: -85.50,
      date: "2025-11-03",
      time: "09:15 AM",
      status: "completed",
      category: "Office Supplies"
    },
    {
      id: "TXN003",
      type: "sale",
      description: "Service - Consultation",
      customer: "Sarah Johnson",
      amount: 500.00,
      date: "2025-11-02",
      time: "02:45 PM",
      status: "completed",
      category: "Services"
    },
    {
      id: "TXN004",
      type: "expense",
      description: "Utility Bill - Electricity",
      vendor: "Power Company",
      amount: -120.00,
      date: "2025-11-02",
      time: "11:20 AM",
      status: "pending",
      category: "Utilities"
    },
    {
      id: "TXN005",
      type: "sale",
      description: "Product Sale - Clothing",
      customer: "Mike Wilson",
      amount: 75.00,
      date: "2025-11-01",
      time: "04:10 PM",
      status: "completed",
      category: "Clothing"
    }
  ];

  const filteredTransactions = transactions?.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction?.type === activeTab;
  });

  const getTransactionIcon = (type) => {
    return type === 'sale' ? 'ArrowUpRight' : 'ArrowDownLeft';
  };

  const getTransactionColor = (type) => {
    return type === 'sale' ? 'text-success' : 'text-error';
  };

  const getStatusBadge = (status) => {
    const colors = {
      completed: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      failed: 'bg-error/10 text-error'
    };
    return colors?.[status] || colors?.completed;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/sales-recording'}
        >
          View All
        </Button>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {[
          { key: 'all', label: 'All' },
          { key: 'sale', label: 'Sales' },
          { key: 'expense', label: 'Expenses' }
        ]?.map((tab) => (
          <button
            key={tab?.key}
            onClick={() => setActiveTab(tab?.key)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === tab?.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab?.label}
          </button>
        ))}
      </div>
      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions?.map((transaction) => (
          <div
            key={transaction?.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${getTransactionColor(transaction?.type)}`}>
                <Icon name={getTransactionIcon(transaction?.type)} size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">
                    {transaction?.description}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(transaction?.status)}`}>
                    {transaction?.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{transaction?.customer || transaction?.vendor}</span>
                  <span>{transaction?.date} at {transaction?.time}</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs">
                    {transaction?.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-lg font-semibold ${getTransactionColor(transaction?.type)}`}>
                ${Math.abs(transaction?.amount)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground">
                {transaction?.id}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredTransactions?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground mb-4">
            {activeTab === 'all' ?'Start by recording your first sale or expense'
              : `No ${activeTab}s recorded yet`
            }
          </p>
          <Button
            variant="default"
            onClick={() => window.location.href = activeTab === 'expense' ? '/expense-tracking' : '/sales-recording'}
          >
            {activeTab === 'expense' ? 'Add Expense' : 'Record Sale'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;