import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { useMutation } from '@/hooks/useMutation';
import { createCustomer } from '@/api/customers';

interface AddCustomerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddCustomerModal = ({ onClose, onSuccess }: AddCustomerModalProps) => {
  const [data, setData] = useState({ name: '', contact: '', email: '', address: '', notes: '' });
  const { mutate: createCustomerMutation, loading, error } = useMutation(createCustomer);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim()) return;
    if (!data.contact && !data.email && !data.address) {
      alert('Please provide at least one of: phone number, email, or address.');
      return;
    }
    try {
      await createCustomerMutation({
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
        notes: data.notes,
        shopId: '',
        clientId: ''
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating customer:', err);
      const msg = err?.response?.data?.message || 'Failed to create customer. Please try again.';
      alert(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Icon name="UserPlus" size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add New Customer</h3>
              <p className="text-xs text-slate-500">Fill in customer details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Icon name="X" size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAdd} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              <span>{(error as any)?.response?.data?.message || 'Something went wrong'}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="User" size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Enter customer name"
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Phone" size={16} className="text-slate-400" />
                </div>
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={data.contact}
                  onChange={e => setData({ ...data, contact: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Mail" size={16} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={data.email}
                  onChange={e => setData({ ...data, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="MapPin" size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Enter address"
                value={data.address}
                onChange={e => setData({ ...data, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea
              placeholder="Any additional notes..."
              value={data.notes}
              onChange={e => setData({ ...data, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <p className="text-xs text-slate-400">
            At least one of phone, email, or address is required.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !data.name.trim()}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="Check" size={16} />
                  Save Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;