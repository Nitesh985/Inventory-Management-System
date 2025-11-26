export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  errors: LoginFormErrors;
  isLoading: boolean;
  isOnline: boolean;
  successMessage?: string;
}

export interface LoginHeaderProps {
  isOnline: boolean;
}

export interface LoginFooterProps {
  className?: string;
}

export interface TrustSignalsProps {
  className?: string;
}

export interface OfflineNoticeProps {
  isVisible: boolean;
  className?: string;
}