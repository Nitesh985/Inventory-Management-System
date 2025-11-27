import React, { useState, useEffect } from 'react'
import Icon from '../AppIcon'

interface ConnectivityIndicatorProps {
  className?: string
  showLabel?: boolean
  position?: 'header' | 'inline' | 'floating'
}

const ConnectivityIndicator: React.FC<ConnectivityIndicatorProps> = ({
  className = '',
  showLabel = true,
  position = 'inline'
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [showMessage, setShowMessage] = useState<boolean>(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowMessage(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const getPositionStyles = () => {
    switch (position) {
      case 'header':
        return 'flex items-center space-x-2'
      case 'floating':
        return 'fixed top-4 right-4 z-50 bg-card border border-border rounded-lg px-3 py-2 shadow-elevation-3'
      case 'inline':
      default:
        return 'flex items-center space-x-2'
    }
  }

  const getStatusMessage = () => {
    if (!isOnline) {
      return 'Authentication requires internet connection'
    }
    return showMessage ? 'Connection restored' : ''
  }

  return (
    <div className={`${getPositionStyles()} ${className}`}>
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            isOnline ? 'bg-success' : 'bg-warning animate-pulse'
          }`}
          aria-label={isOnline ? 'Online' : 'Offline'}
        />

        {showLabel && (
          <span
            className={`text-sm font-medium transition-colors duration-200 ${
              isOnline ? 'text-success' : 'text-warning'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        )}
      </div>

      {/* Status Message */}
      {(getStatusMessage() || !isOnline) && (
        <div
          className={`flex items-center space-x-1 text-xs transition-all duration-300 ${
            !isOnline ? 'text-warning' : 'text-success'
          }`}
          role="status"
          aria-live="polite"
        >
          <Icon name={!isOnline ? 'WifiOff' : 'Wifi'} size={14} className="flex-shrink-0" />
          <span>{getStatusMessage() || 'Authentication requires internet'}</span>
        </div>
      )}
    </div>
  )
}

export default ConnectivityIndicator