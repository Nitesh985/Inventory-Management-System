import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useMutation } from '@/hooks/useMutation';
import { createCredit } from '@/api/credits';

interface CreditFormProps {
  selectedCustomerId: string;
  onSuccess: () => void;
}

const CreditForm = ({ selectedCustomerId, onSuccess }: CreditFormProps) => {
  const [type, setType] = useState<'gave' | 'got'>('gave');
  const [formData, setFormData] = useState({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  
  const { mutate: createCreditMutation, loading, error } = useMutation(createCredit);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Logic: GAVE = Positive balance (debt), GOT = Negative balance (payment)
      const finalAmount = type === 'gave' ? Math.abs(Number(formData.amount)) : -Math.abs(Number(formData.amount));
      
      await createCreditMutation({
        customerId: selectedCustomerId,
        amount: finalAmount,
        description: formData.description,
        date: formData.date,
        shopId: '69243c8f00b1f56bd2724e3a' // TODO: Get from context
      });

      setFormData({ ...formData, amount: '', description: '' });
      onSuccess(); // Refresh parents/siblings
    } catch (err) {
      console.error('Error creating credit:', err);
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
          <Input label="Amount *" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          <Input label="Date *" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          <div className="md:col-span-2">
            <Input label="Remark / Description" placeholder="Items sold or payment method" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
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