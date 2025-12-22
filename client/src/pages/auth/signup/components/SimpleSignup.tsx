import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

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

interface SimpleSignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  isLoading?: boolean;
}

const SimpleSignupForm = ({ onSubmit, isLoading }: SimpleSignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched', // Validates as the user types
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          {...register('fullName')}
          error={errors.fullName?.message}
          disabled={isLoading}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          {...register('email')}
          error={errors.email?.message}
          disabled={isLoading}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            {...register('password')}
            error={errors.password?.message}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          disabled={isLoading}
        />

        <p className="text-[11px] text-muted-foreground text-left mt-6">
          By clicking signup, you agree to our{' '}
          <Link to="/terms" className="text-primary underline underline-offset-4">Terms</Link> and{' '}
          <Link to="/privacy" className="text-primary underline underline-offset-4">Privacy Policy</Link>.
        </p>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          iconName="UserPlus"
        >
          Create Account
        </Button>
      </form>

      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">Or </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 border-border hover:bg-muted"
          onClick={() => console.log('Google Signup')}
          disabled={isLoading}
        >
          <Icon name="Chrome" size={18} className="text-[#4285F4]" />
          <span className="text-sm font-medium">Google</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 border-border hover:bg-muted"
          onClick={() => console.log('Apple Signup')}
          disabled={isLoading}
        >
          <Icon name="Apple" size={18} className="text-foreground" />
          <span className="text-sm font-medium">Apple</span>
        </Button>
      </div>

      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>

    

  );
};

export default SimpleSignupForm;