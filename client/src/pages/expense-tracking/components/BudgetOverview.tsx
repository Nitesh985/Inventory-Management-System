import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

interface Budget {
  _id?: string;
  category: string;
  categoryName: string;
  limit: number;
  period?: 'monthly' | 'quarterly' | 'yearly';
}

interface Expense {
  category: string;
  amount: string | number;
}

interface BudgetOverviewProps {
  budgets?: Budget[];
  expenses?: Expense[];
  onSaveBudget?: (budget: Omit<Budget, '_id'>) => Promise<void>;
  onDeleteBudget?: (budgetId: string) => Promise<void>;
  isLoading?: boolean;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ 
  budgets = [], 
  expenses = [],
  onSaveBudget,
  onDeleteBudget,
  isLoading = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    categoryName: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'quarterly' | 'yearly'
  });

  const categories = [
    { value: 'office-supplies', label: 'Office Supplies' },
    { value: 'travel', label: 'Travel & Transportation' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'equipment', label: 'Equipment & Software' },
    { value: 'professional-services', label: 'Professional Services' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'rent', label: 'Rent & Facilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'maintenance', label: 'Maintenance & Repairs' }
  ];

  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // Filter out categories that already have budgets
  const availableCategories = categories.filter(
    cat => !budgets.some(b => b.category === cat.value)
  );

  const calculateCategorySpending = (category: string): number => {
    return expenses?.filter(expense => expense?.category === category)?.reduce((sum, expense) => sum + parseFloat(String(expense?.amount)), 0) || 0;
  };

  const formatCurrency = (amount: number): string => {
    return `Rs. ${Math.round(amount || 0).toLocaleString('en-NP')}`;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusIcon = (percentage: number): string => {
    if (percentage >= 100) return 'AlertTriangle';
    if (percentage >= 80) return 'AlertCircle';
    return 'CheckCircle';
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage >= 100) return 'text-error';
    if (percentage >= 80) return 'text-warning';
    return 'text-success';
  };

  const handleCategoryChange = (value: string) => {
    const selectedCat = categories.find(c => c.value === value);
    setFormData(prev => ({
      ...prev,
      category: value,
      categoryName: selectedCat?.label || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.limit || !onSaveBudget) return;

    await onSaveBudget({
      category: formData.category,
      categoryName: formData.categoryName,
      limit: Number(formData.limit),
      period: formData.period
    });

    setFormData({ category: '', categoryName: '', limit: '', period: 'monthly' });
    setShowAddForm(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      categoryName: budget.categoryName,
      limit: String(budget.limit),
      period: budget.period || 'monthly'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (budgetId: string) => {
    if (!onDeleteBudget) return;
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await onDeleteBudget(budgetId);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingBudget(null);
    setFormData({ category: '', categoryName: '', limit: '', period: 'monthly' });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Budget Overview</h3>
            <p className="text-sm text-muted-foreground">Track spending against category budgets</p>
          </div>
        </div>
        {!showAddForm && availableCategories.length > 0 && onSaveBudget && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Budget
          </Button>
        )}
      </div>

      {/* Add/Edit Budget Form */}
      {showAddForm && onSaveBudget && (
        <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
          <h4 className="font-medium text-foreground mb-4">
            {editingBudget ? 'Edit Budget' : 'Set New Budget'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Category"
                options={editingBudget ? categories : availableCategories}
                value={formData.category}
                onChange={handleCategoryChange}
                placeholder="Select category"
                disabled={!!editingBudget}
                required
              />
              <Input
                label="Budget Limit (Rs.)"
                type="number"
                placeholder="0"
                value={formData.limit}
                onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                min="0"
                required
              />
              <Select
                label="Period"
                options={periodOptions}
                value={formData.period}
                onChange={(value) => setFormData(prev => ({ ...prev, period: value as 'monthly' | 'quarterly' | 'yearly' }))}
              />
              <div className="flex items-end gap-2">
                <Button type="submit" variant="default" loading={isLoading} className="flex-1">
                  {editingBudget ? 'Update' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {budgets?.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Target" size={24} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">No budgets set</h4>
          <p className="text-muted-foreground mb-4">
            Set category budgets to track your spending limits
          </p>
          {!showAddForm && onSaveBudget && (
            <Button
              variant="default"
              onClick={() => setShowAddForm(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Set Your First Budget
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {budgets?.map((budget) => {
            const spent = calculateCategorySpending(budget?.category);
            const percentage = budget?.limit > 0 ? (spent / budget?.limit) * 100 : 0;
            const remaining = budget?.limit - spent;

            return (
              <div key={budget?._id || budget?.category} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-foreground">
                      {budget?.categoryName}
                    </h4>
                    <Icon 
                      name={getStatusIcon(percentage)} 
                      size={16} 
                      className={getStatusColor(percentage)}
                    />
                    <span className="text-xs text-muted-foreground capitalize">
                      ({budget?.period || 'monthly'})
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {formatCurrency(spent)} / {formatCurrency(budget?.limit)}
                      </div>
                      <div className={`text-xs ${remaining >= 0 ? 'text-success' : 'text-error'}`}>
                        {remaining >= 0 
                          ? `${formatCurrency(remaining)} remaining`
                          : `${formatCurrency(Math.abs(remaining))} over budget`
                        }
                      </div>
                    </div>
                    {onSaveBudget && onDeleteBudget && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(budget)}
                        >
                          <Icon name="Edit" size={14} />
                        </Button>
                        {budget._id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(budget._id!)}
                            className="text-error hover:text-error hover:bg-error/10"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-background rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span className={percentage >= 100 ? 'text-error font-medium' : ''}>
                    {percentage?.toFixed(1)}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Summary Stats */}
      {budgets?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {budgets?.filter(budget => {
                  const spent = calculateCategorySpending(budget?.category);
                  const percentage = budget?.limit > 0 ? (spent / budget?.limit) * 100 : 0;
                  return percentage < 80;
                })?.length}
              </div>
              <div className="text-sm text-muted-foreground">On Track</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {budgets?.filter(budget => {
                  const spent = calculateCategorySpending(budget?.category);
                  const percentage = budget?.limit > 0 ? (spent / budget?.limit) * 100 : 0;
                  return percentage >= 80 && percentage < 100;
                })?.length}
              </div>
              <div className="text-sm text-muted-foreground">Near Limit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error">
                {budgets?.filter(budget => {
                  const spent = calculateCategorySpending(budget?.category);
                  const percentage = budget?.limit > 0 ? (spent / budget?.limit) * 100 : 0;
                  return percentage >= 100;
                })?.length}
              </div>
              <div className="text-sm text-muted-foreground">Over Budget</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetOverview;