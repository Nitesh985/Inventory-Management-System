import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import CreditStats from './components/CreditStats';
import CreditForm from './components/CreditForm';
import CreditHistory from './components/CreditHistory';
import CustomerList from './components/CustomerList';
import AddCustomerModal from './components/AddCustomerModal';

const CustomerCredit = () => {
  const navigate = useNavigate();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Function to trigger a re-fetch across all components
  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* 1. Page Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <Icon name="ArrowLeft" size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">Customer Khata</h1>
            <p className="text-slate-500 text-sm">Manage credits, track payments, and monitor balances</p>
          </div>
        </div>
        <Button 
          variant="default" 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-md"
        >
          <Icon name="Plus" size={18} className="mr-2" /> Add New Customer
        </Button>
      </div>

      {/* 2. Top Metric Cards */}
      <CreditStats key={`stats-${refreshKey}`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3. Section 1: Customer Directory (Left Sidebar within page) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <CustomerList 
            selectedCustomerId={selectedCustomerId} 
            onCustomerSelect={setSelectedCustomerId}
            onAddClick={() => setIsAddModalOpen(true)}
            refreshKey={refreshKey}
          />
        </div>

        {/* 4. Section 3: Transaction & History (Main Content Area) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCustomerId ? (
            <>
              {/* Record Entry Form (Functional Section) */}
              <CreditForm 
                selectedCustomerId={selectedCustomerId} 
                onSuccess={handleRefresh} 
              />
              
              {/* Detailed History Table */}
              <CreditHistory 
                customerId={selectedCustomerId} 
                key={`history-${refreshKey}-${selectedCustomerId}`} 
              />
            </>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center p-10">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Icon name="User" size={48} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">No Customer Selected</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm mt-2">
                Select a customer from the list on the left to view their credit history and record new transactions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Add Customer Modal */}
      {isAddModalOpen && (
        <AddCustomerModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={handleRefresh} 
        />
      )}
    </div>
  );
};

export default CustomerCredit;