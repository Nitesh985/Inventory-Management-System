import React from 'react';
import Icon from '../../../../components/AppIcon';

interface TrustSignalsProps {
  className?: string;
}

const TrustSignals = ({ className = '' }: TrustSignalsProps) => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: 'Your data is encrypted with 256-bit SSL protection'
    },
    {
      icon: 'Wifi',
      title: 'Offline-First Design',
      description: 'Works seamlessly without internet connection'
    },
    {
      icon: 'Database',
      title: 'Auto Cloud Sync',
      description: 'Automatic backup when connection is restored'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'We never share your business data with third parties'
    }
  ];

  return (
    <div className={`bg-muted/50 border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="CheckCircle" size={16} className="text-success" />
        <h3 className="text-sm font-medium text-foreground">Why Choose Digital Khata?</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trustFeatures.map((feature, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Icon 
              name={feature.icon as any} 
              size={16} 
              className="text-primary mt-0.5 flex-shrink-0" 
            />
            <div>
              <h4 className="text-xs font-medium text-foreground">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;