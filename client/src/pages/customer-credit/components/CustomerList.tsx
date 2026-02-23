import React, { useState, useMemo } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Loader from '@/components/Loader';
import { useFetch } from '@/hooks/useFetch';
import { getCustomersWithBalance } from '@/api/credits';

interface CustomerWithBalance {
  _id: string;
  name: string;
  phone?: string;  // For backwards compatibility
  contact?: string[];  // New field
  email?: string;
  address?: string;
  balance: number;        // What they still owe (totalCredit - totalPaid)
  totalCredit: number;    // Total credit sales amount
  totalPaid: number;      // Total payments received
  creditSalesCount: number;  // Number of credit sales
  paymentsCount: number;     // Number of payments made
  lastTransaction: string | null;  // Most recent activity date
}

interface CustomerListProps {
  selectedCustomerId: string | null;
  onCustomerSelect: (id: string) => void;
  onAddClick: () => void;
  refreshKey?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onCustomerNameClick?: (id: string) => void;
}

type SortField = 'name' | 'balance' | 'lastTransaction';
type SortOrder = 'asc' | 'desc';
type CreditFilter = 'all' | 'has_due';

const FILTER_OPTIONS: { value: CreditFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: 'Users' },
  { value: 'has_due', label: 'Has Due', icon: 'AlertCircle' },
];

