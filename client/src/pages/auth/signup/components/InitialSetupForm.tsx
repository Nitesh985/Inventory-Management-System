import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PhoneInput from 'react-phone-input-2';
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';

import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import Icon from '../../../../components/AppIcon';

import 'react-phone-input-2/lib/style.css';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

const setupSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.string().min(1, 'Please select a business type'),
  phoneNumber: z.string().min(5, 'Valid phone number is required'),
  currency: z.string().min(1, 'Currency is required'),
  address: z.string().min(3, 'Please select a valid address from the list'),
  countryCode: z.string().optional(),
});

type SetupFormData = z.infer<typeof setupSchema>;

interface InitialSetupFormProps {
  onSubmit: (data: SetupFormData) => void;
  isLoading?: boolean;
}

const InitialSetupForm = ({ onSubmit, isLoading }: InitialSetupFormProps) => {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      currency: 'NPR',
      countryCode: 'np',
      phoneNumber: '',
      address: '',
      businessType: ''
    }
  });

  const selectedCountry = watch('countryCode');
  const currentCurrency = watch('currency');

  const businessTypes = [
    { value: 'retail', label: 'Retail Store' },
    { value: 'service', label: 'Service Provider' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'restaurant', label: 'Restaurant/Food' },
    { value: 'other', label: 'Other' }
  ];

  const currencies = [
    { value: 'NPR', label: 'NPR - Nepalese Rupee' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' }
  ];

  const countryToCurrency: Record<string, string> = {
    np: 'NPR', in: 'INR', us: 'USD', gb: 'GBP', ae: 'AED', au: 'AUD', ca: 'CAD'
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="Building2" size={20} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Workspace Details</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 ">
        <Input div className=''
          label="Business Name"
          placeholder="e.g. Digital Khata Store"
          {...register('businessName')}
          error={errors.businessName?.message}
          disabled={isLoading}
        />

        <Select
          label="Business Type"
          options={businessTypes}
          placeholder="Select Type"
          value={watch('businessType')}
          onChange={(val) => setValue('businessType', val as string)}
          error={errors.businessType?.message}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-foreground/80 ml-1">Business Phone</label>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <PhoneInput
                country={'np'}
                value={field.value}
                onChange={(value, countryData: any) => {
                  field.onChange(value);
                  const iso = countryData.countryCode;
                  setValue('countryCode', iso);
                  if (countryToCurrency[iso]) setValue('currency', countryToCurrency[iso]);
                }}
                containerClass="!w-full"
                inputClass="!w-full !h-11 !rounded-xl !border-border !bg-background !text-foreground !pl-12"
                buttonClass="!bg-background !border-border !rounded-l-xl"
                disabled={isLoading}
              />
            )}
          />
          {errors.phoneNumber && <p className="text-xs text-destructive mt-1">{errors.phoneNumber.message}</p>}
        </div>

        <Select
          label="Base Currency"
          options={currencies}
          value={watch('currency')}
          onChange={(val) => setValue('currency', val as string)}
          error={errors.currency?.message}
          disabled={isLoading}
        />
      </div>

      {/* FIXED ADDRESS AUTOCOMPLETE SECTION */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground/80 ml-1">Business Address</label>
        <div className={`geoapify-container-custom border rounded-xl overflow-visible transition-all ${errors.address ? 'border-destructive' : 'border-border'}`}>
          <GeoapifyContext apiKey={apiKey}>
            <GeoapifyGeocoderAutocomplete
              placeholder="Start typing your address..."
              type="city"
              // countryCodes expects an array of strings
              countryCodes={selectedCountry ? [selectedCountry] : undefined}
              value={watch('address')}
              placeSelect={(value) => {
                const formatted = value?.properties?.formatted || "";
                setValue('address', formatted, { shouldValidate: true });
              }}
              // Trigger search on change
              suggestionsChange={(suggestions) => console.log('Suggestions:', suggestions)}
            />
          </GeoapifyContext>
        </div>
        {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
      </div>

      <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex items-start space-x-3">
        <Icon name="Info" size={18} className="text-primary mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          The base currency is set to <b>{currentCurrency}</b> based on your phone number.
        </p>
      </div>

      <Button type="submit" fullWidth size="lg" loading={isLoading} iconName="ArrowRight" iconPosition="right">
        Complete Setup & Start
      </Button>

      <style>{`
        /* 1. Reset Geoapify Wrapper */
        .geoapify-autocomplete-items {
          background-color: slate black !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.75rem !important;
          margin-top: 8px !important;
          color: hsl(var(--foreground)) !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          z-index: 9999 !important;
          position: absolute !important;
          width: 100%;
        }

        /* 2. Style each suggestion item */
        .geoapify-autocomplete-item {
          padding: 12px 16px !important;
          font-size: 0.875rem !important;
          cursor: pointer !important;
        }

        .geoapify-autocomplete-item:hover {
          background-color: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
        }

        /* 3. Style the Input inside the Geocoder */
        .geocoder-container input {
          background-color: transparent !important;
          color: hsl(var(--foreground)) !important;
          border: none !important;
          height: 44px !important;
          padding: 0 12px !important;
          width: 100% !important;
          font-size: 0.875rem !important;
          outline: none !important;
        }

        .geocoder-container input::placeholder {
          color: hsl(var(--muted-foreground)) !important;
        }

        /* Clear button inside input */
        .geoapify-close-button {
          color: hsl(var(--muted-foreground)) !important;
        }
      `}</style>
    </form>
  );
};

export default InitialSetupForm;