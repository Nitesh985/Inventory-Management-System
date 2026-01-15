import React from 'react';
import Icon from '../../../../components/AppIcon';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator = ({ password, className = '' }: PasswordStrengthIndicatorProps) => {
  const calculatePasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    let label = '';
    let color = '';

    switch (score) {
      case 0:
      case 1:
        label = 'Very Weak';
        color = 'text-error';
        break;
      case 2:
        label = 'Weak';
        color = 'text-warning';
        break;
      case 3:
        label = 'Fair';
        color = 'text-warning';
        break;
      case 4:
        label = 'Good';
        color = 'text-primary';
        break;
      case 5:
        label = 'Strong';
        color = 'text-success';
        break;
      default:
        label = 'Very Weak';
        color = 'text-error';
    }

    return { score, label, color, requirements };
  };

  const strength = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strength.score === 1 ? 'bg-error w-1/5' :
              strength.score === 2 ? 'bg-warning w-2/5' :
              strength.score === 3 ? 'bg-warning w-3/5' :
              strength.score === 4 ? 'bg-primary w-4/5' :
              strength.score === 5 ? 'bg-success w-full' : 'w-0'
            }`}
          />
        </div>
        <span className={`text-xs font-medium ${strength.color}`}>
          {strength.label}
        </span>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
        <div className={`flex items-center space-x-1 ${strength.requirements.length ? 'text-success' : 'text-muted-foreground'}`}>
          <Icon name={strength.requirements.length ? "Check" : "X"} size={12} />
          <span>At least 8 characters</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.requirements.uppercase ? 'text-success' : 'text-muted-foreground'}`}>
          <Icon name={strength.requirements.uppercase ? "Check" : "X"} size={12} />
          <span>Uppercase letter</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.requirements.lowercase ? 'text-success' : 'text-muted-foreground'}`}>
          <Icon name={strength.requirements.lowercase ? "Check" : "X"} size={12} />
          <span>Lowercase letter</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.requirements.number ? 'text-success' : 'text-muted-foreground'}`}>
          <Icon name={strength.requirements.number ? "Check" : "X"} size={12} />
          <span>Number</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.requirements.special ? 'text-success' : 'text-muted-foreground'} sm:col-span-2`}>
          <Icon name={strength.requirements.special ? "Check" : "X"} size={12} />
          <span>Special character (!@#$%^&*)</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;