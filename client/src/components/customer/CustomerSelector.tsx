import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import { useFetch } from '@/hooks/useFetch';
import { getCustomers } from '@/api/customers';

export interface CustomerSelectorProps {
  selectedCustomer: string | null;
  onCustomerSelect: (customerId: string) => void;
  onAddCustomer: (customer: {
    value: string;
    label: string;
    phone?: string;
    email?: string;
    address?: string;
  }) => void;
}



const CustomerSelector = ({ selectedCustomer, onCustomerSelect, onAddCustomer }:CustomerSelectorProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const {data, loading, error} = useFetch(getCustomers);
  const [customers, setCustomers] = useState([ {value: 'walk-in', label: 'Walk-in Customer', phone: '', email: '', address: ''}, ...data])
  

  const handleAddCustomer = () => {
    if (newCustomer?.name?.trim()) {
      const customer = {
        value: `cust-${Date.now()}`,
        label: newCustomer?.name,
        phone: newCustomer?.phone,
        email: newCustomer?.email,
        address: newCustomer?.address
      };
      onAddCustomer(customer);
      onCustomerSelect(customer?.value);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
      setShowAddForm(false);
    }
  };

  const selectedCustomerData = customers?.find(c => c?.value === selectedCustomer);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Customer Information</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="UserPlus"
          iconPosition="left"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add Customer
        </Button>
      </div>
      {showAddForm && (
        <div className="bg-muted p-4 rounded-lg border border-border space-y-3">
          <h4 className="font-medium text-foreground">Add New Customer</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Customer Name"
              type="text"
              placeholder="Enter customer name"
              value={newCustomer?.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e?.target?.value })}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              value={newCustomer?.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e?.target?.value })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={newCustomer?.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e?.target?.value })}
            />
            <Input
              label="Address"
              type="text"
              placeholder="Enter address"
              value={newCustomer?.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e?.target?.value })}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleAddCustomer}
              disabled={!newCustomer?.name?.trim()}
            >
              Add Customer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <Select
        label="Select Customer"
        placeholder="Choose a customer"
        options={customers}
        value={selectedCustomer}
        onChange={onCustomerSelect}
        searchable
        required
      />
      {selectedCustomerData && selectedCustomerData?.value !== 'walk-in' && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-foreground">Customer Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {selectedCustomerData?.phone && (
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{selectedCustomerData?.phone}</span>
              </div>
            )}
            {selectedCustomerData?.email && (
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{selectedCustomerData?.email}</span>
              </div>
            )}
            {selectedCustomerData?.address && (
              <div className="flex items-center space-x-2 md:col-span-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{selectedCustomerData?.address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSelector;