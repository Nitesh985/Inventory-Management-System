import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import RegistrationProgress from './components/RegistrationProgress';
import type { RegistrationStep } from './types';
import VerifyForm from './components/VerifyForm';
import InitialSetupForm from './components/InitialSetupForm';
import SimpleSignupForm from './components/SimpleSignup';
import { signUp } from '@/lib/auth-client';
import type { SignupFormData } from './components/SimpleSignup';


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

  const signUpUser = async (data:SignupFormData) => {
    const {data:resData, error} = await signUp.email({
      name: data.fullName,
      email: data.email,
      password: data.password
    })

    if (error){
      throw error
    }

    console.log(resData)
    
  }

  const signUpGoogle = async (data: SignupFormData) => {
    
  }

  
  const handleRegistration = async (formData: any) => {
  if (page === 1){
    signUpUser(formData)
  } else if (page === 2){
    
  }

  // Handle Step 1 (Signup) and Step 2 (Verify)
  handlePageAdd();
};

  return (
    <>
      {/* @ts-ignore */}
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

      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-50 relative overflow-hidden flex flex-col">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top right orb */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-b from-blue-300 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
          
          {/* Bottom left orb */}
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          {/* Center orb */}
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>

          {/* Floating particles effect */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-float"></div>
          <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-40 animate-float animation-delay-1000"></div>
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-blue-300 rounded-full opacity-25 animate-float animation-delay-2000"></div>
        </div>


        {/* Main Content */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-16">
          <div className="w-full max-w-2xl mx-auto">
            {/* Progress Indicator - Mobile */}
            <div className="mb-8 lg:hidden">
              <RegistrationProgress steps={registrationSteps} currentPage={page} />
            </div>

            <div className="flex flex-col items-center justify-center">
              {/* Form Card */}
              <div className="w-full bg-gradient-to-br from-white to-blue-50 rounded-3xl border border-gray-200 shadow-2xl hover:shadow-3xl p-8 sm:p-10 hover:-translate-y-1 transition-all duration-500 overflow-visible relative">
                
                {/* Header */}
                <div className="text-center mb-10 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Create Your Account
                    </h2>
                    <div className="h-1 w-12 bg-gradient-to-l from-blue-600 to-blue-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-lg mx-auto">
                    Join thousands of businesses managing their operations with Digital Khata
                  </p>
                </div>

                {/* Error Message */}
                {registrationError && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg flex items-start space-x-3 shadow-md animate-pulse" role="alert">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-bold text-red-900">{registrationError}</p>
                  </div>
                )}

                {/* Offline Notice */}
                {!isOnline && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg flex items-start space-x-3 shadow-md animate-pulse">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-bold text-amber-900">You're offline</p>
                      <p className="text-xs text-amber-700 mt-1">Your form data will be stored locally</p>
                    </div>
                  </div>
                )}

                {/* Form Content */}
                {page === 1 && (
                  <div className="animate-in fade-in duration-500">
                    <SimpleSignupForm
                      onSubmit={handleRegistration}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {page === 2 && (
                  <div className="animate-in fade-in duration-500">
                    <VerifyForm 
                      onSubmit={handleRegistration}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {page === 3 && (
                  <div className="animate-in fade-in duration-500">
                    <InitialSetupForm 
                      onSubmit={handleRegistration}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {page === 4 && (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <div className="relative w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Finalizing Your Account...</h2>
                    <p className="text-gray-600 text-sm">Preparing your dashboard for you</p>
                  </div>
                )}

              </div>

              {/* Progress Indicator - Desktop */}
              <div className="hidden lg:block mt-12 w-full">
                <RegistrationProgress steps={registrationSteps} layout="horizontal" />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        {/* <AuthenticationFooter currentPage="register" /> */}

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes blob {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.25;
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
              opacity: 0.3;
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
              opacity: 0.2;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-20px) translateX(10px);
              opacity: 0.6;
            }
          }
          
          .animate-in {
            animation: fadeIn 0.5s ease-out forwards;
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .animation-delay-1000 {
            animation-delay: 1s;
          }

          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
};

export default RegisterPage;