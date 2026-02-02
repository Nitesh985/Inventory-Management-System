import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useMutation } from '@/hooks/useMutation';
import { createPayment } from '@/api/credits';

interface CreditFormProps {
  selectedCustomerId: string;
  onSuccess: () => void;
}

const CreditForm = ({ selectedCustomerId, onSuccess }: CreditFormProps) => {
  const [formData, setFormData] = useState({ 
    amount: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH'
  });
  
  const { mutate: createPaymentMutation, loading } = useMutation(createPayment);

  const paymentMethods = [
    { value: 'CASH', label: 'Cash' },
    { value: 'ESEWA', label: 'eSewa' },
    { value: 'KHALTI', label: 'Khalti' },
    { value: 'CARD', label: 'Card' },
  ];
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Record payment (customer paid money)
      await createPaymentMutation({
        customerId: selectedCustomerId,
        amount: Math.abs(Number(formData.amount)),
        method: formData.paymentMethod,
        note: formData.description || 'Payment received',
        date: formData.date,
      });

      setFormData({ amount: '', description: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'CASH' });
      onSuccess(); // Refresh parents/siblings
    } catch (err) {
      console.error('Error creating payment:', err);
      alert('Failed to record payment. Please try again.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-green-50/30">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon name="ArrowDownLeft" className="text-green-600" />
          Record Payment Received
        </h3>
      </div>

      <div className="p-6">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Amount *" 
            type="number" 
            value={formData.amount} 
            onChange={e => setFormData({...formData, amount: e.target.value})} 
            required 
            min="1" 
            placeholder="Enter payment amount"
          />
          <Input 
            label="Date *" 
            type="date" 
            value={formData.date} 
            onChange={e => setFormData({...formData, date: e.target.value})} 
            required 
          />
          
          <Select
            label="Payment Method"
            options={paymentMethods}
            value={formData.paymentMethod}
            onChange={(value) => setFormData({...formData, paymentMethod: value})}
          />
          
          <div>
            <Input 
              label="Note / Description" 
              placeholder="Payment note..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !formData.amount} 
            className="md:col-span-2 h-12 font-bold bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Processing...' : 'Save Payment'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreditForm;