import React, { useState } from "react";
import Icon from "../AppIcon";
import Button from "./Button";

interface QuickActionMenuProps {
  className?: string;
}

const QuickActionMenu: React.FC<QuickActionMenuProps> = ({ className = "" }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const quickActions = [
    {
      label: "Record Sale",
      icon: "Plus",
      path: "/sales-recording",
      color: "bg-success text-success-foreground",
      description: "Add new sale transaction",
    },
    {
      label: "Add Expense",
      icon: "Minus",
      path: "/expense-tracking",
      color: "bg-warning text-warning-foreground",
      description: "Record business expense",
    },
    {
      label: "Update Inventory",
      icon: "Package",
      path: "/inventory-management",
      color: "bg-primary text-primary-foreground",
      description: "Manage stock levels",
    },
    {
      label: "View Reports",
      icon: "BarChart3",
      path: "/ai-reports-dashboard",
      color: "bg-accent text-accent-foreground",
      description: "Check business insights",
    },
  ];

  const handleActionClick = (path: string): void => {
    window.location.href = path;
    setIsExpanded(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action) => (
          <Button
            key={action?.label}
            variant="outline"
            size="lg"
            className="h-24 flex-col space-y-2 hover:shadow-card transition-all duration-200"
            onClick={() => handleActionClick(action?.path)}
          >
            <div
              className={`w-10 h-10 rounded-lg ${action?.color} flex items-center justify-center`}
            >
              <Icon name={action?.icon} size={20} />
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">{action?.label}</div>
              <div className="text-xs text-muted-foreground">
                {action?.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Floating Action Button */}
        <Button
          variant="default"
          size="icon"
          className={`fixed bottom-20 right-4 z-100 w-14 h-14 rounded-full shadow-modal transition-all duration-300 ${
            isExpanded ? "rotate-45" : "rotate-0"
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon name="Plus" size={24} />
        </Button>

        {/* Expanded Action Menu */}
        {isExpanded && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-50"
              onClick={() => setIsExpanded(false)}
            />
            <div className="fixed bottom-36 right-4 z-200 space-y-3">
              {quickActions?.map((action, index) => (
                <div
                  key={action?.label}
                  className="flex items-center space-x-3 animate-in slide-in-from-right duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="bg-card text-foreground px-3 py-2 rounded-lg shadow-card text-sm font-medium whitespace-nowrap">
                    {action?.label}
                  </span>
                  <Button
                    variant="default"
                    size="icon"
                    className={`w-12 h-12 rounded-full shadow-card ${action?.color}`}
                    onClick={() => handleActionClick(action?.path)}
                  >
                    <Icon name={action?.icon} size={20} />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Tablet Layout */}
      <div className="hidden sm:grid md:hidden grid-cols-2 gap-3">
        {quickActions?.map((action) => (
          <Button
            key={action?.label}
            variant="outline"
            size="default"
            className="h-16 flex items-center space-x-3 justify-start hover:shadow-card transition-all duration-200"
            onClick={() => handleActionClick(action?.path)}
          >
            <div
              className={`w-8 h-8 rounded-lg ${action?.color} flex items-center justify-center flex-shrink-0`}
            >
              <Icon name={action?.icon} size={16} />
            </div>
            <div className="text-left min-w-0">
              <div className="font-medium text-sm">{action?.label}</div>
              <div className="text-xs text-muted-foreground truncate">
                {action?.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionMenu;
