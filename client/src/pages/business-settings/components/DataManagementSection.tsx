import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataManagementSection = ({ dataSettings, onUpdate }) => {
  const [formData, setFormData] = useState(dataSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const exportFormatOptions = [
    { value: 'csv', label: 'CSV (Comma Separated Values)' },
    { value: 'excel', label: 'Excel Spreadsheet (.xlsx)' },
    { value: 'json', label: 'JSON (JavaScript Object Notation)' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const dataTypeOptions = [
    { value: 'all', label: 'All Data' },
    { value: 'sales', label: 'Sales Records' },
    { value: 'expenses', label: 'Expense Records' },
    { value: 'inventory', label: 'Inventory Data' },
    { value: 'customers', label: 'Customer Information' },
    { value: 'reports', label: 'Generated Reports' }
  ];

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
    setHasChanges(true);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    // Mock export process
    setTimeout(() => {
      setIsExporting(false);
      alert(`Data exported successfully as ${formData?.exportFormat?.toUpperCase()} file!`);
    }, 2000);
  };

  const handleBackupNow = async () => {
    setIsBackingUp(true);
    // Mock backup process
    setTimeout(() => {
      setIsBackingUp(false);
      alert('Backup completed successfully!');
    }, 3000);
  };

  const handleRestoreData = () => {
    // Mock restore process
    if (confirm('Are you sure you want to restore data? This will overwrite current data.')) {
      alert('Data restore initiated. You will be notified when complete.');
    }
  };

  const handleClearLocalData = () => {
    if (confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      alert('Local data cleared successfully.');
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Database" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
            <p className="text-sm text-muted-foreground">Backup, export, and manage your business data</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Backup & Restore */}
        <div className="space-y-6">
          <h4 className="font-medium text-foreground">Backup & Restore</h4>
          
          {/* Backup Status */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-foreground">Last Backup</h5>
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Success</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">November 3, 2025 at 2:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">2.4 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Records:</span>
                <span className="font-medium">1,247 items</span>
              </div>
            </div>
          </div>

          {/* Backup Actions */}
          <div className="space-y-3">
            <Button
              variant="default"
              fullWidth
              iconName="Download"
              iconPosition="left"
              loading={isBackingUp}
              onClick={handleBackupNow}
            >
              {isBackingUp ? 'Creating Backup...' : 'Backup Now'}
            </Button>

            <Button
              variant="outline"
              fullWidth
              iconName="Upload"
              iconPosition="left"
              onClick={handleRestoreData}
            >
              Restore from Backup
            </Button>
          </div>

          {/* Backup Settings */}
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Backup Settings</h5>
            
            <Checkbox
              label="Auto-backup before sync"
              description="Create backup before syncing with cloud"
              checked={formData?.autoBackupBeforeSync}
              onChange={(e) => handleCheckboxChange('autoBackupBeforeSync', e?.target?.checked)}
            />

            <Checkbox
              label="Include media files"
              description="Backup uploaded images and documents"
              checked={formData?.includeMediaInBackup}
              onChange={(e) => handleCheckboxChange('includeMediaInBackup', e?.target?.checked)}
            />

            <Checkbox
              label="Encrypt backups"
              description="Password protect backup files"
              checked={formData?.encryptBackups}
              onChange={(e) => handleCheckboxChange('encryptBackups', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Data Export */}
        <div className="space-y-6">
          <h4 className="font-medium text-foreground">Data Export</h4>
          
          <Select
            label="Export Format"
            description="Choose the format for exported data"
            options={exportFormatOptions}
            value={formData?.exportFormat}
            onChange={(value) => handleSelectChange('exportFormat', value)}
          />

          <Select
            label="Data to Export"
            description="Select which data to include"
            options={dataTypeOptions}
            value={formData?.exportDataType}
            onChange={(value) => handleSelectChange('exportDataType', value)}
          />

          <div className="space-y-3">
            <Checkbox
              label="Include deleted records"
              description="Export soft-deleted items"
              checked={formData?.includeDeletedRecords}
              onChange={(e) => handleCheckboxChange('includeDeletedRecords', e?.target?.checked)}
            />

            <Checkbox
              label="Include system metadata"
              description="Export creation dates, IDs, etc."
              checked={formData?.includeMetadata}
              onChange={(e) => handleCheckboxChange('includeMetadata', e?.target?.checked)}
            />
          </div>

          <Button
            variant="success"
            fullWidth
            iconName="Download"
            iconPosition="left"
            loading={isExporting}
            onClick={handleExportData}
          >
            {isExporting ? 'Exporting Data...' : 'Export Data'}
          </Button>

          {/* Storage Management */}
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Storage Management</h5>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Local Storage Usage</span>
                <span className="text-sm text-muted-foreground">2.4 MB / 10 MB</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            <Button
              variant="outline"
              fullWidth
              iconName="Trash2"
              iconPosition="left"
              onClick={handleClearLocalData}
              className="text-error hover:text-error"
            >
              Clear Local Data
            </Button>
          </div>
        </div>
      </div>
      {/* Data Retention Policy */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h5 className="font-medium text-foreground mb-3">Data Retention Policy</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Transaction Records:</span>
            <span className="ml-2 font-medium">Keep for 7 years</span>
          </div>
          <div>
            <span className="text-muted-foreground">Customer Data:</span>
            <span className="ml-2 font-medium">Keep until deleted</span>
          </div>
          <div>
            <span className="text-muted-foreground">System Logs:</span>
            <span className="ml-2 font-medium">Keep for 90 days</span>
          </div>
          <div>
            <span className="text-muted-foreground">Backup Files:</span>
            <span className="ml-2 font-medium">Keep for 1 year</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => {
              setFormData(dataSettings);
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
            Save Settings
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataManagementSection;