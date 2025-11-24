import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaxConfigurationSection = ({ taxConfig, onUpdate }) => {
  const [formData, setFormData] = useState(taxConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', rate: '', description: '' });

  const taxRegionOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'eu', label: 'European Union' },
    { value: 'in', label: 'India' },
    { value: 'au', label: 'Australia' },
    { value: 'other', label: 'Other' }
  ];

  const reportingPeriodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...formData?.taxCategories];
    updatedCategories[index] = { ...updatedCategories?.[index], [field]: value };
    setFormData(prev => ({ ...prev, taxCategories: updatedCategories }));
    setHasChanges(true);
  };

  const handleAddCategory = () => {
    if (newCategory?.name && newCategory?.rate) {
      const updatedCategories = [...formData?.taxCategories, {
        id: Date.now()?.toString(),
        ...newCategory,
        rate: parseFloat(newCategory?.rate)
      }];
      setFormData(prev => ({ ...prev, taxCategories: updatedCategories }));
      setNewCategory({ name: '', rate: '', description: '' });
      setShowAddCategory(false);
      setHasChanges(true);
    }
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = formData?.taxCategories?.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, taxCategories: updatedCategories }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Receipt" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Tax Configuration</h3>
            <p className="text-sm text-muted-foreground">Configure tax rates and reporting settings</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Tax Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground mb-3">General Settings</h4>
          
          <Select
            label="Tax Region"
            description="Select your business tax jurisdiction"
            options={taxRegionOptions}
            value={formData?.taxRegion}
            onChange={(value) => handleInputChange('taxRegion', value)}
          />

          <Input
            label="Default Tax Rate (%)"
            type="number"
            value={formData?.defaultTaxRate}
            onChange={(e) => handleInputChange('defaultTaxRate', parseFloat(e?.target?.value) || 0)}
            placeholder="Enter default tax rate"
            min="0"
            max="100"
            step="0.01"
          />

          <Select
            label="Reporting Period"
            description="How often you file tax reports"
            options={reportingPeriodOptions}
            value={formData?.reportingPeriod}
            onChange={(value) => handleInputChange('reportingPeriod', value)}
          />

          <Input
            label="Tax Registration Number"
            type="text"
            value={formData?.taxRegistrationNumber}
            onChange={(e) => handleInputChange('taxRegistrationNumber', e?.target?.value)}
            placeholder="Enter tax registration number"
          />

          <div className="space-y-3">
            <Checkbox
              label="Include tax in product prices"
              description="Prices shown include tax (tax-inclusive)"
              checked={formData?.taxInclusive}
              onChange={(e) => handleInputChange('taxInclusive', e?.target?.checked)}
            />

            <Checkbox
              label="Auto-calculate tax"
              description="Automatically calculate tax on transactions"
              checked={formData?.autoCalculateTax}
              onChange={(e) => handleInputChange('autoCalculateTax', e?.target?.checked)}
            />

            <Checkbox
              label="Round tax amounts"
              description="Round tax calculations to nearest cent"
              checked={formData?.roundTaxAmounts}
              onChange={(e) => handleInputChange('roundTaxAmounts', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Tax Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Tax Categories</h4>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowAddCategory(true)}
            >
              Add Category
            </Button>
          </div>

          {/* Add New Category Form */}
          {showAddCategory && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <Input
                label="Category Name"
                type="text"
                value={newCategory?.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e?.target?.value }))}
                placeholder="e.g., Food Items, Electronics"
              />

              <Input
                label="Tax Rate (%)"
                type="number"
                value={newCategory?.rate}
                onChange={(e) => setNewCategory(prev => ({ ...prev, rate: e?.target?.value }))}
                placeholder="Enter tax rate"
                min="0"
                max="100"
                step="0.01"
              />

              <Input
                label="Description (Optional)"
                type="text"
                value={newCategory?.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e?.target?.value }))}
                placeholder="Brief description of this category"
              />

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategory({ name: '', rate: '', description: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddCategory}
                  disabled={!newCategory?.name || !newCategory?.rate}
                >
                  Add Category
                </Button>
              </div>
            </div>
          )}

          {/* Existing Categories */}
          <div className="space-y-3">
            {formData?.taxCategories?.map((category, index) => (
              <div key={category?.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h5 className="font-medium text-foreground">{category?.name}</h5>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                        {category?.rate}%
                      </span>
                    </div>
                    {category?.description && (
                      <p className="text-sm text-muted-foreground">{category?.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCategory(index)}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {formData?.taxCategories?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Receipt" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No tax categories configured</p>
                <p className="text-sm">Add categories to organize different tax rates</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Tax Summary */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h5 className="font-medium text-foreground mb-3">Tax Summary</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Default Rate:</span>
            <span className="ml-2 font-medium">{formData?.defaultTaxRate}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">Categories:</span>
            <span className="ml-2 font-medium">{formData?.taxCategories?.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Reporting:</span>
            <span className="ml-2 font-medium capitalize">{formData?.reportingPeriod}</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => {
              setFormData(taxConfig);
              setHasChanges(false);
            }}
          >
            Reset Changes
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Tax Settings
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaxConfigurationSection;