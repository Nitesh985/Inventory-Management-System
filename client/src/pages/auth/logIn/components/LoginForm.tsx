import React, { useCallback, useState } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Checkbox from '../../../../components/ui/Checkbox';
import Icon from '../../../../components/AppIcon';
import FormValidationFeedback from '../../../../components/ui/FormValidationFeedback';
import type { LoginFormProps, LoginFormData } from '../types';
import GoogleLogo from '@/assets/google-logo.png';
import AppleLogo from '@/assets/apple-logo.png';



const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, submitGoogle, errors, isLoading, isOnline, successMessage }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const ICON_SIZE = 36;

  const handleInputChange = useCallback(
    (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'rememberMe' ? e.target.checked : e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const loginUser = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isOnline) return;
      onSubmit(formData);
    },
    [isOnline, onSubmit, formData]
  );
  
  const signInWithGoogle = useCallback(
    async () => {
      if (!isOnline) return;
      await submitGoogle(formData);
    }
    ,
    [isOnline, submitGoogle]
  );

    return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 rounded-3xl border border-gray-200 shadow-2xl hover:shadow-3xl p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1">
      
      {/* Form Header */}
      <div className="text-center mb-10 space-y-4 animate-fade-in">
        <div className="relative inline-block mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          <div className="absolute inset-2 bg-gradient-to-r from-blue-300 to-blue-200 rounded-full blur-lg opacity-20"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-4 ring-blue-200/50">
            <Icon name="LogIn" size={ICON_SIZE} className="text-white drop-shadow-lg" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-sm text-gray-600 max-w-xs mx-auto font-medium leading-relaxed">Sign in to manage your business with ease</p>
        </div>
      </div>

      {/* Feedback Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl flex items-start space-x-3 animate-pulse shadow-md" role="status">
          <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5 animate-bounce" />
          <div>
            <p className="text-sm font-bold text-green-900">{successMessage}</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl flex items-start space-x-3 shadow-md" role="alert">
          <Icon name="AlertCircle" size={20} className="text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-red-900">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={loginUser} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5 animate-fade-in-delay" style={{ animationDelay: '0.1s' }}>
          <label className="block text-sm font-semibold text-gray-700">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              required
              disabled={!isOnline || isLoading}
              className="relative w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg transition-all text-sm bg-white/80 hover:bg-white hover:border-gray-300"
            />
          </div>
          {errors.email && <p className="text-xs text-red-600 font-semibold mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 animate-fade-in-delay" style={{ animationDelay: '0.2s' }}>
          <label className="block text-sm font-semibold text-gray-700">Password</label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
            <Input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              required
              disabled={!isOnline || isLoading}
              className="relative w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg transition-all text-sm bg-white/80 hover:bg-white hover:border-gray-300"
            />
          </div>
          {errors.password && <p className="text-xs text-red-600 font-semibold mt-1">{errors.password}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between py-2 animate-fade-in-delay" style={{ animationDelay: '0.3s' }}>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange('rememberMe')}
              disabled={!isOnline || isLoading}
              className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 cursor-pointer accent-blue-600 transition-all group-hover:border-blue-400"
            />
            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Remember me</span>
          </label>
          
          <a
            href="/forgot-password"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!isOnline || isLoading || !formData.email || !formData.password}
          iconName="LogIn"
          iconPosition="left"
          className="py-3 text-base font-bold bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-60 disabled:shadow-md mt-6 relative overflow-hidden group"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500 font-medium">Or continue with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <div className="grid grid-cols-2 gap-2 animate-fade-in-delay" style={{ animationDelay: '0.4s' }}>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all font-bold text-gray-700 text-sm group space-x-3"
          disabled={isLoading}
          onClick={signInWithGoogle}
        >
          <img src={GoogleLogo} alt="Google" className="w-5 h-5 object-contain" />
          <span>Google</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all font-bold text-gray-700 text-sm group"
          disabled={isLoading}
        >
          <img src={AppleLogo} alt="Apple" className="w-8 h-8 object-contain" />
          <span>Apple</span>
        </button>
      </div>

        
      </form>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg flex items-start space-x-3 shadow-md animate-pulse">
          <Icon name="WifiOff" size={18} className="text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-amber-900">No Internet Connection</p>
            <p className="text-xs text-amber-700 mt-1">Please check your connection and try again</p>
          </div>
        </div>
      )}

      {/* Sign Up Link */}
      <div className="mt-8 text-center border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-700">
          Don't have an account?{' '}
          <a
            href="/sign-up"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
          >
            Create one
          </a>
        </p>
      </div>

    </div>
  )


};

export default LoginForm;