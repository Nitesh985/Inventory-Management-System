import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const actions = [
    {
      label: "Record Sale",
      description: "Add new transaction",
      icon: "Plus",
      color: "bg-success text-success-foreground",
      path: "/sales-recording"
    },
    {
      label: "Add Expense",
      description: "Track business costs",
      icon: "Minus",
      color: "bg-warning text-warning-foreground",
      path: "/expense-tracking"
    },
    {
      label: "Manage Inventory",
      description: "Update stock levels",
      icon: "Package",
      color: "bg-primary text-primary-foreground",
      path: "/inventory-management"
    },
    {
      label: "View Reports",
      description: "Business insights",
      icon: "BarChart3",
      color: "bg-accent text-accent-foreground",
      path: "/ai-reports-dashboard"
    }
  ];

  const handleActionClick = (path) => {
    window.location.href = path;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions?.map((action) => (
          <Button
            key={action?.label}
            variant="outline"
            className="h-20 flex-col space-y-2 hover:shadow-card transition-all duration-200"
            onClick={() => handleActionClick(action?.path)}
          >
            <div className={`w-8 h-8 rounded-lg ${action?.color} flex items-center justify-center`}>
              <Icon name={action?.icon} size={18} />
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">{action?.label}</div>
              <div className="text-xs text-muted-foreground">{action?.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;