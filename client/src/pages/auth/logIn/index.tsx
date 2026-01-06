import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../shared/components/AuthHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from '../shared/components/TrustSignals';
import OfflineNotice from '../shared/components/OfflineNotice';
import LoginFooter from '../shared/components/AuthFooter';
import type { LoginFormData, LoginFormErrors } from './types';
import { signIn } from '@/lib/auth-client';
import { useSession } from '@/lib/auth-client';



const LoginPage = () => {
  const navigate = useNavigate();
  const {data: session} = useSession()


  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const validateForm = (data: LoginFormData): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};

    // Email validation
    if (!data.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const submitLoginForm = async (data: LoginFormData) => {
    setIsLoading(true)
    validateForm(data)
    
    await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    },{
      onSuccess: () => {
        setIsLoading(false)
        navigate("/business-dashboard", {replace:true})
      }
    })   
  }

  


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <LoginHeader isOnline={isOnline} />

      {/* Offline Notice */}
      <OfflineNotice isVisible={!isOnline} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Login Form */}
            <div className="order-2 lg:order-1">
              <LoginForm
                onSubmit={submitLoginForm}
                errors={errors}
                isLoading={isLoading}
                isOnline={isOnline}
                successMessage={successMessage}
              />
              
              {/* Footer Links */}
              <div className="mt-8">
                <LoginFooter />
              </div>
            </div>

            {/* Right Column - Trust Signals &amp; Branding */}
            <div className="order-2 lg:order-2 space-y-8 ml-25">
              {/* Welcome Message */}
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Manage Your Business
                </h2>
                <p className="text-sm text-justify font-bold mb-8 ">
                  Digital Khata helps you track inventory, record sales, manage expenses, and generate AI-powered business insights - all with offline-first capabilities.
                </p>
                
                {/* Key Features */}
                <div className="space-y-5 text-sm text-left">
                  {[
                    'Offline-first data storage',
                    'Real-time inventory management',
                    'AI-powered business reports',
                    'Automatic cloud synchronization'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Signals */}
              <TrustSignals />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;