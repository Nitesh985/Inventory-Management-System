import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

interface SimpleSignupFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const SimpleSignupForm = ({ onSubmit, isLoading }: SimpleSignupFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Social Logins */}
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

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={isLoading}
        />

        <p className="text-[11px] text-muted-foreground text-center">
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