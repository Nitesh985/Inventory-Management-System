import React, { useCallback, useState } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { Checkbox } from '../../../../components/ui/Checkbox';
import Icon from '../../../../components/AppIcon';
import FormValidationFeedback from '../../../../components/ui/FormValidationFeedback';
import type { LoginFormProps, LoginFormData } from '../types';

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errors, isLoading, isOnline, successMessage }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const ICON_SIZE = 36;

  const handleInputChange = useCallback(
    (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'rememberMe' ? e.target.checked : e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isOnline) return;
      onSubmit(formData);
    },
    [isOnline, onSubmit, formData]
  );

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg border border-border shadow-elevation-2 p-8 sm:p-10 ">
      {/* Form Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="LogIn" size={ICON_SIZE} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Sign in to access your business dashboard</p>
      </div>

      {/* General Error Message */}
      {successMessage && (
        <FormValidationFeedback type="success" message={successMessage} className="mb-6" role="status" />
      )}

      {errors.general && (
        <FormValidationFeedback type="error" message={errors.general} className="mb-6" role="alert" />
      )}

      {/* Login Form */}
  <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          required
          disabled={!isOnline || isLoading}
          className="w-full py-3"
        />

        {/* Password Field */}
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          required
          disabled={!isOnline || isLoading}
          className="w-full py-3"
        />

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData.rememberMe}
            onChange={handleInputChange('rememberMe')}
            disabled={!isOnline || isLoading}
            size="sm"
          />
          
          <a
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!isOnline || isLoading || !formData.email || !formData.password}
          iconName="LogIn"
          iconPosition="left"
          className="py-4 text-lg"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2 text-warning">
            <Icon name="WifiOff" size={16} />
            <span className="text-sm font-medium">No Internet Connection</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Please check your connection and try again
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;