import React from 'react'
import Icon from '../AppIcon'

interface AuthenticationHeaderProps {
  showConnectivityStatus?: boolean;
  isOnline?: boolean;
}

const AuthenticationHeader: React.FC<AuthenticationHeaderProps> = ({
  showConnectivityStatus = true,
  isOnline = true
}) => {
  return (
    <header className="w-full bg-card border-b border-border shadow-elevation-1">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Calculator" size={20} color="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground">Digital Khata</h1>
            <p className="text-xs text-muted-foreground">Business Management</p>
          </div>
        </div>

        {/* Security & Status Indicators */}
        <div className="flex items-center space-x-3">
          {/* Security Badge */}
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="hidden sm:inline">Secure</span>
          </div>

          {/* Connectivity Status */}
          {showConnectivityStatus && (
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-warning'}`} />
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AuthenticationHeader