import React from 'react';
import Icon from '../../../../components/AppIcon';
import { OfflineNoticeProps } from '../types';

const OfflineNotice = ({ isVisible, className = '' }: OfflineNoticeProps) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className="bg-warning text-warning-foreground px-4 py-2 rounded-lg shadow-elevation-3 flex items-center space-x-2">
        <Icon name="WifiOff" size={16} />
        <span className="text-sm font-medium">
          You're offline. Authentication requires internet connection.
        </span>
      </div>
    </div>
  );
};

export default OfflineNotice;