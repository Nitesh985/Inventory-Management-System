import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { updateTourStatus } from '@/api/users';

export type TourType = 'business-dashboard' | 'inventory-management' | 'sales-recording' | 'expense-tracking';

interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
  };
}

// Business Dashboard Tour Steps
const businessDashboardSteps: TourStep[] = [
  {
    element: '[data-tour="welcome"]',
    popover: {
      title: 'Welcome to Digital Khata! 🎉',
      description: 'Let us guide you through your dashboard. You\'ll learn how to manage your business easily.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="metrics-cards"]',
    popover: {
      title: 'Your Business Summary',
      description: 'View your revenue, expenses, and profit here. All numbers update automatically.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="period-selector"]',
    popover: {
      title: 'Choose Time Period',
      description: 'Select weekly, monthly, or yearly to see your data for different time ranges.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="quick-actions"]',
    popover: {
      title: 'Quick Actions',
      description: 'Click here to quickly record sales, add products, or track expenses.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="recent-transactions"]',
    popover: {
      title: 'Recent Activity',
      description: 'Your latest sales and expenses appear here. Click any item for details.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="inventory-alerts"]',
    popover: {
      title: 'Low Stock Alerts',
      description: 'See which products need restocking. Get notified before items run out.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="business-chart"]',
    popover: {
      title: 'Sales Chart',
      description: 'See your revenue and expenses in a visual chart. Track your growth easily.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="sidebar"]',
    popover: {
      title: 'Navigation Menu',
      description: 'Use this menu to access Dashboard, Inventory, Sales, Expenses, and Reports.',
      side: 'right',
    },
  },
  {
    element: '[data-tour="help-button"]',
    popover: {
      title: 'Help Menu',
      description: 'Click the menu icon to restart this tour anytime or access settings.',
      side: 'bottom',
    },
  },
];

// Inventory Management Tour Steps
const inventoryManagementSteps: TourStep[] = [
  {
    element: '[data-tour="inventory-header"]',
    popover: {
      title: 'Inventory Management',
      description: 'Manage all your products and track stock levels here.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="add-product"]',
    popover: {
      title: 'Add New Products',
      description: 'Click here to add new products with name, price, quantity, and images.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="filter-toolbar"]',
    popover: {
      title: 'Filter Products',
      description: 'Use these filters to search and sort your products by category or stock status.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="product-table"]',
    popover: {
      title: 'Product List',
      description: 'All your products are listed here. Low stock items are highlighted in red.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="low-stock-alerts"]',
    popover: {
      title: 'Low Stock Alerts',
      description: 'Get notified when products need restocking. Click to reorder.',
      side: 'top',
    },
  },
];

// Sales Management Tour Steps
const salesManagementSteps: TourStep[] = [
  {
    element: '[data-tour="sales-header"]',
    popover: {
      title: 'Sales Management',
      description: 'View and manage all your sales transactions here.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="record-sale-btn"]',
    popover: {
      title: 'Record New Sale',
      description: 'Click here to record a new sale quickly.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="sales-stats"]',
    popover: {
      title: 'Sales Summary',
      description: 'View total sales, revenue, and average transaction value.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="sales-filter"]',
    popover: {
      title: 'Filter Sales',
      description: 'Search and filter sales by date, payment method, or customer.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="sales-table"]',
    popover: {
      title: 'Sales List',
      description: 'All your sales transactions appear here. Click any sale to view details.',
      side: 'top',
    },
  },
];

// Expense Tracking Tour Steps
const expenseTrackingSteps: TourStep[] = [
  {
    element: '[data-tour="expense-header"]',
    popover: {
      title: 'Expense Tracking',
      description: 'Track all your business expenses in one place.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="expense-tabs"]',
    popover: {
      title: 'Expense Tabs',
      description: 'Switch between recording expenses, viewing history, and managing budgets.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="expense-form"]',
    popover: {
      title: 'Add Expense',
      description: 'Fill in the amount, category, and description to record an expense.',
      side: 'right',
    },
  },
  {
    element: '[data-tour="expense-categories"]',
    popover: {
      title: 'Expense Categories',
      description: 'Organize expenses by categories like rent, utilities, salaries, etc.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="budget-overview"]',
    popover: {
      title: 'Budget Management',
      description: 'Set budgets for each category and track your spending.',
      side: 'top',
    },
  },
];

const tourConfigurations: Record<TourType, TourStep[]> = {
  'business-dashboard': businessDashboardSteps,
  'inventory-management': inventoryManagementSteps,
  'sales-recording': salesManagementSteps,
  'expense-tracking': expenseTrackingSteps,
};

export const useTour = (tourType: TourType) => {
  const [isTourActive, setIsTourActive] = useState(false);

  const startTour = async (skipStatusUpdate = false) => {
    const steps = tourConfigurations[tourType] || businessDashboardSteps;

    const driverObj = driver({
      showProgress: true,
      steps: steps,
      onDestroyed: async () => {
        setIsTourActive(false);
        // Update tour status on the backend when user completes the tour
        if (!skipStatusUpdate && tourType === 'business-dashboard') {
          try {
            await updateTourStatus(true);
          } catch (error) {
            console.error('Failed to update tour status:', error);
          }
        }
      },
      popoverClass: 'driverjs-theme',
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: 'Got it! ✓',
      allowClose: true,
      overlayClickNext: false,
    });

    setIsTourActive(true);
    driverObj.drive();
  };

  return {
    startTour,
    isTourActive,
  };
};

// Auto-start tour for new users
export const useAutoTour = (tourType: TourType, shouldStartTour: boolean) => {
  const { startTour } = useTour(tourType);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Add a delay to ensure all DOM elements are rendered
    const timer = setTimeout(() => {
      if (shouldStartTour && !hasStarted) {
        setHasStarted(true);
        startTour();
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [shouldStartTour, hasStarted, startTour]);

  return { startTour };
};
