import React, { useState, useMemo } from 'react';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Loader from '@/components/Loader';
import { useFetch } from '@/hooks/useFetch';
import { getCustomers } from '@/api/customers';

interface CustomerListProps {
  selectedCustomerId: string | null;
  onCustomerSelect: (id: string) => void;
  onAddClick: () => void;
}

const CustomerList = ({ selectedCustomerId, onCustomerSelect, onAddClick }: CustomerListProps) => {
  const { data: customers, loading } = useFetch(getCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter customers based on search input
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter((c: any) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
    );
  }, [customers, searchTerm]);

  return (
    <div className="flex flex-col h-[600px] bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header & Search */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Icon name="Users" size={18} className="text-primary" />
            Customers
          </h3>
          <Button variant="outline" size="sm" onClick={onAddClick} className="h-8 text-xs">
            <Icon name="Plus" size={14} className="mr-1" /> Add
          </Button>
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
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Loader loading={loading}>
          {filteredCustomers.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredCustomers.map((customer: any) => (
                <button
                  key={customer._id}
                  onClick={() => onCustomerSelect(customer._id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-muted/50 flex items-center justify-between group ${
                    selectedCustomerId === customer._id ? 'bg-primary/5 border-r-4 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedCustomerId === customer._id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${selectedCustomerId === customer._id ? 'text-primary' : 'text-foreground'}`}>
                        {customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="Phone" size={10} />
                        {customer.phone || 'No phone'}
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