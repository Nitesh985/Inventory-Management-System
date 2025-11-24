import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const CustomerSelector = ({ selectedCustomer, onCustomerSelect, onAddCustomer }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const customers = [
    { value: 'walk-in', label: 'Walk-in Customer', phone: '', email: '', address: '' },
    { value: 'cust-001', label: 'John Smith', phone: '+1-555-0123', email: 'john.smith@email.com', address: '123 Main St, New York, NY 10001' },
    { value: 'cust-002', label: 'Sarah Johnson', phone: '+1-555-0456', email: 'sarah.j@email.com', address: '456 Oak Ave, Los Angeles, CA 90210' },
    { value: 'cust-003', label: 'Michael Brown', phone: '+1-555-0789', email: 'mike.brown@email.com', address: '789 Pine Rd, Chicago, IL 60601' },
    { value: 'cust-004', label: 'Emily Davis', phone: '+1-555-0321', email: 'emily.davis@email.com', address: '321 Elm St, Houston, TX 77001' },
    { value: 'cust-005', label: 'David Wilson', phone: '+1-555-0654', email: 'david.w@email.com', address: '654 Maple Dr, Phoenix, AZ 85001' }
  ];

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