import React from 'react';
import Icon from '../../../components/AppIcon';

interface MetricsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  iconColor?: string;
  trend?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  iconColor = "text-primary",
  trend = false 
}) => {
  const getChangeColor = (): string => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (): string => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${iconColor}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <Icon name={getChangeIcon()} size={16} className={getChangeColor()} />
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
        {!trend && change && (
          <div className="flex items-center space-x-1 mt-2">
            <Icon name={getChangeIcon()} size={14} className={getChangeColor()} />
            <span className={`text-xs ${getChangeColor()}`}>
              {change} from last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;