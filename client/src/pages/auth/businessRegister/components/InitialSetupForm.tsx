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

// 1. Validation Schema
const setupSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.string().min(1, 'Please select a business type'),
  phoneNumber: z.string().min(5, 'Valid phone number is required'),
  currency: z.string().min(1, 'Currency is required'),
  address: z.string().min(3, 'Please select a valid address'),
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
      address: ''
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

      {/* Row 1: Business Name & Type (Merged from RegistrationForm) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
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
          onChange={(val: string) => setValue('businessType', val)}
          error={errors.businessType?.message}
          disabled={isLoading}
        />
      </div>

      {/* Row 2: Phone & Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80 ml-1">Business Phone</label>
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
          onChange={(val: string) => setValue('currency', val)}
          error={errors.currency?.message}
          disabled={isLoading}
        />
      </div>

      {/* Row 3: Address Autocomplete */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground/80 ml-1">Business Address</label>
        <div className="geoapify-container-custom border border-border rounded-xl overflow-hidden">
          <GeoapifyContext apiKey={apiKey}>
            <GeoapifyGeocoderAutocomplete
              placeholder="Search for your city or street..."
              type="city"
              countryCodes={selectedCountry ? [selectedCountry as any] : []}
              lang="en"
              placeSelect={(value) => setValue('address', value?.properties?.formatted || '')}
            />
          </GeoapifyContext>
        </div>
        {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
      </div>

      <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex items-start space-x-3">
        <Icon name="Info" size={18} className="text-primary mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your workspace will be configured with <b>{currentCurrency}</b>. You can change regional settings later in the dashboard.
        </p>
      </div>

      <Button type="submit" fullWidth size="lg" loading={isLoading} iconName="ArrowRight" iconPosition="right">
        Complete Setup & Start
      </Button>

      <style>{`
        .geoapify-wrapper .geocoder-container input {
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          border: none !important;
          height: 44px !important;
          padding: 0 12px !important;
          width: 100% !important;
        }
        .geoapify-autocomplete-items {
          background-color: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          color: hsl(var(--foreground)) !important;
          z-index: 99;
        }
      `}</style>
    </form>
  );
};

export default InitialSetupForm;