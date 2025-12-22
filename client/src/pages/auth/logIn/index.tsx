import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../shared/components/AuthHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from '../shared/components/TrustSignals';
import OfflineNotice from '../shared/components/OfflineNotice';
import LoginFooter from '../shared/components/AuthFooter';
import type { LoginFormData, LoginFormErrors } from './types';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  // Mock credentials for testing
  const mockCredentials = {
    email: 'admin@digitalkhata.com',
    password: 'admin123'
  };

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

  const handleLogin = async (formData: LoginFormData) => {
    if (!isOnline) {
      setErrors({ general: 'Internet connection required for authentication' });
      return;
    }

    // Clear previous errors
    setErrors({});

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check credentials
      if (formData.email === mockCredentials.email && formData.password === mockCredentials.password) {
        // Store authentication data
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', formData.email);
        }
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
        localStorage.setItem('userRole', 'admin');
        // Show success message then redirect to dashboard after a short delay
        setErrors({});
        setSuccessMessage('Login successful! Dashboard will be available soon.');
        // wait briefly so user sees the success message
        const id = window.setTimeout(() => {
          setSuccessMessage(undefined);
          navigate('/business-dashboard');
        }, 1400);
        // store timeout id so it can be cleared if component unmounts
        redirectTimer.current = id;
      } else {
        setErrors({ 
          general: `Invalid credentials. Use: ${mockCredentials.email} / ${mockCredentials.password}` 
        });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Keep a ref to any redirect timer so we can clear it if the component unmounts
  const redirectTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

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
                onSubmit={handleLogin}
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