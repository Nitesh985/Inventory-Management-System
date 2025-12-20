import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createCustomer } from '@/api/customers';

const AddCustomerModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
  const [data, setData] = useState({ name: '', phone: '', address: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCustomer({ ...data, shopId: '69243c8f00b1f56bd2724e3a', clientId: 'client123' });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-extrabold text-slate-900">Add Customer</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Icon name="X" /></button>
        </div>
        <form onSubmit={handleAdd} className="p-8 space-y-5">
          <Input label="Full Name *" value={data.name} onChange={e => setData({...data, name: e.target.value})} required />
          <Input label="Phone Number" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} />
          <Input label="Address" value={data.address} onChange={e => setData({...data, address: e.target.value})} />
          <Button type="submit" className="w-full bg-blue-600 h-12 font-bold text-lg mt-4">Save Customer</Button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;