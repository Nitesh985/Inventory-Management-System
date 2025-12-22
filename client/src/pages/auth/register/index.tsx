import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../shared/components/AuthHeader';
import RegisterForm from './components/RegisterForm';
import RegisterFooter from '../shared/components/AuthFooter';
import RegisterTrustSignals from '../shared/components/TrustSignals';
import OfflineNotice from '../shared/components/OfflineNotice';
import type { RegisterFormData, RegisterFormErrors } from './types';
import { useMutation } from '@/hooks/useMutation';
import { registerUser } from '@/api/users';
import { signUp } from '@/lib/auth-client';



const RegisterPage = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>();
  const {mutate} = useMutation(registerUser)

  const redirectTimer = useRef<number | null>(null);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const validateForm = (data: RegisterFormData): RegisterFormErrors => {
    const errs: RegisterFormErrors = {};

    if (!data.fullName) errs.fullName = 'Full name is required';

    if (!data.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = 'Invalid email address';

    if (!data.password || data.password.length < 6)
      errs.password = 'Password must be at least 6 characters';

    if (data.password !== data.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';

    if (!data.acceptTerms)
      errs.acceptTerms = 'You must accept the terms';

    return errs;
  };

  const handleRegister = async (data: RegisterFormData) => {
    if (!isOnline) {
      setErrors({ general: 'Internet connection required for registration' });
      return;
    }

    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await mutate(data)
      console.log(response)
      await signUp.email({email:data.email, password:data.password, name:data.fullName, callbackURL:"/dashboard"});
      setSuccessMessage('Account created successfully! Redirecting to login…');
      navigate('/');
    } catch {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <RegisterHeader isOnline={isOnline} />
      <OfflineNotice isVisible={!isOnline} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RegisterForm
            onSubmit={handleRegister}
            errors={errors}
            isLoading={isLoading}
            isOnline={isOnline}
            successMessage={successMessage}
          />
          <RegisterTrustSignals />
        </div>
      </main>

      <RegisterFooter />
    </div>
  );
};

export default RegisterPage;
