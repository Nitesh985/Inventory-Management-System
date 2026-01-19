import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useFetch } from '@/hooks/useFetch';
import { getSales } from '@/api/sales';
import { getExpenses } from '@/api/expenses';
import Loader from '@/components/Loader';

interface Transaction {
  id: string;
  type: 'sale' | 'expense';
  description: string;
  customer?: string;
  vendor?: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  category: string;
}

const RecentTransactions = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { data: salesResponse, loading: salesLoading } = useFetch(getSales, []);
  const { data: expensesResponse, loading: expensesLoading } = useFetch(getExpenses, []);
  
  const salesData = useMemo(() => {
    if (Array.isArray(salesResponse)) return salesResponse;
    if (Array.isArray(salesResponse?.data)) return salesResponse.data;
    return [];
  }, [salesResponse]);
  
  const expensesData = useMemo(() => {
    if (Array.isArray(expensesResponse)) return expensesResponse;
    if (Array.isArray(expensesResponse?.data)) return expensesResponse.data;
    return [];
  }, [expensesResponse]);


  const transactions: Transaction[] = useMemo(() => {
    const salesTransactions: Transaction[] = (salesData || []).map((sale: any) => ({
      id: sale._id || `sale-${Date.now()}`,
      type: 'sale' as const,
      description: sale.description || `Sale - ${sale.items?.length || 0} items`,
      customer: sale.customerId?.name || sale.customerName || 'Walk-in Customer',
      amount: sale.totalAmount || 0,
      date: new Date(sale.createdAt || sale.date).toLocaleDateString(),
      time: new Date(sale.createdAt || sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: sale.status || 'completed',
      category: sale.category || 'Sales'
    }));

    const expenseTransactions: Transaction[] = (expensesData || [])?.map((expense: any) => ({
      id: expense._id || `exp-${Date.now()}`,
      type: 'expense' as const,
      description: expense.description || expense.name || 'Expense',
      vendor: expense.vendor || expense.category || 'Unknown',
      amount: -(expense.amount || 0),
      date: new Date(expense.createdAt || expense.date).toLocaleDateString(),
      time: new Date(expense.createdAt || expense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: expense.status || 'completed',
      category: expense.category || 'Expense'
    }));

    return [...salesTransactions, ...expenseTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [salesData, expensesData]);

  const filteredTransactions = transactions?.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction?.type === activeTab;
  });

  const getTransactionIcon = (type: string): string => {
    return type === 'sale' ? 'ArrowUpRight' : 'ArrowDownLeft';
  };

  const getTransactionColor = (type: string): string => {
    return type === 'sale' ? 'text-success' : 'text-error';
  };

  const getStatusBadge = (status: string): string => {
    const colors: Record<string, string> = {
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
      <Loader loading={salesLoading || expensesLoading}>
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
                Rs. {Math.round(Math.abs(transaction?.amount)).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {transaction?.id}
              </div>
            </div>
          </div>
        ))}
      </div>
      </Loader>
      {filteredTransactions?.length === 0 && !(salesLoading || expensesLoading) && (
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