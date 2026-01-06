import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

interface Expense {
  id: string;
  amount: number | string;
  category: string;
  vendor: string;
  date: string;
  description: string;
  isTaxRelated?: boolean;
  receipts?: unknown[];
}

interface ExpenseHistoryProps {
  expenses?: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

interface DateRange {
  start: string;
  end: string;
}

const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({ expenses = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = [
    { value: '', label: 'All Categories' },
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

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'category', label: 'Category' },
    { value: 'vendor', label: 'Vendor' }
  ];

  const filteredAndSortedExpenses = expenses?.filter(expense => {
      const matchesSearch = expense?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           expense?.vendor?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesCategory = !categoryFilter || expense?.category === categoryFilter;
      const matchesDateRange = (!dateRange?.start || expense?.date >= dateRange?.start) &&
                              (!dateRange?.end || expense?.date <= dateRange?.end);
      
      return matchesSearch && matchesCategory && matchesDateRange;
    })?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];
      
      if (sortBy === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const formatCurrency = (amount: number | string): string => {
    return `Rs. ${Math.round(Number(amount) || 0).toLocaleString('en-NP')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'office-supplies': 'bg-blue-100 text-blue-800',
      'travel': 'bg-green-100 text-green-800',
      'utilities': 'bg-yellow-100 text-yellow-800',
      'marketing': 'bg-purple-100 text-purple-800',
      'equipment': 'bg-red-100 text-red-800',
      'professional-services': 'bg-indigo-100 text-indigo-800',
      'meals': 'bg-orange-100 text-orange-800',
      'rent': 'bg-teal-100 text-teal-800',
      'insurance': 'bg-cyan-100 text-cyan-800',
      'maintenance': 'bg-pink-100 text-pink-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors?.[category] || colors?.default;
  };

  const totalExpenses = filteredAndSortedExpenses?.reduce((sum, expense) => sum + parseFloat(expense?.amount), 0);

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="History" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Expense History</h3>
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedExpenses?.length} expenses • Total: {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
          
          <Select
            options={categories}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Filter by category"
          />
          
          <div className="flex space-x-2">
            <Input
              type="date"
              placeholder="Start date"
              value={dateRange?.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e?.target?.value }))}
            />
            <Input
              type="date"
              placeholder="End date"
              value={dateRange?.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e?.target?.value }))}
            />
          </div>
          
          <div className="flex space-x-2">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Expense List */}
      <div className="divide-y divide-border">
        {filteredAndSortedExpenses?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Receipt" size={24} className="text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">No expenses found</h4>
            <p className="text-muted-foreground">
              {expenses?.length === 0 
                ? "Start by recording your first expense above" :"Try adjusting your filters to see more results"
              }
            </p>
          </div>
        ) : (
          filteredAndSortedExpenses?.map((expense) => (
            <div key={expense?.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-semibold text-foreground">
                      {formatCurrency(expense?.amount)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense?.category)}`}>
                      {expense?.category?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                    </span>
                    {expense?.isTaxRelated && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        Tax Deductible
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{formatDate(expense?.date)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Building" size={14} />
                      <span>{expense?.vendor}</span>
                    </span>
                    {expense?.receipts && expense?.receipts?.length > 0 && (
                      <span className="flex items-center space-x-1">
                        <Icon name="Paperclip" size={14} />
                        <span>{expense?.receipts?.length} receipt(s)</span>
                      </span>
                    )}
                  </div>
                  
                  {expense?.description && (
                    <p className="text-sm text-foreground mt-2 line-clamp-2">
                      {expense?.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(expense)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(expense?.id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;