const CustomerList = ({ 
  selectedCustomerId, 
  onCustomerSelect, 
  onAddClick, 
  refreshKey,
  isExpanded = false,
  onToggleExpand,
  onCustomerNameClick
}: CustomerListProps) => {
  const { data: customersWithData, loading } = useFetch<CustomerWithBalance[]>(getCustomersWithBalance, [refreshKey]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [creditFilter, setCreditFilter] = useState<CreditFilter>('has_due');

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    if (!customersWithData) return [];
    
    let result = customersWithData.filter((c) => {
      // Search filter
      const primaryPhone = c.contact?.[0] || c.phone;
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (primaryPhone && primaryPhone.includes(searchTerm));
      if (!matchesSearch) return false;

      // Credit status filter
      switch (creditFilter) {
        case 'has_due':
          return c.balance > 0;
        case 'all':
        default:
          return true;
      }
    });

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'balance':
          comparison = (a.balance || 0) - (b.balance || 0);
          break;
        case 'lastTransaction':
          const dateA = a.lastTransaction ? new Date(a.lastTransaction).getTime() : 0;
          const dateB = b.lastTransaction ? new Date(b.lastTransaction).getTime() : 0;
          comparison = dateA - dateB;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [customersWithData, searchTerm, sortField, sortOrder, creditFilter]);

  // Compute filter counts
  const filterCounts = useMemo(() => {
    if (!customersWithData) return {} as Record<CreditFilter, number>;
    return {
      all: customersWithData.length,
      has_due: customersWithData.filter(c => c.balance > 0).length,
    };
  }, [customersWithData]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatCurrency = (amount: number) => `Rs. ${Math.round(amount || 0).toLocaleString('en-NP')}`;

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-NP', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  const handleCustomerClick = (customerId: string) => {
    onCustomerSelect(customerId);
    // If expanded, collapse when a customer is selected
    if (isExpanded && onToggleExpand) {
      onToggleExpand();
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <Icon 
      name={sortField === field ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
      size={12} 
      className={sortField === field ? 'text-primary' : 'text-muted-foreground'}
    />
  );

  return (
    <div className="flex flex-col h-[600px] bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out">
      {/* Header & Search */}
      <div className="p-4 border-b border-border space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Icon name="Users" size={18} className="text-primary" />
            Customers
            <span className="text-xs font-normal text-muted-foreground">({filteredCustomers.length})</span>
          </h3>
          {onToggleExpand && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleExpand}
              className="h-8 w-8 p-0 hover:bg-primary/10"
              title={isExpanded ? "Collapse to compact view" : "Expand to detailed view"}
            >
              <Icon 
                name={isExpanded ? "Minimize2" : "Maximize2"} 
                size={16} 
                className={isExpanded ? "text-primary" : "text-muted-foreground"}
              />
            </Button>
          )}
        </div>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or phone..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Credit Status Filters */}
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCreditFilter(opt.value)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                creditFilter === opt.value
                  ? opt.value === 'has_due'
                    ? 'bg-red-100 text-red-700 ring-1 ring-red-300'

                    : 'bg-primary/10 text-primary ring-1 ring-primary/30'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon name={opt.icon as any} size={12} />
              {opt.label}
              <span className={`ml-0.5 text-[10px] ${
                creditFilter === opt.value ? 'opacity-80' : 'opacity-60'
              }`}>
                {filterCounts[opt.value] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Column Headers (only in expanded mode) */}
      {isExpanded && (
        <div className="flex items-center px-4 py-2 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground gap-2">
          <button 
            onClick={() => handleSort('name')}
            className="flex items-center gap-1 hover:text-foreground transition-colors flex-1 min-w-[120px]"
          >
            Customer <SortIcon field="name" />
          </button>
          <button 
            onClick={() => handleSort('balance')}
            className="flex items-center gap-1 hover:text-foreground transition-colors w-24 justify-end"
          >
            Balance <SortIcon field="balance" />
          </button>
          <button 
            onClick={() => handleSort('lastTransaction')}
            className="flex items-center gap-1 hover:text-foreground transition-colors w-20 justify-end"
          >
            Last Txn <SortIcon field="lastTransaction" />
          </button>
          <div className="w-6" /> {/* Spacer for chevron */}
        </div>
      )}

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Loader loading={loading}>
          {filteredCustomers.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer._id}
                  onClick={() => handleCustomerClick(customer._id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-muted/50 flex items-center justify-between group ${
                    selectedCustomerId === customer._id ? 'bg-primary/5 border-r-4 border-primary' : ''
                  }`}
                >
                  {/* Compact Mode Content */}
                  {!isExpanded && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          selectedCustomerId === customer._id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p 
                            className={`font-semibold text-sm cursor-pointer hover:underline ${selectedCustomerId === customer._id ? 'text-primary' : 'text-foreground'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onCustomerNameClick?.(customer._id);
                            }}
                          >
                            {customer.name}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="Phone" size={10} />
                            {customer.contact?.[0] || customer.phone || 'No phone'}
                          </p>
                        </div>
                      </div>
                      <Icon 
                        name="ChevronRight" 
                        size={16} 
                        className={`transition-transform group-hover:translate-x-1 ${
                          selectedCustomerId === customer._id ? 'text-primary' : 'text-muted-foreground'
                        }`} 
                      />
                    </>
                  )}

                  {/* Expanded Mode Content */}
                  {isExpanded && (
                    <>
                      <div className="flex items-center gap-3 flex-1 min-w-[120px]">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          selectedCustomerId === customer._id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p 
                            className={`font-semibold text-sm truncate cursor-pointer hover:underline ${selectedCustomerId === customer._id ? 'text-primary' : 'text-foreground'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onCustomerNameClick?.(customer._id);
                            }}
                          >
                            {customer.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {customer.contact?.[0] || customer.phone || 'No phone'}
                          </p>
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <p className={`text-sm font-semibold ${
                          customer.balance > 0 ? 'text-red-600' : customer.balance < 0 ? 'text-green-600' : 'text-muted-foreground'
                        }`}>
                          {formatCurrency(Math.abs(customer.balance))}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {customer.balance > 0 ? 'Due' : customer.balance < 0 ? 'Advance' : '-'}
                        </p>
                      </div>
                      <div className="w-20 text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(customer.lastTransaction)}
                        </p>
                      </div>
                      <Icon 
                        name="ChevronRight" 
                        size={16} 
                        className={`flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                          selectedCustomerId === customer._id ? 'text-primary' : 'text-muted-foreground'
                        }`} 
                      />
                    </>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm italic">
              No customers found.
            </div>
          )}
        </Loader>
      </div>
    </div>
  );
};

export default CustomerList;