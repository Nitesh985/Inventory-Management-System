import React, { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import Icon from '../../../../components/AppIcon';

interface InitialSetupFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const InitialSetupForm = ({ onSubmit, isLoading }: InitialSetupFormProps) => {
  const [formData, setFormData] = useState({
    currency: 'USD',
    timezone: 'UTC',
    address: '',
    phoneNumber: ''
  });

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'NPR', label: 'NPR - Nepalese Rupee' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'EUR', label: 'EUR - Euro' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="Settings2" size={20} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Configure Your Workspace</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Base Currency"
          options={currencies}
          value={formData.currency}
          onChange={(val) => setFormData({...formData, currency: val as string})}
          required
        />
        <Input
          label="Business Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          required
        />
      </div>

      <Input
        label="Business Address"
        placeholder="123 Street, City, Country"
        value={formData.address}
        onChange={(e) => setFormData({...formData, address: e.target.value})}
        iconName="MapPin"
      />

      <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={18} className="text-primary mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            These settings will be used for your invoices, tax reports, and currency formatting. 
            You can always change these later in Business Settings.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isLoading}
        iconName="ArrowRight"
        iconPosition="right"
      >
        Complete Setup & Start
      </Button>
    </form>
  );
};

export default InitialSetupForm;