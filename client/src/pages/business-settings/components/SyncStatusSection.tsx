import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SyncStatusIndicator from '../../../components/ui/SyncStatusIndicator';

const SyncStatusSection = ({ syncStatus, onForceSync, onResolveConflicts }) => {
  const [currentStatus, setCurrentStatus] = useState(syncStatus);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  const syncHistory = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      status: 'success',
      type: 'auto',
      recordsSync: 23,
      message: 'Successfully synchronized 23 records'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      status: 'success',
      type: 'auto',
      recordsSync: 8,
      message: 'Successfully synchronized 8 records'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'conflict',
      type: 'auto',
      recordsSync: 0,
      message: 'Sync conflict detected - manual resolution required'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'success',
      type: 'manual',
      recordsSync: 45,
      message: 'Manual sync completed successfully'
    }
  ];

  const pendingConflicts = [
    {
      id: 1,
      type: 'inventory',
      item: 'Product ABC-123',
      localValue: 'Quantity: 50',
      cloudValue: 'Quantity: 48',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      type: 'sale',
      item: 'Sale #INV-2025-001',
      localValue: 'Amount: $125.00',
      cloudValue: 'Amount: $120.00',
      timestamp: new Date(Date.now() - 2400000)
    }
  ];

  const handleForceSync = async () => {
    setIsSyncing(true);
    setCurrentStatus('syncing');
    
    // Mock sync process
    setTimeout(() => {
      setIsSyncing(false);
      setCurrentStatus('online');
      setLastSyncTime(new Date());
      onForceSync();
    }, 3000);
  };

  const handleResolveConflict = (conflictId, resolution) => {
    // Mock conflict resolution
    alert(`Conflict ${conflictId} resolved using ${resolution} version`);
    onResolveConflicts();
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return { icon: 'CheckCircle', color: 'text-success' };
      case 'conflict': return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'error': return { icon: 'XCircle', color: 'text-error' };
      default: return { icon: 'Clock', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="RefreshCw" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Sync Status</h3>
            <p className="text-sm text-muted-foreground">Monitor cloud synchronization and resolve conflicts</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Status */}
        <div className="space-y-6">
          <h4 className="font-medium text-foreground">Current Status</h4>
          
          {/* Status Overview */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <SyncStatusIndicator status={currentStatus} size="lg" />
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                loading={isSyncing}
                onClick={handleForceSync}
                disabled={currentStatus === 'offline'}
              >
                {isSyncing ? 'Syncing...' : 'Force Sync'}
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sync:</span>
                <span className="font-medium">{formatTimeAgo(lastSyncTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending Changes:</span>
                <span className="font-medium">12 records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conflicts:</span>
                <span className="font-medium text-warning">{pendingConflicts?.length} unresolved</span>
              </div>
            </div>
          </div>

          {/* Sync Statistics */}
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Sync Statistics</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-success/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-success">156</div>
                <div className="text-xs text-muted-foreground">Successful Syncs</div>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-warning">3</div>
                <div className="text-xs text-muted-foreground">Conflicts This Week</div>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="p-3 bg-muted rounded-lg">
            <h5 className="font-medium text-foreground mb-2">Network Information</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connection:</span>
                <span className="font-medium">WiFi - Strong Signal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Server:</span>
                <span className="font-medium text-success">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency:</span>
                <span className="font-medium">45ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync History & Conflicts */}
        <div className="space-y-6">
          {/* Pending Conflicts */}
          {pendingConflicts?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Pending Conflicts</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResolveConflicts()}
                >
                  Resolve All
                </Button>
              </div>
              
              <div className="space-y-3">
                {pendingConflicts?.map((conflict) => (
                  <div key={conflict?.id} className="p-3 border border-warning/20 bg-warning/5 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-foreground">{conflict?.item}</h5>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(conflict?.timestamp)}</p>
                      </div>
                      <Icon name="AlertTriangle" size={16} className="text-warning" />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Local:</span>
                        <span className="font-medium">{conflict?.localValue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cloud:</span>
                        <span className="font-medium">{conflict?.cloudValue}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveConflict(conflict?.id, 'local')}
                      >
                        Use Local
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveConflict(conflict?.id, 'cloud')}
                      >
                        Use Cloud
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync History */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Recent Sync History</h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {syncHistory?.map((entry) => {
                const statusConfig = getStatusIcon(entry?.status);
                return (
                  <div key={entry?.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                    <Icon 
                      name={statusConfig?.icon} 
                      size={16} 
                      className={`${statusConfig?.color} mt-0.5 flex-shrink-0`} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {entry?.type === 'manual' ? 'Manual Sync' : 'Auto Sync'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(entry?.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{entry?.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncStatusSection;