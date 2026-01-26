import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ExpenseForm from './components/ExpenseForm';
import ReceiptUpload from './components/ReceiptUpload';
import ExpenseHistory from './components/ExpenseHistory';
import BudgetOverview from './components/BudgetOverview';
import BulkImport from './components/BulkImport';
import Icon from '../../components/AppIcon';
import { useFetch } from '@/hooks/useFetch';
import { useMutation } from '@/hooks/useMutation';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/api/expenses';
import { getBudgets, upsertBudget, deleteBudget as deleteBudgetApi } from '@/api/budgets';
import { useAutoTour } from '@/hooks/useTour';
import '@/styles/tour.css';


const ExpenseTracking = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('record');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [budgetRefreshKey, setBudgetRefreshKey] = useState<number>(0);
  const [shouldStartTour, setShouldStartTour] = useState(false);

  // Initialize tour
  useAutoTour('expense-tracking', shouldStartTour);

  // Check if user should see the tour
  useEffect(() => {
    const hasSeenExpenseTour = localStorage.getItem('hasSeenExpenseTour');
    if (!hasSeenExpenseTour) {
      setShouldStartTour(true);
      localStorage.setItem('hasSeenExpenseTour', 'true');
    }
  }, []);

  interface Receipt {
    id: number;
    name: string;
    url: string;
    type: string;
  }

  // Backend expense structure
  interface BackendExpense {
    _id: string;
    shopId: string;
    description: string;
    amount: number;
    date: string;
    category: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
  }

  // Frontend expense structure
  interface Expense {
    id: string;
    amount: number;
    category: string;
    vendor: string;
    date: string;
    description: string;
    isTaxRelated: boolean;
    receipts: Receipt[];
  }

  // Fetch expenses from API
  const { data: expensesData, loading: isLoading, error } = useFetch(getExpenses, [refreshKey]);
  
  // Transform backend data to frontend format
  const expenses: Expense[] = React.useMemo(() => {
    const rawExpenses = expensesData || [];
    if (!Array.isArray(rawExpenses)) return [];
    
    return rawExpenses.map((exp: BackendExpense) => ({
      id: exp._id,
      amount: exp.amount ?? 0,
      category: exp.category || 'other',
      vendor: '', // Not tracked in backend
      date: exp.date ? new Date(exp.date).toISOString().split('T')[0] : '',
      description: exp.description || '',
      isTaxRelated: false, // Not tracked in backend
      receipts: [] // Not tracked in backend
    }));
  }, [expensesData]);
  
  // Currency formatter for Nepali Rupees
  const formatCurrency = (amount: number): string => {
    return `Rs. ${Math.round(amount || 0).toLocaleString('en-NP')}`;
  };
  
  const { mutate: createExpenseMutation, loading: creating } = useMutation(createExpense);
  const { mutate: updateExpenseMutation, loading: updating } = useMutation(
    (data: { id: string; payload: any }) => updateExpense(data.id, data.payload)
  );
  const { mutate: deleteExpenseMutation, loading: deleting } = useMutation(deleteExpense);
  
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // Fetch budgets from API
  const { data: budgetsData, loading: budgetsLoading } = useFetch(getBudgets, [budgetRefreshKey]);
  
  // Transform backend budget data to frontend format
  interface Budget {
    _id?: string;
    category: string;
    categoryName: string;
    limit: number;
    period?: string;
  }
  
  const budgets: Budget[] = React.useMemo(() => {
    const rawBudgets = budgetsData || [];
    if (!Array.isArray(rawBudgets)) return [];
    
    return rawBudgets.map((budget: any) => ({
      _id: budget._id,
      category: budget.category,
      categoryName: budget.categoryName,
      limit: budget.limit,
      period: budget.period || 'monthly'
    }));
  }, [budgetsData]);
  
  // Budget mutations
  const { mutate: upsertBudgetMutation, loading: savingBudget } = useMutation(upsertBudget);
  const { mutate: deleteBudgetMutation, loading: deletingBudget } = useMutation(deleteBudgetApi);
  
  const triggerBudgetRefresh = () => setBudgetRefreshKey(prev => prev + 1);
  
  const handleSaveBudget = async (budgetData: Budget): Promise<void> => {
    try {
      await upsertBudgetMutation({
        category: budgetData.category,
        categoryName: budgetData.categoryName,
        limit: budgetData.limit,
        period: budgetData.period || 'monthly'
      });
      triggerBudgetRefresh();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Error saving budget. Please try again.');
    }
  };
  
  const handleDeleteBudget = async (budgetId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudgetMutation(budgetId);
        triggerBudgetRefresh();
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Error deleting budget. Please try again.');
      }
    }
  };

  const handleExpenseSubmit = async (expenseData: Omit<Expense, 'id' | 'receipts'>): Promise<void> => {
    try {
      await createExpenseMutation({
        description: expenseData.description || 'No description',
        amount: Number(expenseData.amount) || 0,
        date: expenseData.date,
        category: expenseData.category
      });
      
      setReceipts([]);
      triggerRefresh();
      alert('Expense recorded successfully!');
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Error recording expense. Please try again.');
    }
  };

  const handleSaveDraft = (expenseData: Omit<Expense, 'id' | 'receipts'>): void => {
    // In real app, save to localStorage or draft API
    console.log('Saving draft:', expenseData);
    alert('Expense saved as draft!');
  };

  const handleEditExpense = (expense: Expense): void => {
    // In real app, populate form with expense data
    console.log('Editing expense:', expense);
    setActiveTab('record');
  };

  const handleDeleteExpense = async (expenseId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpenseMutation(expenseId);
        triggerRefresh();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
      }
    }
  };

  const handleBulkImport = async (importData: Expense[]): Promise<void> => {
    try {
      // Create expenses one by one (or batch if API supports)
      for (const expense of importData) {
        await createExpenseMutation({
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          shopId: 'default-shop-id',
          clientId: 'default-client-id'
        });
      }
      
      triggerRefresh();
      alert(`Successfully imported ${importData?.length} expenses!`);
      setActiveTab('history');
    } catch (error) {
      console.error('Error importing expenses:', error);
      alert('Error importing expenses. Please try again.');
    }
  };

  const tabs = [
    { id: 'record', label: 'Record Expense', icon: 'Plus' },
    { id: 'history', label: 'Expense History', icon: 'History' },
    { id: 'budget', label: 'Budget Overview', icon: 'Target' },
    { id: 'import', label: 'Bulk Import', icon: 'Upload' }
  ];

  return (
    <>
      <Helmet>
        <title>Expense Tracking - Digital Khata</title>
        <meta name="description" content="Track and manage business expenses with receipt management, categorization, and budget monitoring for accurate financial oversight." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          syncStatus="online"
        />
        
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          syncStatus="online"
        />

        <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        }`}>
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4" data-tour="expense-header">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Receipt" size={24} className="text-warning" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Expense Tracking</h1>
                  <p className="text-muted-foreground">
                    Record and manage business expenses with receipt management and budget monitoring
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="DollarSign" size={20} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatCurrency(expenses?.reduce((sum, exp) => sum + (exp?.amount || 0), 0))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Receipt" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Expenses</p>
                      <p className="text-xl font-bold text-foreground">{expenses?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tax Deductible</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatCurrency(expenses?.filter(exp => exp?.isTaxRelated)?.reduce((sum, exp) => sum + (exp?.amount || 0), 0))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name="Paperclip" size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">With Receipts</p>
                      <p className="text-xl font-bold text-foreground">
                        {expenses?.filter(exp => exp?.receipts && exp?.receipts?.length > 0)?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-border" data-tour="expense-tabs">
                <nav className="flex space-x-8 overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab?.id
                          ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'record' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8" data-tour="expense-form">
                  <div className="xl:col-span-2" data-tour="expense-categories">
                    <ExpenseForm
                      onSubmit={handleExpenseSubmit}
                      onSaveDraft={handleSaveDraft}
                      isLoading={isLoading}
                    />
                  </div>
                  <div>
                    <ReceiptUpload
                      receipts={receipts}
                      onReceiptsChange={setReceipts}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <ExpenseHistory
                  expenses={expenses}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
              )}

              {activeTab === 'budget' && (
                <div data-tour="budget-overview">
                  <BudgetOverview
                    budgets={budgets}
                    expenses={expenses}
                    onSaveBudget={handleSaveBudget}
                    onDeleteBudget={handleDeleteBudget}
                    isLoading={savingBudget || deletingBudget}
                  />
                </div>
              )}

              {activeTab === 'import' && (
                <BulkImport
                  onImport={handleBulkImport}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ExpenseTracking;