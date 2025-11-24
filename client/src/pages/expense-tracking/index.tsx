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


const ExpenseTracking = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('record');
  const [expenses, setExpenses] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for expenses
  const mockExpenses = [
    {
      id: 1,
      amount: 125.50,
      category: 'office-supplies',
      vendor: 'Amazon Business',
      date: '2024-11-01',
      description: 'Office supplies including pens, notebooks, and printer paper for Q4 operations',
      isTaxRelated: true,
      receipts: [
        {
          id: 1,
          name: 'amazon_receipt_001.pdf',
          url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
          type: 'application/pdf'
        }
      ]
    },
    {
      id: 2,
      amount: 89.25,
      category: 'travel',
      vendor: 'Uber for Business',
      date: '2024-10-30',
      description: 'Transportation to client meeting downtown',
      isTaxRelated: true,
      receipts: []
    },
    {
      id: 3,
      amount: 245.00,
      category: 'utilities',
      vendor: 'Electric Company',
      date: '2024-10-28',
      description: 'Monthly electricity bill for office space',
      isTaxRelated: true,
      receipts: []
    },
    {
      id: 4,
      amount: 1250.00,
      category: 'marketing',
      vendor: 'Google Ads',
      date: '2024-10-25',
      description: 'Digital advertising campaign for product launch',
      isTaxRelated: true,
      receipts: []
    },
    {
      id: 5,
      amount: 75.80,
      category: 'meals',
      vendor: 'Downtown Bistro',
      date: '2024-10-24',
      description: 'Business lunch with potential client',
      isTaxRelated: true,
      receipts: []
    }
  ];

  // Mock data for budgets
  const mockBudgets = [
    {
      category: 'office-supplies',
      categoryName: 'Office Supplies',
      limit: 500.00
    },
    {
      category: 'travel',
      categoryName: 'Travel & Transportation',
      limit: 1000.00
    },
    {
      category: 'utilities',
      categoryName: 'Utilities',
      limit: 300.00
    },
    {
      category: 'marketing',
      categoryName: 'Marketing & Advertising',
      limit: 2000.00
    },
    {
      category: 'meals',
      categoryName: 'Meals & Entertainment',
      limit: 400.00
    }
  ];

  useEffect(() => {
    // Load mock expenses on component mount
    setExpenses(mockExpenses);
  }, []);

  const handleExpenseSubmit = async (expenseData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExpense = {
        ...expenseData,
        id: Date.now(),
        receipts: receipts
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      setReceipts([]);
      
      // Show success message (in real app, use toast notification)
      alert('Expense recorded successfully!');
    } catch (error) {
      alert('Error recording expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = (expenseData) => {
    // In real app, save to localStorage or draft API
    console.log('Saving draft:', expenseData);
    alert('Expense saved as draft!');
  };

  const handleEditExpense = (expense) => {
    // In real app, populate form with expense data
    console.log('Editing expense:', expense);
    setActiveTab('record');
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev?.filter(expense => expense?.id !== expenseId));
    }
  };

  const handleBulkImport = async (importData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setExpenses(prev => [...importData, ...prev]);
      alert(`Successfully imported ${importData?.length} expenses!`);
      setActiveTab('history');
    } catch (error) {
      alert('Error importing expenses. Please try again.');
    } finally {
      setIsLoading(false);
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
              <div className="flex items-center space-x-3 mb-4">
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
                        ${expenses?.reduce((sum, exp) => sum + parseFloat(exp?.amount), 0)?.toLocaleString()}
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
                      <p className="text-xl font-bold text-foreground">{expenses?.length}</p>
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
                        ${expenses?.filter(exp => exp?.isTaxRelated)?.reduce((sum, exp) => sum + parseFloat(exp?.amount), 0)?.toLocaleString()}
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
                        {expenses?.filter(exp => exp?.receipts && exp?.receipts?.length > 0)?.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-border">
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
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
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
                <BudgetOverview
                  budgets={mockBudgets}
                  expenses={expenses}
                />
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