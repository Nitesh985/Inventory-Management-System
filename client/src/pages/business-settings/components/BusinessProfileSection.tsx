import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BusinessProfileSection = ({ businessData, onUpdate }) => {
  const [formData, setFormData] = useState(businessData);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' }
  ];

  const businessTypeOptions = [
    { value: 'retail', label: 'Retail Store' },
    { value: 'restaurant', label: 'Restaurant/Food Service' },
    { value: 'service', label: 'Service Business' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setFormData(businessData);
    setIsEditing(false);
    setHasChanges(false);
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground mb-3">Basic Information</h4>
          
          <Input
            label="Business Name"
            type="text"
            value={formData?.businessName}
            onChange={(e) => handleInputChange('businessName', e?.target?.value)}
            disabled={!isEditing}
            required
            placeholder="Enter your business name"
          />

          <Select
            label="Business Type"
            options={businessTypeOptions}
            value={formData?.businessType}
            onChange={(value) => handleInputChange('businessType', value)}
            disabled={!isEditing}
            placeholder="Select business type"
          />

          <Input
            label="Tax ID / Registration Number"
            type="text"
            value={formData?.taxId}
            onChange={(e) => handleInputChange('taxId', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Enter tax identification number"
          />

          <Select
            label="Primary Currency"
            options={currencyOptions}
            value={formData?.currency}
            onChange={(value) => handleInputChange('currency', value)}
            disabled={!isEditing}
            placeholder="Select primary currency"
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground mb-3">Contact Information</h4>
          
          <Input
            label="Business Address"
            type="text"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Enter business address"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              value={formData?.city}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Enter city"
            />

            <Input
              label="Postal Code"
              type="text"
              value={formData?.postalCode}
              onChange={(e) => handleInputChange('postalCode', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Enter postal code"
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Enter phone number"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Enter email address"
          />
        </div>
      </div>
      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!hasChanges}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default BusinessProfileSection;