export interface BusinessType {
  value: string;
  label: string;
  description?: string;
}

export interface RegisterFormData {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessType: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export interface FormErrors {
  businessName?: string;
  ownerName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  businessType?: string;
  agreeToTerms?: string;
  agreeToPrivacy?: string;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}