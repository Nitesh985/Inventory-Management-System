import React from 'react';
import Icon from '../AppIcon';

interface FormValidationFeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
  showIcon?: boolean;
  role?: string;
}

const FormValidationFeedback = ({
  type,
  message,
  className = '',
  showIcon = true,
  role = 'alert'
}: FormValidationFeedbackProps) => {
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      default:
        return 'Info';
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'error':
        return 'text-error bg-error/10 border-error/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'info':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  if (!message) return null;

  return (
    <div
      className={`flex items-start space-x-2 p-3 rounded-md border text-sm transition-all duration-200 ${getStyles()} ${className}`}
      role={role}
      aria-live="polite"
    >
      {showIcon && (
        <Icon
          name={getIconName()}
          size={16}
          className="flex-shrink-0 mt-0.5"
        />
      )}
      <span className="flex-1">{message}</span>
    </div>
  );
};

export default FormValidationFeedback;