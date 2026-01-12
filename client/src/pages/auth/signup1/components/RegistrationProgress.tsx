import React from 'react';
import Icon from '../../../../components/AppIcon';
import { RegistrationStep } from '../types';

interface RegistrationProgressProps {
  steps: RegistrationStep[];
  className?: string;
  layout?: 'vertical' | 'horizontal';
  currentPage?: number;
}

const RegistrationProgress = ({ steps, className = '', layout = 'vertical', currentPage }: RegistrationProgressProps) => {
  // ---------------- MOBILE HORIZONTAL ----------------
  if (layout === 'horizontal') {
    return (
      <div className={`w-full bg-card border border-border rounded-lg p-4 ${className}`}>
        <div className="flex justify-between items-center">
          {steps?.map((step, index) => (
            <div key={step.id} className="flex-1 text-center relative">
              
              {/* Step circle */}
              <div
                className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-1
                ${step.isCompleted ? 'bg-success text-success-foreground' :
                  step.isActive ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'}`}
              >
                {step.isCompleted ? (
                  <Icon name="Check" size={14} />
                ) : (
                  <span className="text-xs font-medium">{step.id}</span>
                )}
              </div>

              {/* Step title */}
              <p className={`text-[10px] font-medium 
                ${step.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.title}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-[55%] w-[90%] h-0.5 bg-muted -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- DESKTOP VERTICAL ----------------
  return (
    <div className={`w-full bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-foreground mb-3">Registration Progress</h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                transition-colors duration-200
                ${step.isCompleted ? 'bg-success text-success-foreground' :
                  step.isActive ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'}`}
            >
              {step.isCompleted ? (
                <Icon name="Check" size={16} />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>

            <div className="flex-1">
              <h4 className={`text-sm font-medium 
                ${step.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.title}
              </h4>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>

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
