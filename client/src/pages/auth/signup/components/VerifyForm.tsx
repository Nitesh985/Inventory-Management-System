import React, { useState, useEffect } from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

interface VerifyFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const VerifyForm = ({ onSubmit, isLoading }: VerifyFormProps) => {
  const [code, setCode] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Handle resend countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      // In a real app, you'd pass the code back to the parent
      onSubmit({ verificationCode: code });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="Mail" size={32} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Verify your email</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            We've sent a 6-digit verification code to your email address. Please enter it below.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Verification Code"
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="text-center text-2xl tracking-[1em] font-mono"
          required
          disabled={isLoading}
          autoFocus
        />
        
        <div className="flex justify-center">
          {resendTimer > 0 ? (
            <p className="text-xs text-muted-foreground">
              Resend code in <span className="font-bold text-foreground">{resendTimer}s</span>
            </p>
          ) : (
            <button 
              type="button" 
              className="text-xs text-primary hover:underline font-medium"
              onClick={() => setResendTimer(30)}
            >
              Didn't receive a code? Resend now
            </button>
          )}
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={code.length !== 6 || isLoading}
        loading={isLoading}
        iconName="ShieldCheck"
      >
        Verify Account
      </Button>
    </form>
  );
};

export default VerifyForm;