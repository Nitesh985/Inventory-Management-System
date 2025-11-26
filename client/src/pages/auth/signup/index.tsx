import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AuthenticationHeader from '../../../components/ui/AuthenticationHeader';
import AuthenticationFooter from '../../../components/ui/AuthenticationFooter';
import ConnectivityIndicator from '../../../components/ui/ConnectivityIndicator';
import FormValidationFeedback from '../../../components/ui/FormValidationFeedback';
import RegistrationForm from './components/RegistrationForm';
import RegistrationProgress from './components/RegistrationProgress';
import TrustSignals from './components/TrustSignals';
import { RegisterFormData, RegistrationStep } from './types';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Registration steps for progress indicator
  const registrationSteps: RegistrationStep[] = [
    {
      id: 1,
      title: 'Create Account',
      description: 'Set up your business profile',
      isActive: true,
      isCompleted: false
    },
    {
      id: 2,
      title: 'Verify Email',
      description: 'Confirm your email address',
      isActive: false,
      isCompleted: false
    },
    {
      id: 3,
      title: 'Initial Setup',
      description: 'Configure your inventory',
      isActive: false,
      isCompleted: false
    },
    {
      id: 4,
      title: 'Start Using',
      description: 'Begin managing your business',
      isActive: false,
      isCompleted: false
    }
  ];

  // Monitor connectivity status
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

  const handleRegistration = async (formData: RegisterFormData) => {
    setIsLoading(true);
    setRegistrationError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation - in real app, this would be API validation
      const existingEmails = ['admin@digitalkhata.com', 'test@example.com'];
      
      if (existingEmails.includes(formData.email.toLowerCase())) {
        throw new Error('An account with this email address already exists. Please use a different email or try signing in.');
      }

      // Mock successful registration
      console.log('Registration successful:', formData);
      
      // Store registration data in localStorage for demo purposes
      localStorage.setItem('registrationData', JSON.stringify({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        businessType: formData.businessType,
        registeredAt: new Date().toISOString()
      }));

      // Navigate to login with success message
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please sign in to continue.',
          type: 'success'
        }
      });

    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account - Digital Khata | Business Management Platform</title>
        <meta 
          name="description" 
          content="Join Digital Khata and transform your business with our comprehensive ERP solution. Create your account to start managing inventory, sales, and expenses with offline-first capabilities." 
        />
        <meta name="keywords" content="business registration, ERP signup, inventory management, digital transformation" />
        <meta property="og:title" content="Create Account - Digital Khata" />
        <meta property="og:description" content="Start your digital business transformation journey with Digital Khata's comprehensive management platform." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <AuthenticationHeader 
          showConnectivityStatus={true}
          isOnline={isOnline}
        />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Progress & Trust Signals */}
              <div className="lg:col-span-1 space-y-6">
                {/* Welcome Section */}
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    Start Your Digital Journey
                  </h1>
                  <p className="text-muted-foreground">
                    Transform your business with our comprehensive management platform designed for modern entrepreneurs.
                  </p>
                </div>

                {/* Registration Progress */}
                <RegistrationProgress 
                  steps={registrationSteps}
                  className="hidden lg:block"
                />

                {/* Trust Signals */}
                <TrustSignals />

                {/* Connectivity Status */}
                <ConnectivityIndicator 
                  position="inline"
                  showLabel={true}
                  className="justify-center lg:justify-start"
                />
              </div>

              {/* Right Column - Registration Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-6 lg:p-8">
                  {/* Form Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Create Your Business Account
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Join thousands of businesses already using Digital Khata
                    </p>
                  </div>

                  {/* Error Message */}
                  {registrationError && (
                    <FormValidationFeedback
                      type="error"
                      message={registrationError}
                      className="mb-6"
                    />
                  )}

                  {/* Offline Warning */}
                  {!isOnline && (
                    <FormValidationFeedback
                      type="warning"
                      message="You're currently offline. Account creation requires an internet connection. Your form data will be saved locally."
                      className="mb-6"
                    />
                  )}

                  {/* Registration Form */}
                  <RegistrationForm
                    onSubmit={handleRegistration}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Progress Indicator */}
            <div className="lg:hidden mt-8">
              <RegistrationProgress steps={registrationSteps} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <AuthenticationFooter currentPage="register" />
      </div>
    </>
  );
};

export default RegisterPage;