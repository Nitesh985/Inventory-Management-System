import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import { getCustomersWithBalance } from '@/api/credits';
import { updateCustomer, deleteCustomer } from '@/api/customers';
import { useMutation } from '@/hooks/useMutation';

interface CustomerDetails {
  _id: string;
  name: string;
  contact?: string[];
  email?: string;
  address?: string;
  notes?: string;
  balance?: number;
  totalCredit?: number;
  totalPaid?: number;
}

interface CustomerDetailsModalProps {
  customerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomerDetailsModal = ({ customerId, onClose, onSuccess }: CustomerDetailsModalProps) => {
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    primaryContact: '',
    alternateContact: '',
    email: '',
    address: '',
    notes: '',
  });

  const updateMutation = useMutation(updateCustomer);
  const deleteMutation = useMutation(deleteCustomer);

  // Fetch customer details
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const response = await getCustomersWithBalance();
        
        console.log('API Response:', response);
        
        // The API wraps data in { success, data, message, statusCode }
        const customersArray = response?.data || response;
        console.log('Customers Array:', customersArray);
        console.log('Looking for customer ID:', customerId);
        
        const data = customersArray?.find((c: any) => c._id === customerId);
        console.log('Found customer:', data);
        
        if (data) {
          setCustomer(data);
          
          // Initialize form with customer data
          setFormData({
            name: data.name || '',
            primaryContact: data.contact?.[0] || '',
            alternateContact: data.contact?.[1] || '',
            email: data.email || '',
            address: data.address || '',
            notes: data.notes || '',
          });
        } else {
          console.error('Customer not found in response. Available IDs:', 
            customersArray?.map((c: any) => c._id) || 'none');
        }
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        name: formData.name,
        contact: [formData.primaryContact, formData.alternateContact].filter(Boolean),
        email: formData.email || undefined,
        address: formData.address || undefined,
        notes: formData.notes || undefined,
      };

      await updateMutation.mutate(customerId, updateData);
      setIsEditMode(false);
      onSuccess();
      
      // Refresh customer data
      const response = await getCustomersWithBalance();
      const customersArray = response?.data || response;
      const updatedData = customersArray?.find((c: any) => c._id === customerId);
      if (updatedData) {
        setCustomer(updatedData);
      }
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutate(customerId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleCancel = () => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        primaryContact: customer.contact?.[0] || '',
        alternateContact: customer.contact?.[1] || '',
        email: customer.email || '',
        address: customer.address || '',
        notes: customer.notes || '',
      });
    }
    setIsEditMode(false);
  };

  const formatCurrency = (amount: number) => `Rs. ${Math.round(amount || 0).toLocaleString('en-NP')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base">
              {customer?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{customer?.name || 'Customer Details'}</h2>
              
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Icon name="X" size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Icon name="Loader2" size={32} className="animate-spin text-blue-600" />
            </div>
          ) : customer ? (
            <div>
              {/* Customer Information */}
              <div className="p-5 space-y-4 border-b border-slate-200">
                {/* Name - Always show */}
                {isEditMode ? (
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                      <Icon name="User" size={14} className="text-blue-600" />
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Icon name="User" size={16} className="text-slate-400" />
                    <span className="font-semibold">{customer.name}</span>
                  </div>
                )}

                {/* Primary Contact - Show if exists or in edit mode */}
                {(isEditMode || customer.contact?.[0]) && (
                  <div>
                    {isEditMode ? (
                      <>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                          <Icon name="Phone" size={14} className="text-blue-600" />
                          Primary Contact
                        </label>
                        <input
                          type="tel"
                          name="primaryContact"
                          value={formData.primaryContact}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter primary contact number"
                        />
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Icon name="Phone" size={16} className="text-slate-400" />
                        <span>{customer.contact?.[0]}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Alternate Contact - Show if exists or in edit mode */}
                {(isEditMode || customer.contact?.[1]) && (
                  <div>
                    {isEditMode ? (
                      <>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                          <Icon name="Phone" size={14} className="text-green-600" />
                          Alternate Contact
                        </label>
                        <input
                          type="tel"
                          name="alternateContact"
                          value={formData.alternateContact}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter alternate contact number"
                        />
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Icon name="Phone" size={16} className="text-slate-400" />
                        <span>{customer.contact?.[1]}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Email - Show if exists or in edit mode */}
                {(isEditMode || customer.email) && (
                  <div>
                    {isEditMode ? (
                      <>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                          <Icon name="Mail" size={14} className="text-blue-600" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Icon name="Mail" size={16} className="text-slate-400" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Address - Show if exists or in edit mode */}
                {(isEditMode || customer.address) && (
                  <div>
                    {isEditMode ? (
                      <>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                          <Icon name="MapPin" size={14} className="text-blue-600" />
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Enter address"
                        />
                      </>
                    ) : (
                      <div className="flex items-start gap-2 text-slate-700">
                        <Icon name="MapPin" size={16} className="text-slate-400 mt-0.5" />
                        <span>{customer.address}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes - Show if exists or in edit mode */}
                {(isEditMode || customer.notes) && (
                  <div>
                    {isEditMode ? (
                      <>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                          <Icon name="FileText" size={14} className="text-blue-600" />
                          Notes
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Add notes about this customer..."
                        />
                      </>
                    ) : (
                      <div className="flex items-start gap-2 text-slate-700">
                        <Icon name="FileText" size={16} className="text-slate-400 mt-0.5" />
                        <span className="text-sm">{customer.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Outstanding Balance Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">Outstanding Balance</p>
                    <p className={`text-2xl font-bold ${
                      (customer.balance || 0) > 0 
                        ? 'text-red-600' 
                        : (customer.balance || 0) < 0 
                        ? 'text-green-600' 
                        : 'text-slate-700'
                    }`}>
                      {formatCurrency(Math.abs(customer.balance || 0))}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {(customer.balance || 0) > 0 ? 'Due' : (customer.balance || 0) < 0 ? 'Advance' : 'Settled'}
                    </p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <div>
                      <p className="text-[10px] text-slate-500">Total Credit</p>
                      <p className="text-xs font-semibold text-slate-700">
                        {formatCurrency(customer.totalCredit || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Total Paid</p>
                      <p className="text-xs font-semibold text-green-600">
                        {formatCurrency(customer.totalPaid || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          {!isEditMode ? (
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 text-sm px-3 py-1.5 h-auto"
                disabled={deleteMutation.loading}
              >
                <Icon name="Trash2" size={16} className="mr-1.5" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-sm px-4 py-1.5 h-auto"
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => setIsEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-1.5 h-auto"
                >
                  <Icon name="Edit" size={16} className="mr-1.5" />
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateMutation.loading}
                className="text-sm px-4 py-1.5 h-auto"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={updateMutation.loading || !formData.name.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-1.5 h-auto"
              >
                {updateMutation.loading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={16} className="mr-1.5" />
                    Save
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Delete Customer</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-slate-700 mb-6">
                Are you sure you want to delete <strong>{customer?.name}</strong>? All associated 
                transaction history will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteMutation.loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleDelete}
                  disabled={deleteMutation.loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteMutation.loading ? (
                    <>
                      <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Icon name="Trash2" size={18} className="mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
