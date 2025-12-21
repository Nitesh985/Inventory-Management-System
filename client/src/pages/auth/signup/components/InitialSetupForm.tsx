// client/src/pages/auth/signup/components/InitialSetupForm.tsx
import React, { useState } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import Icon from '../../../../components/AppIcon';

// New Imports
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';
// import '@geoapify/geocoder-autocomplete/styles/minimal.css';

interface InitialSetupFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const InitialSetupForm = ({ onSubmit, isLoading }: InitialSetupFormProps) => {
  const [formData, setFormData] = useState({
    currency: 'NPR',
    address: '',
    phoneNumber: '',
    countryCode: 'np'
  });

  // Mapping for auto-currency selection
  const countryToCurrency: Record<string, string> = {
    np: 'NPR', // Nepal
    in: 'INR', // India
    us: 'USD', // USA
    gb: 'GBP', // UK
    ae: 'AED', // UAE
    au: 'AUD', // Australia
    ca: 'CAD', // Canada
    // Add more as your business expands
  };

  const currencies = [
    { value: 'NPR', label: 'NPR - Nepalese Rupee' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' }
  ];

  // Logic: When country changes in Phone Input, update currency
  const handlePhoneChange = (value: string, countryData: any) => {
    const isoCode = countryData.countryCode; // e.g., 'np'
    const autoCurrency = countryToCurrency[isoCode] || formData.currency;
    
    setFormData({
      ...formData,
      phoneNumber: value,
      countryCode: isoCode,
      currency: autoCurrency
    });
  };

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
        {/* Phone Number with Country Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80 ml-1">Business Phone</label>
          <PhoneInput
            country={'np'}
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            containerClass="!w-full"
            inputClass="!w-full !h-11 !rounded-xl !border-border !bg-background !text-foreground !pl-12"
            buttonClass="!bg-background !border-border !rounded-l-xl"
            dropdownClass="!bg-background !text-foreground"
          />
        </div>

        {/* Currency (Auto-filled but can be changed) */}
        <Select
          label="Base Currency"
          options={currencies}
          value={formData.currency}
          onChange={(val) => setFormData({...formData, currency: val as string})}
          required
        />
      </div>

      {/* Address Autocomplete using Geoapify (FREE) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground/80 ml-1">Business Address</label>
        <div className="geoapify-wrapper rounded-xl border border-border bg-background overflow-hidden">
          <GeoapifyContext apiKey="003923a104f647c0936336307137452d"> 
            <GeoapifyGeocoderAutocomplete
              placeholder="Search your business address..."
              type={"address"}
              placeSelect={(value) => {
                setFormData({...formData, address: value?.properties?.formatted || ''});
              }}
            />
          </GeoapifyContext>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={18} className="text-primary mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Selecting your country automatically sets your currency to <b>{formData.currency}</b>. 
            You can verify your address using the search box above.
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

      {/* Custom styles to match your theme */}
      <style>{`
        .geoapify-wrapper .geocoder-container input {
          background-color: transparent !important;
          color: inherit !important;
          border: none !important;
          height: 44px !important;
          padding-left: 12px !important;
          width: 100% !important;
        }
        .geoapify-wrapper .geocoder-container {
          border: none !important;
        }
      `}</style>
    </form>
  );
};

export default InitialSetupForm;