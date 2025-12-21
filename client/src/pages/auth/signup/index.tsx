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
import VerifyForm from './components/VerifyForm';
import InitialSetupForm from './components/InitialSetupForm';
import SimpleSignupForm from './components/SimpleSignup';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [registrationError, setRegistrationError] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Registration steps for progress indicator
  const [registrationSteps, setRegistrationSteps] = useState<RegistrationStep[]>([
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
  ]);

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

  const handlePageAdd = () => {
    let nextPage:number
    setPage(prev => {
      nextPage = prev + 1
      return nextPage
    })

    setRegistrationSteps((regSteps) => {
     return regSteps.map((step)=> ({...step, isActive: step.id === nextPage, isCompleted: step.id < nextPage}) )
    } )
    
  }



  // const handleRegistration = async (formData: RegisterFormData) => {
  //   handlePageAdd()
  //   if (page !== 4) {
  //     return
  //   }
  //   setIsLoading(true);
  //   setRegistrationError('');

  //   try {
  //     // Simulate API call delay
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Mock validation - in real app, this would be API validation
  //     const existingEmails = ['admin@digitalkhata.com', 'test@example.com'];
      
  //     if (existingEmails.includes(formData.email.toLowerCase())) {
  //       throw new Error('An account with this email address already exists. Please use a different email or try signing in.');
  //     }

  //     // Mock successful registration
  //     console.log('Registration successful:', formData);
      
  //     // Store registration data in localStorage for demo purposes
  //     localStorage.setItem('registrationData', JSON.stringify({
  //       businessName: formData.businessName,
  //       ownerName: formData.ownerName,
  //       email: formData.email,
  //       businessType: formData.businessType,
  //       registeredAt: new Date().toISOString()
  //     }));

  //     // Navigate to login with success message
  //     navigate('/login', { 
  //       state: { 
  //         message: 'Account created successfully! Please sign in to continue.',
  //         type: 'success'
  //       }
  //     });

  //   } catch (error) {
  //     setRegistrationError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  const handleRegistration = async (formData: any) => {
  // 1. Move to the next visual step (Start Using)
  handlePageAdd();

  // 2. Check if we just submitted the Initial Setup (Page 3)
  // If current page is 3, this is our final submission point
  if (page === 3) {
    setIsLoading(true);
    setRegistrationError('');

    try {
      // Simulate API finalization
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock: Save setup data (currency, etc.) to your state management or backend
      console.log('Final Setup Data:', formData);
      
      // 3. Navigate to Inventory Management
      navigate('/inventory-management');

    } catch (error) {
      setRegistrationError('Final setup failed. Please try again.');
      // If error occurs, you might want to move back to page 3
      setPage(3); 
    } finally {
      setIsLoading(false);
    }
    return;
  }

  // Handle other steps (1 and 2)
  console.log(`Step ${page} completed with data:`, formData);
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
        <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

      {/* LEFT SIDE CONTENT */}
      <div className="space-y-8">

        {/* Welcome */}
        <div className="text-center lg:text-left space-y-3">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Start Your Digital Journey
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Transform your business with our modern & easy-to-use management platform.
          </p>
        </div>

        {/* Progress (Desktop) */}
        <RegistrationProgress
          steps={registrationSteps}
          layout="vertical"
          className="hidden lg:block"
        />

        {/* Trust Signals */}
        <TrustSignals />

        {/* Connectivity */}
        <ConnectivityIndicator 
          position="inline" 
          showLabel 
          className="justify-center lg:justify-start"
        />
      </div>

      {/* RIGHT SIDE FORM CARD */}
      <div className="lg:col-span-2">

        <div className="bg-card border border-border rounded-2xl shadow-md p-10 space-y-10">

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">
              Create Your Business Account
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base">
              Join thousands of businesses already using Digital Khata.
            </p>
          </div>

          {/* Error */}
          {registrationError && (
            <FormValidationFeedback
              type="error"
              message={registrationError}
            />
          )}

          {/* Offline Warning */}
          {!isOnline && (
            <FormValidationFeedback
              type="warning"
              message="You're offline. Your form data will be stored locally."
            />
          )}


          {/* FORM */}
          {/* {page===1 && <div className="mt-4">
            <RegistrationForm
              onSubmit={handleRegistration}
              isLoading={isLoading}
            />
          </div>} */}

          {page === 1 && (
  <div className="mt-4">
    <SimpleSignupForm
      onSubmit={handleRegistration}
      isLoading={isLoading}
    />
  </div>
)}

          {page===2 && <div className="mt-4">
            <VerifyForm 
              onSubmit={handleRegistration}
              isLoading={isLoading}

            /> </div>}

          {page===3 && <div className="mt-4">
            <InitialSetupForm 
              onSubmit={handleRegistration}
              isLoading={isLoading}
              /> </div>}

          
          {page === 4 && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-2xl font-bold text-foreground">Finalizing Your Workspace...</h2>
              <p className="text-muted-foreground">Preparing your inventory management dashboard.</p>
            </div>
          )}    

        </div>

        {/* Mobile Progress */}
        <div className="lg:hidden mt-10">
          <RegistrationProgress steps={registrationSteps} currentPage={page} />
        </div>

      </div>
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