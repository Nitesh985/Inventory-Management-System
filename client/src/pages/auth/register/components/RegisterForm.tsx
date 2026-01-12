import { useMemo } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'
import { Link } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import FormValidationFeedback from '@/components/ui/FormValidationFeedback';
import Icon from '@/components/AppIcon';
import type { RegisterFormData, RegisterFormProps } from '../types';
import { signIn } from '@/lib/auth-client';



const RegisterForm = ({
  onSubmit,
  errors,
  isLoading,
  isOnline,
  successMessage
}: RegisterFormProps) => {
  const {register, handleSubmit, watch, control } = useForm<RegisterFormData>({
    defaultValues:{
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  const providerSignUp = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/business-dashboard"
    }, {
      onRequest: ()=>{
        setIsLoading(true)
      },
      onResponse: ()=>{
        setIsLoading(false)
      }
    })
  }

  const password = watch("password");

  const passwordStrength = useMemo(() => {
    if (!password) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Good';
    return 'Strong';
  }, [password]);

  const registerUser: SubmitHandler<RegisterFormData> = data => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-elevation-2 p-8">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-3">
          <Icon name="Box" size={20} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <p className="text-sm text-muted-foreground text-center mt-2">Get started — manage inventory, sales and customers securely.</p>
      </div>

      {successMessage && (
        <FormValidationFeedback type="success" message={successMessage} />
      )}

      {errors.general && (
        <FormValidationFeedback type="error" message={errors.general} />
      )}

      <form
        className="space-y-4"
        onSubmit={handleSubmit(registerUser)}
      >
        <Input
          {...register("fullName", { required: {value: true, message:"Full Name field not given"} })}
          label="Full Name"
          error={errors.fullName}
          required
        />

        <Input
          type="email"
          label="Email"
          {...register("email", { required: {value: true, message:"Email field not given"} })}
          error={errors.email}
          required
        />

        <Input
          type="password"
          label="Password"
          {...register("password", { required: {value: true, message:"Password field not given"} })}
          error={errors.password}
          required
        />
        {passwordStrength && (
          <p className="text-xs text-muted-foreground">Password strength: <span className="font-medium text-foreground">{passwordStrength}</span></p>
        )}

        <Input
          type="password"
          label="Confirm Password"
          {...register("confirmPassword", { required: {value: true, message:"Confirm Password field not given"}, 
          validate: value => value === watch("password") || "Passwords do not match" })}
          error={errors.confirmPassword}
          required
        />
        <Controller
          name="acceptTerms"
            control={control}
            rules={{ required: "You must accept the terms" }}
            render={({ field, fieldState }) => (
              <Checkbox
                label="I agree to the Terms and Privacy Policy"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                error={fieldState.error?.message}
              />
            )}
          />
        {errors.acceptTerms && (
          <p className="text-xs text-destructive">{errors.acceptTerms}</p>
        )}

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={!isOnline || isLoading}
        >
          Create Account
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </div>
        <div className="relative flex items-center my-6">
         <div className="flex-grow h-px bg-gray-300/60"></div>
         <span className="mx-4 text-sm text-gray-500">or</span>
         <div className="flex-grow h-px bg-gray-300/60"></div>
       </div>
        <Button
          type="button"
          variant="outline"
          fullWidth
          disabled={!isOnline || isLoading}
          onClick={providerSignUp}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Shield" size={18} />
            <span>Sign up with Google</span>
          </div>
        </Button>

                  <Button
          type="button"
          variant="outline"
          fullWidth
          disabled={!isOnline || isLoading}
          onClick={() => {
            // Placeholder for Google Sign-Up logic
          }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Apple" size={18} />
            <span>Sign up with Apple</span>
          </div>
        </Button>

      </form>
    </div>
  );
};

export default RegisterForm;
