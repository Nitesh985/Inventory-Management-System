export type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export type RegisterFormErrors = Partial<
  RegisterFormData & { general: string }
>;

export type RegisterFormProps = {
  onSubmit: (data: RegisterFormData) => void;
  errors: RegisterFormErrors;
  isLoading: boolean;
  isOnline: boolean;
  successMessage?: string;
};
