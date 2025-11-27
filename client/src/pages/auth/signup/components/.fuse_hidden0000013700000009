import React from 'react';
import Icon from '../../../../components/AppIcon';
import { RegistrationStep } from '../types';

interface RegistrationProgressProps {
  steps: RegistrationStep[];
  className?: string;
}

const RegistrationProgress = ({ steps, className = '' }: RegistrationProgressProps) => {
  return (
    <div className={`w-full bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-foreground mb-3">Registration Progress</h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            {/* Step Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                step.isCompleted
                  ? 'bg-success text-success-foreground'
                  : step.isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.isCompleted ? (
                <Icon name="Check" size={16} />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <h4
                className={`text-sm font-medium transition-colors duration-200 ${
                  step.isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </h4>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>

            {/* Active Indicator */}
            {step.isActive && (
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationProgress;