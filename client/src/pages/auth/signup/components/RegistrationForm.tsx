import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';

import Icon from '../../../../components/AppIcon';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { RegisterFormData, FormErrors, BusinessType } from '../types';

interface RegistrationFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
  className?: string;
}

const RegistrationForm = ({ onSubmit, isLoading = false, className = '' }: RegistrationFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const businessTypes: BusinessType[] = [
    { value: 'retail', label: 'Retail Store', description: 'Physical or online retail business' },
    { value: 'service', label: 'Service Provider', description: 'Professional services, consulting' },
    { value: 'manufacturing', label: 'Manufacturing', description: 'Production and manufacturing' },
    { value: 'restaurant', label: 'Restaurant/Food', description: 'Food service and hospitality' },
    { value: 'healthcare', label: 'Healthcare', description: 'Medical and healthcare services' },
    { value: 'other', label: 'Other', description: 'Other business type' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Business name validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (formData.businessName.trim().length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }

    // Owner name validation
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    } else if (formData.ownerName.trim().length < 2) {
      newErrors.ownerName = 'Owner name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Business type validation
    if (!formData.businessType) {
      newErrors.businessType = 'Please select your business type';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    // Privacy validation
    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Business Information Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Building2" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Business Information</h3>
        </div>

        <Input
          label="Business Name"
          type="text"
          placeholder="Enter your business name"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          error={errors.businessName}
          required
          disabled={isLoading}
        />

        <Input
          label="Owner/Manager Name"
          type="text"
          placeholder="Enter your full name"
          value={formData.ownerName}
          onChange={(e) => handleInputChange('ownerName', e.target.value)}
          error={errors.ownerName}
          required
          disabled={isLoading}
        />

        <Select
          label="Business Type"
          placeholder="Select your business type"
          options={businessTypes}
          value={formData.businessType}
          onChange={(value) => handleInputChange('businessType', value as string)}
          error={errors.businessType}
          required
          disabled={isLoading}
        />
      </div>

      {/* Account Credentials Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="User" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Account Credentials</h3>
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          description="This will be your login email"
          required
          disabled={isLoading}
        />

        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
          <PasswordStrengthIndicator password={formData.password} />
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>
      </div>

      {/* Legal Agreements Section */}
      <div className="space-y-4 border-t border-border pt-6">
        <div className="space-y-3">
          <Checkbox
            label="I agree to the Terms of Service"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            error={errors.agreeToTerms}
            disabled={isLoading}
          />
          
          <Checkbox
            label="I agree to the Privacy Policy"
            checked={formData.agreeToPrivacy}
            onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
            error={errors.agreeToPrivacy}
            disabled={isLoading}
          />
        </div>

        <div className="text-xs text-muted-foreground">
          <p>
            By creating an account, you acknowledge that you have read and understood our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-4">
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="UserPlus"
          iconPosition="left"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;