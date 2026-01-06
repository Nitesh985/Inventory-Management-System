import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BusinessProfileSection from './components/BusinessProfileSection';
import SystemPreferencesSection from './components/SystemPreferencesSection';
import UserAccountSection from './components/UserAccountSection';
import TaxConfigurationSection from './components/TaxConfigurationSection';
import DataManagementSection from './components/DataManagementSection';
import SyncStatusSection from './components/SyncStatusSection';
import PWASettingsSection from './components/PWASettingsSection';

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
}

interface TaxCategory {
  id: string;
  name: string;
  rate: number;
  description: string;
}

interface TaxConfig {
  taxRegion: string;
  defaultTaxRate: number;
  reportingPeriod: string;
  taxRegistrationNumber: string;
  taxInclusive: boolean;
  autoCalculateTax: boolean;
  roundTaxAmounts: boolean;
  taxCategories: TaxCategory[];
}

interface DataSettings {
  exportFormat: string;
  exportDataType: string;
  includeDeletedRecords: boolean;
  includeMetadata: boolean;
  autoBackupBeforeSync: boolean;
  includeMediaInBackup: boolean;
  encryptBackups: boolean;
}

interface PWASettings {
  offlineMode: boolean;
  cacheData: boolean;
  backgroundSync: boolean;
  pushNotifications: boolean;
  salesAlerts: boolean;
  lowStockWarnings: boolean;
  syncNotifications: boolean;
  autoLaunch: boolean;
  keepScreenAwake: boolean;
  fullscreenMode: boolean;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const BusinessSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Mock data for system preferences
  const [preferences, setPreferences] = useState<Preferences>({
    syncFrequency: "15min",
    backupFrequency: "daily",
    dataRetention: "1year",
    autoSync: true,
    compressBackups: true,
    lowStockAlerts: true,
    dailySummary: true,
    syncNotifications: true,
    backupReminders: false,
    browserNotifications: true
  });

  // Mock data for tax configuration
  const [taxConfig, setTaxConfig] = useState<TaxConfig>({
    taxRegion: "us",
    defaultTaxRate: 8.25,
    reportingPeriod: "quarterly",
    taxRegistrationNumber: "TX-123456789",
    taxInclusive: false,
    autoCalculateTax: true,
    roundTaxAmounts: true,
    taxCategories: [
      {
        id: "1",
        name: "General Sales",
        rate: 8.25,
        description: "Standard sales tax for most items"
      },
      {
        id: "2",
        name: "Food Items",
        rate: 0,
        description: "Tax-exempt food and grocery items"
      },
      {
        id: "3",
        name: "Luxury Goods",
        rate: 12.5,
        description: "Higher tax rate for luxury items"
      }
    ]
  });

  // Mock data for data management
  const [dataSettings, setDataSettings] = useState<DataSettings>({
    exportFormat: "csv",
    exportDataType: "all",
    includeDeletedRecords: false,
    includeMetadata: true,
    autoBackupBeforeSync: true,
    includeMediaInBackup: false,
    encryptBackups: true
  });

  // Mock data for PWA settings
  const [pwaSettings, setPwaSettings] = useState<PWASettings>({
    offlineMode: true,
    cacheData: true,
    backgroundSync: true,
    pushNotifications: false,
    salesAlerts: true,
    lowStockWarnings: true,
    syncNotifications: true,
    autoLaunch: false,
    keepScreenAwake: false,
    fullscreenMode: false
  });

  const tabs: Tab[] = [
    {
      id: 'profile',
      label: 'Business Profile',
      icon: 'Building2',
      description: 'Business information and contact details'
    },
    {
      id: 'system',
      label: 'System Preferences',
      icon: 'Settings',
      description: 'Sync, backup, and notification settings'
    },
    {
      id: 'account',
      label: 'User Account',
      icon: 'User',
      description: 'Account settings and security'
    },
    {
      id: 'tax',
      label: 'Tax Configuration',
      icon: 'Receipt',
      description: 'Tax rates and reporting settings'
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: 'Database',
      description: 'Backup, export, and data retention'
    },
    {
      id: 'sync',
      label: 'Sync Status',
      icon: 'RefreshCw',
      description: 'Cloud synchronization monitoring'
    },
    {
      id: 'pwa',
      label: 'PWA Settings',
      icon: 'Smartphone',
      description: 'Progressive Web App configuration'
    }
  ];

  const handleTabChange = (tabId: string): void => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to switch tabs?')) {
        setActiveTab(tabId);
        setHasUnsavedChanges(false);
      }
    } else {
      setActiveTab(tabId);
    }
  };

  const handlePreferencesUpdate = (data: Preferences): void => {
    setPreferences(data);
    setHasUnsavedChanges(false);
  };

  const handleTaxUpdate = (data: TaxConfig): void => {
    setTaxConfig(data);
    setHasUnsavedChanges(false);
  };

  const handleDataUpdate = (data: DataSettings): void => {
    setDataSettings(data);
    setHasUnsavedChanges(false);
  };

  const handlePWAUpdate = (data: PWASettings): void => {
    setPwaSettings(data);
    setHasUnsavedChanges(false);
  };

  const handleForceSync = (): void => {
    alert('Force sync completed successfully!');
  };

  const handleResolveConflicts = (): void => {
    alert('All conflicts have been resolved.');
  };

  const renderTabContent = (): JSX.Element | null => {
    switch (activeTab) {
      case 'profile':
        return (
          <BusinessProfileSection />
        );
      case 'system':
        return (
          <SystemPreferencesSection
            preferences={preferences}
            onUpdate={handlePreferencesUpdate}
          />
        );
      case 'account':
        return (
          <UserAccountSection
            onUpdate={() => setHasUnsavedChanges(false)}
          />
        );
      case 'tax':
        return (
          <TaxConfigurationSection
            taxConfig={taxConfig}
            onUpdate={handleTaxUpdate}
          />
        );
      case 'data':
        return (
          <DataManagementSection
            dataSettings={dataSettings}
            onUpdate={handleDataUpdate}
          />
        );
      case 'sync':
        return (
          <SyncStatusSection
            syncStatus="online"
            onForceSync={handleForceSync}
            onResolveConflicts={handleResolveConflicts}
          />
        );
      case 'pwa':
        return (
          <PWASettingsSection
            pwaSettings={pwaSettings}
            onUpdate={handlePWAUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Settings" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Business Settings</h1>
                <p className="text-sm text-muted-foreground">Configure your business management system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="RotateCcw"
                iconPosition="left"
                onClick={() => window.location?.reload()}
              >
                Reset All
              </Button>
              <Button
                variant="default"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => window.location.href = '/business-dashboard'}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-8">
              <h3 className="font-semibold text-foreground mb-4">Settings Categories</h3>
              <nav className="space-y-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-smooth ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <Icon 
                      name={tab?.icon} 
                      size={20} 
                      className={`mt-0.5 flex-shrink-0 ${
                        activeTab === tab?.id ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className={`font-medium text-sm ${
                        activeTab === tab?.id ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {tab?.label}
                      </div>
                      <div className={`text-xs mt-1 ${
                        activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}>
                        {tab?.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <div className="bg-card rounded-lg border border-border p-2">
                <div className="flex overflow-x-auto space-x-1">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => handleTabChange(tab?.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md whitespace-nowrap transition-smooth ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="text-sm font-medium">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-warning text-warning-foreground px-4 py-3 rounded-lg shadow-modal">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSettings;