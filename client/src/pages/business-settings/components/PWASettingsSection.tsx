import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Checkbox from '../../../components/ui/Checkbox';

interface PWASettings {
  offlineMode: boolean;
  pushNotifications: boolean;
  autoSync: boolean;
  cacheMedia: boolean;
  [key: string]: boolean;
}

interface PWASettingsSectionProps {
  pwaSettings: PWASettings;
  onUpdate: (data: PWASettings) => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWASettingsSection: React.FC<PWASettingsSectionProps> = ({ pwaSettings, onUpdate }) => {
  const [formData, setFormData] = useState<PWASettings>(pwaSettings);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'default'>('default');

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)')?.matches) {
      setIsInstalled(true);
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event): void => {
      e?.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleCheckboxChange = (field: string, checked: boolean): void => {
    setFormData(prev => ({ ...prev, [field]: checked }));
    setHasChanges(true);
  };

  const handleInstallApp = async (): Promise<void> => {
    if (installPrompt) {
      const result = await installPrompt?.prompt();
      if (result?.outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
      }
    }
  };

  const handleRequestNotifications = async (): Promise<void> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        handleCheckboxChange('pushNotifications', true);
      }
    }
  };

  const handleTestNotification = (): void => {
    if (notificationPermission === 'granted') {
      new Notification('Digital Khata', {
        body: 'Test notification from your business management app',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const handleClearCache = async (): Promise<void> => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames?.map(name => caches.delete(name)));
      alert('App cache cleared successfully. Please refresh the page.');
    }
  };

  const handleSave = (): void => {
    onUpdate(formData);
    setHasChanges(false);
  };

  const getInstallationStatus = () => {
    if (isInstalled) {
      return { icon: 'CheckCircle', color: 'text-success', text: 'App Installed' };
    } else if (installPrompt) {
      return { icon: 'Download', color: 'text-primary', text: 'Ready to Install' };
    } else {
      return { icon: 'Globe', color: 'text-muted-foreground', text: 'Web Version' };
    }
  };

  const getNotificationStatus = () => {
    switch (notificationPermission) {
      case 'granted':
        return { icon: 'Bell', color: 'text-success', text: 'Enabled' };
      case 'denied':
        return { icon: 'BellOff', color: 'text-error', text: 'Blocked' };
      default:
        return { icon: 'Bell', color: 'text-muted-foreground', text: 'Not Requested' };
    }
  };

  const installStatus = getInstallationStatus();
  const notificationStatus = getNotificationStatus();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Smartphone" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">PWA Settings</h3>
            <p className="text-sm text-muted-foreground">Configure Progressive Web App features</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* App Installation */}
        <div className="space-y-6">
          <h4 className="font-medium text-foreground">App Installation</h4>
          
          {/* Installation Status */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon name={installStatus?.icon} size={20} className={installStatus?.color} />
                <div>
                  <h5 className="font-medium text-foreground">Installation Status</h5>
                  <p className="text-sm text-muted-foreground">{installStatus?.text}</p>
                </div>
              </div>
              {!isInstalled && installPrompt && (
                <Button
                  variant="default"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleInstallApp}
                >
                  Install App
                </Button>
              )}
            </div>
            
            {isInstalled && (
              <div className="text-sm text-success">
                ✓ Digital Khata is installed and can be accessed from your home screen
              </div>
            )}
          </div>

          {/* Offline Features */}
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Offline Features</h5>
            
            <Checkbox
              label="Enable offline mode"
              description="Allow app to work without internet connection"
              checked={formData?.offlineMode}
              onChange={(e) => handleCheckboxChange('offlineMode', e?.target?.checked)}
            />

            <Checkbox
              label="Cache business data"
              description="Store frequently accessed data locally"
              checked={formData?.cacheData}
              onChange={(e) => handleCheckboxChange('cacheData', e?.target?.checked)}
            />

            <Checkbox
              label="Background sync"
              description="Sync data automatically when connection is restored"
              checked={formData?.backgroundSync}
              onChange={(e) => handleCheckboxChange('backgroundSync', e?.target?.checked)}
            />
          </div>

          {/* Cache Management */}
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Cache Management</h5>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">App Cache Size</span>
                <span className="text-sm text-muted-foreground">4.2 MB</span>
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                Includes app resources, images, and offline data
              </div>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Trash2"
                iconPosition="left"
                onClick={handleClearCache}
              >
                Clear Cache
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications & Permissions */}
        <div className="space-y-6">
          <h4 className="font-medium text-foreground">Notifications & Permissions</h4>
          
          {/* Notification Status */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon name={notificationStatus?.icon} size={20} className={notificationStatus?.color} />
                <div>
                  <h5 className="font-medium text-foreground">Push Notifications</h5>
                  <p className="text-sm text-muted-foreground">{notificationStatus?.text}</p>
                </div>
              </div>
              {notificationPermission === 'default' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRequestNotifications}
                >
                  Enable
                </Button>
              )}
            </div>
            
            {notificationPermission === 'granted' && (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Bell"
                iconPosition="left"
                onClick={handleTestNotification}
              >
                Test Notification
              </Button>
            )}
          </div>

          {/* Notification Settings */}
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Notification Types</h5>
            
            <Checkbox
              label="Push notifications"
              description="Receive notifications even when app is closed"
              checked={formData?.pushNotifications}
              onChange={(e) => handleCheckboxChange('pushNotifications', e?.target?.checked)}
              disabled={notificationPermission !== 'granted'}
            />

            <Checkbox
              label="Sales alerts"
              description="Get notified about new sales and transactions"
              checked={formData?.salesAlerts}
              onChange={(e) => handleCheckboxChange('salesAlerts', e?.target?.checked)}
            />

            <Checkbox
              label="Low stock warnings"
              description="Receive alerts when inventory is running low"
              checked={formData?.lowStockWarnings}
              onChange={(e) => handleCheckboxChange('lowStockWarnings', e?.target?.checked)}
            />

            <Checkbox
              label="Sync notifications"
              description="Get notified about data synchronization status"
              checked={formData?.syncNotifications}
              onChange={(e) => handleCheckboxChange('syncNotifications', e?.target?.checked)}
            />
          </div>

          {/* App Behavior */}
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">App Behavior</h5>
            
            <Checkbox
              label="Auto-launch on startup"
              description="Open app automatically when device starts"
              checked={formData?.autoLaunch}
              onChange={(e) => handleCheckboxChange('autoLaunch', e?.target?.checked)}
            />

            <Checkbox
              label="Keep screen awake"
              description="Prevent screen from turning off during use"
              checked={formData?.keepScreenAwake}
              onChange={(e) => handleCheckboxChange('keepScreenAwake', e?.target?.checked)}
            />

            <Checkbox
              label="Fullscreen mode"
              description="Hide browser UI for app-like experience"
              checked={formData?.fullscreenMode}
              onChange={(e) => handleCheckboxChange('fullscreenMode', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* PWA Features Overview */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h5 className="font-medium text-foreground mb-3">PWA Features Status</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Wifi" size={16} className="text-success" />
            <span>Offline Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={16} className="text-success" />
            <span>Installable</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={16} className={notificationPermission === 'granted' ? 'text-success' : 'text-muted-foreground'} />
            <span>Push Notifications</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => {
              setFormData(pwaSettings);
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
            Save PWA Settings
          </Button>
        </div>
      )}
    </div>
  );
};

export default PWASettingsSection;