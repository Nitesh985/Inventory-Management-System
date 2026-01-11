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

  const submitGoogle = async (data: LoginFormData) => {
    setIsLoading(true)

    await signIn.social({
      provider: "google"
    }, {
      onSuccess: ()=> {
        setIsLoading(false)
        navigate("/business-dashboard", {replace:true})
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-50 relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right orb */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-b from-blue-300 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
        
        {/* Bottom left orb */}
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Center orb */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>

        {/* Floating particles effect */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-40 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-blue-300 rounded-full opacity-25 animate-float animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full flex flex-col items-center justify-center">
          <LoginForm
            onSubmit={submitLoginForm}
            submitGoogle={submitGoogle}
            errors={errors}
            isLoading={isLoading}
            isOnline={isOnline}
            successMessage={successMessage}
          />
        </div>
      </main>

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
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
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
      `}</style>
    </div>
  );

  



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