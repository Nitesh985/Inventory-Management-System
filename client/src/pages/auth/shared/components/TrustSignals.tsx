import Icon from '@/components/AppIcon';
import type { TrustSignalsProps } from '../types';

const TrustSignals = ({ className = '' }: TrustSignalsProps) => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: 'Database',
      title: 'Data Protected',
      description: 'Advanced security measures in place'
    },
    {
      icon: 'Lock',
      title: 'Privacy First',
      description: 'Your information stays confidential'
    }
  ];

  return (
    <div className={`bg-muted/50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Your Security is Our Priority
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustFeatures.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon 
                name={feature.icon as any} 
                size={20} 
                className="text-success" 
              />
            </div>
            <h4 className="font-medium text-foreground text-sm mb-1">
              {feature.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;