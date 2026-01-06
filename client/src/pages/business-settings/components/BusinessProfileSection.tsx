import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { getActiveShopProfile, updateActiveShopProfile, type ShopProfile, type UpdateShopProfileDTO } from '../../../api/shops';

interface BusinessProfileSectionProps {
  onUpdate?: () => void;
}

// Nepal provinces
const provinceOptions = [
  { value: 'Koshi', label: 'Koshi (Province 1)' },
  { value: 'Madhesh', label: 'Madhesh (Province 2)' },
  { value: 'Bagmati', label: 'Bagmati (Province 3)' },
  { value: 'Gandaki', label: 'Gandaki (Province 4)' },
  { value: 'Lumbini', label: 'Lumbini (Province 5)' },
  { value: 'Karnali', label: 'Karnali (Province 6)' },
  { value: 'Sudurpashchim', label: 'Sudurpashchim (Province 7)' },
];

// Nepal districts (major ones)
const districtOptions = [
  { value: 'Kathmandu', label: 'Kathmandu' },
  { value: 'Lalitpur', label: 'Lalitpur' },
  { value: 'Bhaktapur', label: 'Bhaktapur' },
  { value: 'Kaski', label: 'Kaski (Pokhara)' },
  { value: 'Chitwan', label: 'Chitwan' },
  { value: 'Morang', label: 'Morang' },
  { value: 'Rupandehi', label: 'Rupandehi' },
  { value: 'Jhapa', label: 'Jhapa' },
  { value: 'Sunsari', label: 'Sunsari' },
  { value: 'Parsa', label: 'Parsa' },
  { value: 'Other', label: 'Other' },
];

const currencyOptions = [
  { value: 'NPR', label: 'Nepali Rupee (Rs.)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'USD', label: 'US Dollar ($)' },
];

const businessTypeOptions = [
  { value: 'Retail Store', label: 'Retail Store' },
  { value: 'Restaurant/Food', label: 'Restaurant/Food' },
  { value: 'Service Provider', label: 'Service Provider' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Other', label: 'Other' },
];

const BusinessProfileSection: React.FC<BusinessProfileSectionProps> = ({ onUpdate }) => {
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
  const [formData, setFormData] = useState<UpdateShopProfileDTO>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch shop profile on mount
  useEffect(() => {
    fetchShopProfile();
  }, []);

  const fetchShopProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getActiveShopProfile();
      setShopProfile(response.data);
      setFormData({
        name: response.data.name,
        businessType: response.data.businessType,
        panNumber: response.data.panNumber || '',
        vatNumber: response.data.vatNumber || '',
        currency: response.data.currency || 'NPR',
        address: response.data.address || '',
        city: response.data.city || '',
        district: response.data.district || '',
        province: response.data.province || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
        website: response.data.website || '',
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load business profile');
      console.error('Error fetching shop profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateShopProfileDTO, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async (): Promise<void> => {
    try {
      setIsSaving(true);
      const response = await updateActiveShopProfile(formData);
      setShopProfile(response.data);
      setIsEditing(false);
      setHasChanges(false);
      onUpdate?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update business profile');
      console.error('Error updating shop profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (): void => {
    if (shopProfile) {
      setFormData({
        name: shopProfile.name,
        businessType: shopProfile.businessType,
        panNumber: shopProfile.panNumber || '',
        vatNumber: shopProfile.vatNumber || '',
        currency: shopProfile.currency || 'NPR',
        address: shopProfile.address || '',
        city: shopProfile.city || '',
        district: shopProfile.district || '',
        province: shopProfile.province || '',
        phone: shopProfile.phone || '',
        email: shopProfile.email || '',
        website: shopProfile.website || '',
      });
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading business profile...</span>
        </div>
      </div>
    );
  }

  if (error && !shopProfile) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Icon name="AlertCircle" size={48} className="text-destructive mb-4" />
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchShopProfile}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Building2" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Business Profile</h3>
            <p className="text-sm text-muted-foreground">Manage your business information and preferences</p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground mb-3">Basic Information</h4>
          
          <Input
            label="Business Name"
            type="text"
            value={formData?.name || ''}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            disabled={!isEditing}
            required
            placeholder="Enter your business name"
          />

          <Select
            label="Business Type"
            options={businessTypeOptions}
            value={formData?.businessType || ''}
            onChange={(value) => handleInputChange('businessType', value)}
            disabled={!isEditing}
            placeholder="Select business type"
          />

          <Input
            label="PAN Number"
            type="text"
            value={formData?.panNumber || ''}
            onChange={(e) => handleInputChange('panNumber', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Permanent Account Number"
          />

          <Input
            label="VAT Number"
            type="text"
            value={formData?.vatNumber || ''}
            onChange={(e) => handleInputChange('vatNumber', e?.target?.value)}
            disabled={!isEditing}
            placeholder="VAT registration number (if applicable)"
          />

          <Select
            label="Currency"
            options={currencyOptions}
            value={formData?.currency || 'NPR'}
            onChange={(value) => handleInputChange('currency', value)}
            disabled={!isEditing}
            placeholder="Select currency"
          />
        </div>

        {/* Contact & Location Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground mb-3">Contact Information</h4>
          
          <Input
            label="Address"
            type="text"
            value={formData?.address || ''}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Enter business address"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              value={formData?.city || ''}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              disabled={!isEditing}
              placeholder="City or municipality"
            />

            <Select
              label="District"
              options={districtOptions}
              value={formData?.district || ''}
              onChange={(value) => handleInputChange('district', value)}
              disabled={!isEditing}
              placeholder="Select district"
            />
          </div>

          <Select
            label="Province"
            options={provinceOptions}
            value={formData?.province || ''}
            onChange={(value) => handleInputChange('province', value)}
            disabled={!isEditing}
            placeholder="Select province"
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone || ''}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            disabled={!isEditing}
            placeholder="+977-"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData?.email || ''}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            placeholder="email@example.com"
          />

          {/* <Input
            label="Website"
            type="url"
            value={formData?.website || ''}
            onChange={(e) => handleInputChange('website', e?.target?.value)}
            disabled={!isEditing}
            placeholder="https://www.example.com"
          /> */}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            iconName={isSaving ? "Loader2" : "Save"}
            iconPosition="left"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BusinessProfileSection;