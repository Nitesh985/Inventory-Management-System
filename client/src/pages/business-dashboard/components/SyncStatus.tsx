import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState('online');
  const [lastSync, setLastSync] = useState(new Date());
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    // Simulate sync status changes
    const interval = setInterval(() => {
      const statuses = ['online', 'syncing', 'offline'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      
      if (randomStatus === 'syncing') {
        setSyncStatus('syncing');
        setTimeout(() => {
          setSyncStatus('online');
          setLastSync(new Date());
          setPendingChanges(0);
        }, 3000);
      } else {
        setSyncStatus(randomStatus);
        if (randomStatus === 'offline') {
          setPendingChanges(Math.floor(Math.random() * 5) + 1);
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'online':
        return {
          icon: 'Wifi',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Online',
          description: 'All data synchronized'
        };
      case 'syncing':
        return {
          icon: 'RefreshCw',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Syncing',
          description: 'Synchronizing data...'
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Offline',
          description: 'Working offline'
        };
      default:
        return {
          icon: 'Wifi',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Unknown',
          description: 'Connection status unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatLastSync = () => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - lastSync) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return lastSync?.toLocaleDateString('en-US');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Sync Status</h2>
      <div className="space-y-4">
        {/* Current Status */}
        <div className={`flex items-center space-x-3 p-4 rounded-lg ${statusConfig?.bgColor}`}>
          <Icon 
            name={statusConfig?.icon} 
            size={24} 
            className={`${statusConfig?.color} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
          />
          <div className="flex-1">
            <div className={`font-medium ${statusConfig?.color}`}>
              {statusConfig?.label}
            </div>
            <div className="text-sm text-muted-foreground">
              {statusConfig?.description}
            </div>
          </div>
        </div>

        {/* Sync Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last sync:</span>
            <span className="font-medium text-foreground">{formatLastSync()}</span>
          </div>
          
          {pendingChanges > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending changes:</span>
              <span className="font-medium text-warning">{pendingChanges}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Storage used:</span>
            <span className="font-medium text-foreground">2.4 MB / 100 MB</span>
          </div>
        </div>

        {/* Sync Actions */}
        <div className="pt-4 border-t border-border">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSyncStatus('syncing');
                setTimeout(() => {
                  setSyncStatus('online');
                  setLastSync(new Date());
                  setPendingChanges(0);
                }, 2000);
              }}
              disabled={syncStatus === 'syncing'}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="RefreshCw" size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
              <span>Force Sync</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200">
              <Icon name="Settings" size={14} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Offline Mode Info */}
        {syncStatus === 'offline' && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Working Offline</p>
                <p className="text-muted-foreground">
                  Your changes are being saved locally and will sync automatically when you're back online.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncStatus;