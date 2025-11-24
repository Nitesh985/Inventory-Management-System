import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetOverview = ({ budgets = [], expenses = [] }) => {
  const calculateCategorySpending = (category) => {
    return expenses?.filter(expense => expense?.category === category)?.reduce((sum, expense) => sum + parseFloat(expense?.amount), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 100) return 'AlertTriangle';
    if (percentage >= 80) return 'AlertCircle';
    return 'CheckCircle';
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-error';
    if (percentage >= 80) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Target" size={20} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Budget Overview</h3>
          <p className="text-sm text-muted-foreground">Track spending against category budgets</p>
        </div>
      </div>
      {budgets?.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Target" size={24} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">No budgets set</h4>
          <p className="text-muted-foreground mb-4">
            Set category budgets to track your spending limits
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets?.map((budget) => {
            const spent = calculateCategorySpending(budget?.category);
            const percentage = (spent / budget?.limit) * 100;
            const remaining = budget?.limit - spent;

            return (
              <div key={budget?.category} className="p-4 bg-muted rounded-lg">
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
                  </div>
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
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {budgets?.filter(budget => {
                const spent = calculateCategorySpending(budget?.category);
                const percentage = (spent / budget?.limit) * 100;
                return percentage < 80;
              })?.length}
            </div>
            <div className="text-sm text-muted-foreground">On Track</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {budgets?.filter(budget => {
                const spent = calculateCategorySpending(budget?.category);
                const percentage = (spent / budget?.limit) * 100;
                return percentage >= 100;
              })?.length}
            </div>
            <div className="text-sm text-muted-foreground">Over Budget</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;