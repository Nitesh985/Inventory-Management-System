import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';

interface Preferences {
  syncFrequency: string;
  backupFrequency: string;
  dataRetention: string;
  autoSync: boolean;
  compressBackups: boolean;
  lowStockAlerts: boolean;
  dailySummary: boolean;
  syncNotifications: boolean;
  backupReminders: boolean;
  browserNotifications: boolean;
  [key: string]: string | boolean;
}

interface SystemPreferencesSectionProps {
  preferences: Preferences;
  onUpdate: (data: Preferences) => void;
}

const SystemPreferencesSection: React.FC<SystemPreferencesSectionProps> = ({ preferences, onUpdate }) => {
  const [formData, setFormData] = useState<Preferences>(preferences);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const syncFrequencyOptions = [
    { value: 'realtime', label: 'Real-time (when online)' },
    { value: '5min', label: 'Every 5 minutes' },
    { value: '15min', label: 'Every 15 minutes' },
    { value: '30min', label: 'Every 30 minutes' },
    { value: '1hour', label: 'Every hour' },
    { value: 'manual', label: 'Manual sync only' }
  ];

  const backupFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'manual', label: 'Manual backup only' }
  ];

  const storageRetentionOptions = [
    { value: '30days', label: '30 days' },
    { value: '90days', label: '90 days' },
    { value: '6months', label: '6 months' },
    { value: '1year', label: '1 year' },
    { value: 'forever', label: 'Keep forever' }
  ];

  const handleSelectChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCheckboxChange = (field: string, checked: boolean): void => {
    setFormData(prev => ({ ...prev, [field]: checked }));
    setHasChanges(true);
  };

  const handleSave = (): void => {
    onUpdate(formData);
    setHasChanges(false);
  };

  const handleReset = (): void => {
    setFormData(preferences);
    setHasChanges(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">System Preferences</h3>
            <p className="text-sm text-muted-foreground">Configure sync, backup, and notification settings</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sync & Backup Settings */}
        <div className="space-y-6">
          <h4 className="font-medium text-foreground">Sync & Backup</h4>
          
          <Select
            label="Sync Frequency"
            description="How often to sync data with cloud"
            options={syncFrequencyOptions}
            value={formData?.syncFrequency}
            onChange={(value) => handleSelectChange('syncFrequency', value)}
          />

          <Select
            label="Backup Frequency"
            description="Automatic backup schedule"
            options={backupFrequencyOptions}
            value={formData?.backupFrequency}
            onChange={(value) => handleSelectChange('backupFrequency', value)}
          />

          <Select
            label="Data Retention"
            description="How long to keep offline data"
            options={storageRetentionOptions}
            value={formData?.dataRetention}
            onChange={(value) => handleSelectChange('dataRetention', value)}
          />

          <div className="space-y-3">
            <Checkbox
              label="Auto-sync when online"
              description="Automatically sync data when internet connection is restored"
              checked={formData?.autoSync}
              onChange={(e) => handleCheckboxChange('autoSync', e?.target?.checked)}
            />

            <Checkbox
              label="Compress backups"
              description="Reduce backup file size (recommended)"
              checked={formData?.compressBackups}
              onChange={(e) => handleCheckboxChange('compressBackups', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <h4 className="font-medium text-foreground">Notifications</h4>
          
          <div className="space-y-3">
            <Checkbox
              label="Low stock alerts"
              description="Get notified when inventory is running low"
              checked={formData?.lowStockAlerts}
              onChange={(e) => handleCheckboxChange('lowStockAlerts', e?.target?.checked)}
            />

            <Checkbox
              label="Daily sales summary"
              description="Receive daily sales performance summary"
              checked={formData?.dailySummary}
              onChange={(e) => handleCheckboxChange('dailySummary', e?.target?.checked)}
            />

            <Checkbox
              label="Sync status notifications"
              description="Show notifications for sync success/failure"
              checked={formData?.syncNotifications}
              onChange={(e) => handleCheckboxChange('syncNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="Backup reminders"
              description="Remind to backup data manually"
              checked={formData?.backupReminders}
              onChange={(e) => handleCheckboxChange('backupReminders', e?.target?.checked)}
            />

            <Checkbox
              label="Browser notifications"
              description="Allow browser push notifications"
              checked={formData?.browserNotifications}
              onChange={(e) => handleCheckboxChange('browserNotifications', e?.target?.checked)}
            />
          </div>

          {/* Storage Usage */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h5 className="font-medium text-foreground mb-3">Storage Usage</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Local Storage</span>
                <span className="font-medium">2.4 MB / 10 MB</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cloud Storage</span>
                <span className="font-medium">156 MB / 1 GB</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '15.6%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Reset Changes
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Preferences
          </Button>
        </div>
      )}
    </div>
  );
};

export default SystemPreferencesSection;