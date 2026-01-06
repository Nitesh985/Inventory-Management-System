import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

interface ExpenseData {
  amount: string;
  category: string;
  vendor: string;
  date: string;
  description: string;
  isTaxRelated: boolean;
  customCategory: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseData) => void;
  onSaveDraft: (data: ExpenseData) => void;
  isLoading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onSaveDraft, isLoading = false }) => {
  const [formData, setFormData] = useState<ExpenseData>({
    amount: '',
    category: '',
    vendor: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    description: '',
    isTaxRelated: false,
    customCategory: ''
  });

  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const expenseCategories = [
    { value: 'office-supplies', label: 'Office Supplies' },
    { value: 'travel', label: 'Travel & Transportation' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'equipment', label: 'Equipment & Software' },
    { value: 'professional-services', label: 'Professional Services' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'rent', label: 'Rent & Facilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'maintenance', label: 'Maintenance & Repairs' },
    { value: 'custom', label: '+ Add Custom Category' }
  ];

  const vendors = [
    { value: 'amazon', label: 'Amazon Business' },
    { value: 'staples', label: 'Staples' },
    { value: 'fedex', label: 'FedEx' },
    { value: 'uber', label: 'Uber for Business' },
    { value: 'google', label: 'Google Workspace' },
    { value: 'microsoft', label: 'Microsoft' },
    { value: 'local-supplier', label: 'Local Supplier' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: keyof ExpenseData, value: string | boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryChange = (value: string): void => {
    if (value === 'custom') {
      setShowCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowCustomCategory(false);
      setFormData(prev => ({ ...prev, category: value, customCategory: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData?.category && !formData?.customCategory) {
      newErrors.category = 'Please select or enter a category';
    }
    
    if (!formData?.vendor) {
      newErrors.vendor = 'Please select a vendor';
    }
    
    if (!formData?.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData?.description?.trim()) {
      newErrors.description = 'Please enter a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const finalCategory = formData?.customCategory || formData?.category;
      onSubmit({ ...formData, category: finalCategory });
      
      // Reset form after successful submission
      setFormData({
        amount: '',
        category: '',
        vendor: '',
        date: new Date()?.toISOString()?.split('T')?.[0],
        description: '',
        isTaxRelated: false,
        customCategory: ''
      });
      setShowCustomCategory(false);
      setErrors({});
    }
  };

  const handleSaveDraft = () => {
    const finalCategory = formData?.customCategory || formData?.category;
    onSaveDraft({ ...formData, category: finalCategory });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="Receipt" size={20} className="text-warning" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Record Expense</h2>
          <p className="text-sm text-muted-foreground">Add a new business expense with receipt</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Expense Amount"
            type="number"
            placeholder="0.00"
            value={formData?.amount}
            onChange={(e) => handleInputChange('amount', e?.target?.value)}
            error={errors?.amount}
            required
            min="0"
            step="0.01"
          />

          <Input
            label="Expense Date"
            type="date"
            value={formData?.date}
            onChange={(e) => handleInputChange('date', e?.target?.value)}
            error={errors?.date}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              label="Category"
              options={expenseCategories}
              value={formData?.category}
              onChange={handleCategoryChange}
              error={errors?.category}
              placeholder="Select expense category"
              required
            />
            
            {showCustomCategory && (
              <Input
                label="Custom Category Name"
                type="text"
                placeholder="Enter custom category"
                value={formData?.customCategory}
                onChange={(e) => handleInputChange('customCategory', e?.target?.value)}
                className="mt-3"
                required
              />
            )}
          </div>

          <Select
            label="Vendor/Supplier"
            options={vendors}
            value={formData?.vendor}
            onChange={(value) => handleInputChange('vendor', value)}
            error={errors?.vendor}
            placeholder="Select vendor"
            searchable
            required
          />
        </div>

        <Input
          label="Description"
          type="text"
          placeholder="Brief description of the expense"
          value={formData?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          error={errors?.description}
          required
        />

        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
          <input
            type="checkbox"
            id="taxRelated"
            checked={formData?.isTaxRelated}
            onChange={(e) => handleInputChange('isTaxRelated', e?.target?.checked)}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="taxRelated" className="text-sm font-medium text-foreground">
            This is a tax-deductible business expense
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Plus"
            iconPosition="left"
            className="flex-1"
          >
            Record Expense
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            iconName="Save"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;