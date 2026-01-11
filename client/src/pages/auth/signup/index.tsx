import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import GoogleLogo from '@/assets/google-logo.png';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn } from '@/lib/auth-client';



// Password strength checker function
const checkPasswordStrength = (password: string) => {
  let strength = 0;
  const feedback: string[] = [];

  if (!password) {
    return { strength: 0, label: 'No password', color: 'gray', feedback: [] };
  }

  // Length check
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  else feedback.push('Use at least 12 characters for stronger security');

  // Lowercase letters
  if (/[a-z]/.test(password)) strength += 15;
  else feedback.push('Add lowercase letters (a-z)');

  // Uppercase letters
  if (/[A-Z]/.test(password)) strength += 15;
  else feedback.push('Add uppercase letters (A-Z)');

  // Numbers
  if (/[0-9]/.test(password)) strength += 15;
  else feedback.push('Add numbers (0-9)');

  // Special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
  else feedback.push('Add special characters (!@#$%^&* etc)');

  // Determine strength label and color
  let label = 'Weak';
  let color = 'red';

  if (strength >= 80) {
    label = 'Strong';
    color = 'green';
  } else if (strength >= 60) {
    label = 'Medium';
    color = 'yellow';
  } else if (strength >= 40) {
    label = 'Fair';
    color = 'orange';
  }

  return { strength, label, color, feedback };
};

// 1. Define the validation schema
const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;


const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [registrationError, setRegistrationError] = useState<string>('');

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
  });

  // Watch password field for strength calculation
  const passwordValue = watch('password') || password;
  const passwordStrength = useMemo(() => checkPasswordStrength(passwordValue), [passwordValue]);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bar: string; text: string; bg: string }> = {
      red: { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-100' },
      orange: { bar: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-100' },
      yellow: { bar: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-100' },
      green: { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-100' },
      gray: { bar: 'bg-gray-300', text: 'text-gray-600', bg: 'bg-gray-100' },
    };
    return colorMap[color] || colorMap.gray;
  };


    const signUpUser = async (data:SignupFormData) => {
    const { error} = await signUp.email({
      name: data.fullName,
      email: data.email,
      password: data.password
    }, {
      onSuccess:()=>{
        navigate('/welcome')
      },
      onRequest: () => {
        setIsLoading(true)
      },
      onResponse: ()=>{
        setIsLoading(false)
      }
    })

    if (error){
      setRegistrationError(error?.message ?? "An unexpected error occurred. Please try again.")
    }

  }

  const signUpGoogle = async () => {
    await signIn.social({
      provider: "google"
    }, {
      onSuccess: ()=>{
        
      }
    })
  }




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


                {/* Form Content */}
                  <div className="animate-in fade-in duration-500">
                   <form onSubmit={handleSubmit(signUpUser)} className="space-y-4">
      {/* Full Name Field */}
      <div className="space-y-1.5 animate-fade-in-delay" style={{ animationDelay: '0.05s' }}>
        <label className="block text-sm font-semibold text-gray-700">Full Name</label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
          <Input
            placeholder="John Doe"
            {...register('fullName')}
            error={errors.fullName?.message}
            disabled={isLoading}
            className="relative w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg transition-all text-sm bg-white/80 hover:bg-white hover:border-gray-300"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-1.5 animate-fade-in-delay" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-semibold text-gray-700">Email Address</label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
          <Input
            type="email"
            placeholder="name@company.com"
            {...register('email')}
            error={errors.email?.message}
            disabled={isLoading}
            className="relative w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg transition-all text-sm bg-white/80 hover:bg-white hover:border-gray-300"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-1.5 animate-fade-in-delay" style={{ animationDelay: '0.15s' }}>
        <label className="block text-sm font-semibold text-gray-700">Password</label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            {...register('password')}
            onChange={(e) => {
              setPassword(e.target.value);
              register('password').onChange?.(e);
            }}
            error={errors.password?.message}
            disabled={isLoading}
            className="relative w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg transition-all pr-12 text-sm bg-white/80 hover:bg-white hover:border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
            tabIndex={-1}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>
        {/* Password Strength Indicator */}
        {passwordValue && (
          <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {/* Strength Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">Strength:</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getColorClasses(passwordStrength.color).bar}`}
                  style={{ width: `${Math.min(passwordStrength.strength, 100)}%` }}
                ></div>
              </div>
              <span className={`text-xs font-bold ${getColorClasses(passwordStrength.color).text}`}>
                {passwordStrength.label}
              </span>
            </div>

            {/* Password Suggestions */}
            {passwordStrength.feedback.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-700">Ways to make it stronger:</p>
                <ul className="space-y-1">
                  {passwordStrength.feedback.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span className="text-xs text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Message */}
            {passwordStrength.feedback.length === 0 && passwordValue && (
              <div className="flex items-center gap-2 pt-1">
                <Icon name="CheckCircle" size={16} className="text-green-600" />
                <span className="text-xs font-semibold text-green-600">Great password! You're all set.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1.5 animate-fade-in-delay" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            className="relative w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg transition-all pr-12 text-sm bg-white/80 hover:bg-white hover:border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
            tabIndex={-1}
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>
      </div>

      {/* Terms Agreement */}
      <p className="text-xs text-gray-600 text-center leading-relaxed pt-2 animate-fade-in-delay" style={{ animationDelay: '0.25s' }}>
        By creating an account, you agree to our{' '}
        <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-bold">Terms</Link> and{' '}
        <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-bold">Privacy Policy</Link>
      </p>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        className="py-3 text-base font-bold bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-60 disabled:shadow-md mt-6 relative overflow-hidden group animate-fade-in-delay"
        style={{ animationDelay: '0.3s' }}
      >
        <span className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Button>

      {/* Divider */}
      <div className="relative flex justify-center items-center my-4 animate-fade-in-delay" style={{ animationDelay: '0.35s' }}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <span className="relative px-3 text-xs text-gray-500 bg-white font-bold">Or</span>
      </div>

      {/* Social Signup Buttons */}
      <div className="flex items-center justify-center gap-2 animate-fade-in-delay" style={{ animationDelay: '0.4s' }}>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all font-bold text-gray-700 text-sm group space-x-3"
          disabled={isLoading}
          onClick={signUpGoogle}
        >
          <img src={GoogleLogo} alt="Google" className="w-5 h-5 object-contain" />
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Sign In Link */}
      <div className="text-center pt-3 border-t border-gray-200 mt-4 animate-fade-in-delay" style={{ animationDelay: '0.45s' }}>
        <p className="text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all duration-200">
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
                  </form>
                   </div>

              </div>


            </div>
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




export default SignupPage;