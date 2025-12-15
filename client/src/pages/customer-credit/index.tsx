import React from 'react';
import CreditStats from './components/CreditStats';
import CreditForm from './components/CreditForm';
import CreditHistory from './components/CreditHistory';
import { useFetch } from '@/hooks/useFetch';
import { getCustomerOutstanding, getCustomers } from '@/api/customers';


const CustomerCredit = () => {
  
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Khata</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CreditStats />
        <CreditForm />
      </div>
      <div className="mt-4">
        <CreditHistory />
      </div>
    </div>
  );
};

export default CustomerCredit;
