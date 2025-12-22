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


