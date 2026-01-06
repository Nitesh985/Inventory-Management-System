import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import dataManagementApi from '../../../api/data-management';
import type { StorageInfo, BackupInfo } from '../../../api/data-management';

interface DataSettings {
  exportFormat: string;
  exportDataType: string;
  includeDeletedRecords: boolean;
  includeMetadata: boolean;
  autoBackupBeforeSync: boolean;
  includeMediaInBackup: boolean;
  encryptBackups: boolean;
  [key: string]: string | boolean;
}

interface DataManagementSectionProps {
  dataSettings: DataSettings;
  onUpdate: (data: DataSettings) => void;
}

interface Toast {
  type: 'success' | 'error' | 'info';
  message: string;
}

const DataManagementSection: React.FC<DataManagementSectionProps> = ({ dataSettings, onUpdate }) => {
  const [formData, setFormData] = useState<DataSettings>(dataSettings);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: Toast['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch storage and backup info on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storage, backup] = await Promise.all([
          dataManagementApi.getStorageInfo(),
          dataManagementApi.getBackupInfo(),
        ]);
        setStorageInfo(storage);
        setBackupInfo(backup);
      } catch (error) {
        console.error('Failed to fetch data management info:', error);
      }
    };
    fetchData();
  }, []);

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

  const handleSelectChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCheckboxChange = (field: string, checked: boolean): void => {
    setFormData(prev => ({ ...prev, [field]: checked }));
    setHasChanges(true);
  };

  const handleExportData = async (): Promise<void> => {
    setIsExporting(true);
    try {
      await dataManagementApi.exportData({
        format: formData.exportFormat as 'csv' | 'excel' | 'json' | 'pdf',
        dataType: formData.exportDataType as 'all' | 'sales' | 'expenses' | 'inventory' | 'customers' | 'reports',
        includeDeleted: formData.includeDeletedRecords,
        includeMetadata: formData.includeMetadata,
      });
      showToast('success', `Data exported successfully as ${formData?.exportFormat?.toUpperCase()} file!`);
    } catch (error) {
      console.error('Export failed:', error);
      showToast('error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackupNow = async (): Promise<void> => {
    setIsBackingUp(true);
    try {
      await dataManagementApi.createBackup({
        includeMedia: formData.includeMediaInBackup,
        encrypt: formData.encryptBackups,
      });
      showToast('success', 'Backup created and downloaded successfully!');
      // Refresh backup info
      const backup = await dataManagementApi.getBackupInfo();
      setBackupInfo(backup);
    } catch (error) {
      console.error('Backup failed:', error);
      showToast('error', 'Failed to create backup. Please try again.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreData = (): void => {
    // Trigger file input click
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm('Are you sure you want to restore data? This will merge with existing data.')) {
      event.target.value = '';
      return;
    }

    setIsRestoring(true);
    try {
      const results = await dataManagementApi.restoreBackup(file);
      const totalRestored = 
        results.sales.restored + 
        results.expenses.restored + 
        results.inventory.restored + 
        results.customers.restored + 
        results.products.restored;
      showToast('success', `Restored ${totalRestored} records successfully!`);
      // Refresh storage info
      const storage = await dataManagementApi.getStorageInfo();
      setStorageInfo(storage);
    } catch (error) {
      console.error('Restore failed:', error);
      showToast('error', 'Failed to restore backup. Please ensure the file is valid.');
    } finally {
      setIsRestoring(false);
      event.target.value = '';
    }
  };

  const handleClearLocalData = async (): Promise<void> => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone. Consider creating a backup first.')) {
      return;
    }

    setIsClearing(true);
    try {
      const result = await dataManagementApi.clearData();
      const totalDeleted = 
        result.sales + 
        result.expenses + 
        result.inventory + 
        result.customers + 
        result.products;
      showToast('success', `Cleared ${totalDeleted} records successfully.`);
      // Refresh storage info
      const storage = await dataManagementApi.getStorageInfo();
      setStorageInfo(storage);
    } catch (error) {
      console.error('Clear data failed:', error);
      showToast('error', 'Failed to clear data. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    showToast('success', 'Settings saved successfully!');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-in slide-in-from-top-2 ${
            toast.type === 'success' ? 'bg-success text-success-foreground' :
            toast.type === 'error' ? 'bg-destructive text-destructive-foreground' :
            'bg-primary text-primary-foreground'
          }`}
        >
          <Icon 
            name={toast.type === 'success' ? 'CheckCircle' : toast.type === 'error' ? 'XCircle' : 'Info'} 
            size={20} 
          />
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <Icon name="X" size={16} />
          </button>
        </div>
      )}

      {/* Hidden file input for restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept=".json"
        className="hidden"
      />

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
              <h5 className="font-medium text-foreground">Data Summary</h5>
              {backupInfo && (
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="Database" size={16} />
                  <span className="text-sm font-medium">{backupInfo.totalRecords} records</span>
                </div>
              )}
            </div>
            <div className="space-y-2 text-sm">
              {backupInfo ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sales:</span>
                    <span className="font-medium">{backupInfo.breakdown.sales} records</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expenses:</span>
                    <span className="font-medium">{backupInfo.breakdown.expenses} records</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inventory:</span>
                    <span className="font-medium">{backupInfo.breakdown.inventory} records</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customers:</span>
                    <span className="font-medium">{backupInfo.breakdown.customers} records</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Products:</span>
                    <span className="font-medium">{backupInfo.breakdown.products} records</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Estimated Size:</span>
                    <span className="font-medium">{backupInfo.estimatedSizeMB} MB</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-2">Loading...</div>
              )}
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
              loading={isRestoring}
              onClick={handleRestoreData}
            >
              {isRestoring ? 'Restoring...' : 'Restore from Backup'}
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
                <span className="text-sm font-medium">Data Storage Usage</span>
                <span className="text-sm text-muted-foreground">
                  {storageInfo ? `${storageInfo.usedMB} MB / ${storageInfo.maxMB} MB` : 'Loading...'}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    storageInfo && storageInfo.percentage > 80 ? 'bg-destructive' : 'bg-primary'
                  }`} 
                  style={{ width: `${storageInfo?.percentage || 0}%` }}
                ></div>
              </div>
              {storageInfo && storageInfo.percentage > 80 && (
                <p className="text-xs text-destructive mt-1">Storage is running low. Consider exporting and clearing old data.</p>
              )}
            </div>

            <Button
              variant="outline"
              fullWidth
              iconName="Trash2"
              iconPosition="left"
              loading={isClearing}
              onClick={handleClearLocalData}
              className="text-error hover:text-error"
            >
              {isClearing ? 'Clearing Data...' : 'Clear All Data'}
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