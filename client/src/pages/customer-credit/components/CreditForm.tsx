import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useMutation } from '@/hooks/useMutation';
import { createCredit, createPayment } from '@/api/credits';

interface CreditFormProps {
  selectedCustomerId: string;
  onSuccess: () => void;
}

const CreditForm = ({ selectedCustomerId, onSuccess }: CreditFormProps) => {
  const [type, setType] = useState<'gave' | 'got'>('gave');
  const [formData, setFormData] = useState({ 
    amount: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH'
  });
  
  const { mutate: createCreditMutation, loading: creditLoading } = useMutation(createCredit);
  const { mutate: createPaymentMutation, loading: paymentLoading } = useMutation(createPayment);
  
  const loading = creditLoading || paymentLoading;

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
      if (type === 'gave') {
        // Record credit (customer owes money)
        await createCreditMutation({
          customerId: selectedCustomerId,
          amount: Math.abs(Number(formData.amount)),
          description: formData.description || 'Credit given',
          date: formData.date,
        });
      } else {
        // Record payment (customer paid money)
        await createPaymentMutation({
          customerId: selectedCustomerId,
          amount: Math.abs(Number(formData.amount)),
          method: formData.paymentMethod,
          note: formData.description || 'Payment received',
          date: formData.date,
        });
      }

      setFormData({ ...formData, amount: '', description: '' });
      onSuccess(); // Refresh parents/siblings
    } catch (err) {
      console.error('Error creating transaction:', err);
      alert('Failed to record transaction. Please try again.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${type === 'gave' ? 'bg-red-50/30' : 'bg-green-50/30'}`}>
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon name={type === 'gave' ? 'ArrowUpRight' : 'ArrowDownLeft'} className={type === 'gave' ? 'text-red-500' : 'text-green-600'} />
          Record New {type === 'gave' ? 'Credit (Gave)' : 'Payment (Got)'}
        </h3>
      </div>

      <div className="p-6">
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 max-w-sm">
          <button onClick={() => setType('gave')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'gave' ? 'bg-red-500 text-white shadow-md' : 'text-slate-500'}`}>YOU GAVE</button>
          <button onClick={() => setType('got')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'got' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500'}`}>YOU GOT</button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Amount *" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required min="1" />
          <Input label="Date *" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          
          {type === 'got' && (
            <Select
              label="Payment Method"
              options={paymentMethods}
              value={formData.paymentMethod}
              onChange={(value) => setFormData({...formData, paymentMethod: value})}
            />
          )}
          
          <div className={type === 'got' ? '' : 'md:col-span-2'}>
            <Input 
              label="Remark / Description" 
              placeholder={type === 'gave' ? "Items given on credit..." : "Payment note..."} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          <Button type="submit" disabled={loading || !formData.amount} className={`md:col-span-2 h-12 font-bold ${type === 'gave' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}>
            {loading ? 'Processing...' : `Save ${type === 'gave' ? 'Credit' : 'Payment'}`}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreditForm;