import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Checkbox from '../../../components/ui/Checkbox';
import { useSession, updateUser, changePassword, listAccounts } from '../../../lib/auth-client';
import { getUserProfile } from '../../../api/users';
import { useFetch } from '../../../hooks/useFetch';

// Zod schemas for validation
const userAccountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type UserAccountFormData = z.infer<typeof userAccountSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface UserAccountSectionProps {
  onUpdate?: () => void;
}

const UserAccountSection: React.FC<UserAccountSectionProps> = ({ onUpdate }) => {
  const { data: session, isPending: isSessionLoading } = useSession();
  
  // Fetch user profile with shop phone number from backend
  const { data: userProfile, loading: isProfileLoading } = useFetch(
    () => getUserProfile(),
    [session?.user?.id]
  );
  
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [hasCredentialAccount, setHasCredentialAccount] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // User account form
  const {
    register: registerAccount,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors, isDirty: hasAccountChanges },
    reset: resetAccountForm,
    setValue: setAccountValue,
    watch: watchAccount,
  } = useForm<UserAccountFormData>({
    resolver: zodResolver(userAccountSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      marketingEmails: true,
      securityAlerts: true,
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Sync session data and shop phone to form
  useEffect(() => {
    if (session?.user) {
      resetAccountForm({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: userProfile?.activeShop?.phone || '',
        marketingEmails: true,
        securityAlerts: true,
      });
    }
  }, [session, userProfile, resetAccountForm]);

  // Check if user has credential account (for password change)
  useEffect(() => {
    const checkAccounts = async () => {
      try {
        const { data: accounts } = await listAccounts();
        if (accounts) {
          const hasCredential = accounts.some(
            (account: any) => account.providerId === 'credential'
          );
          setHasCredentialAccount(hasCredential);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    
    if (session?.user) {
      checkAccounts();
    }
  }, [session]);

  const onAccountSubmit = async (data: UserAccountFormData) => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const { error } = await updateUser({
        name: data.name,
      });

      if (error) {
        setUpdateError(error.message || 'Failed to update profile');
      } else {
        setUpdateSuccess('Profile updated successfully');
        onUpdate?.();
        resetAccountForm(data);
      }
    } catch (err: any) {
      setUpdateError(err?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const { error } = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setPasswordError(error.message || 'Failed to change password');
      } else {
        setPasswordSuccess('Password changed successfully');
        resetPasswordForm();
        setShowPasswordForm(false);
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false);
    resetPasswordForm();
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  const handleCancelAccountChanges = () => {
    if (session?.user) {
      resetAccountForm({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: userProfile?.activeShop?.phone || '',
        marketingEmails: true,
        securityAlerts: true,
      });
    }
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  // Watch checkbox values for controlled behavior
  const marketingEmails = watchAccount('marketingEmails');
  const securityAlerts = watchAccount('securityAlerts');

  if (isSessionLoading || isProfileLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading account information...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Icon name="AlertCircle" size={48} className="text-destructive mb-4" />
          <p className="text-destructive">Unable to load account information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">User Account</h3>
            <p className="text-sm text-muted-foreground">Manage your account settings and security</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {updateSuccess && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <p className="text-sm text-success">{updateSuccess}</p>
        </div>
      )}
      {updateError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{updateError}</p>
        </div>
      )}

      <form onSubmit={handleAccountSubmit(onAccountSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground mb-3">Account Information</h4>
            
            <Input
              label="Full Name"
              type="text"
              {...registerAccount('name')}
              error={accountErrors.name?.message}
              placeholder="Enter your full name"
            />

            <Input
              label="Email Address"
              type="email"
              {...registerAccount('email')}
              error={accountErrors.email?.message}
              placeholder="Enter your email address"
              disabled
              description="Contact support to change your email address"
            />

            <Input
              label="Phone Number"
              type="tel"
              {...registerAccount('phone')}
              error={accountErrors.phone?.message}
              placeholder="Enter your phone number"
            />

            <div className="space-y-3 mt-6">
              <h5 className="font-medium text-foreground">Email Preferences</h5>
              
              <Checkbox
                label="Marketing emails"
                description="Receive updates about new features and tips"
                checked={marketingEmails}
                onChange={(e) => setAccountValue('marketingEmails', e?.target?.checked ?? false, { shouldDirty: true })}
              />

              <Checkbox
                label="Security alerts"
                description="Get notified about account security events"
                checked={securityAlerts}
                onChange={(e) => setAccountValue('securityAlerts', e?.target?.checked ?? false, { shouldDirty: true })}
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-6">
            <h4 className="font-medium text-foreground">Security Settings</h4>
            
            {/* Password Section */}
            {hasCredentialAccount && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-foreground">Password</h5>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    Change Password
                  </Button>
                </div>

                {showPasswordForm && (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    {passwordSuccess && (
                      <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                        <p className="text-sm text-success">{passwordSuccess}</p>
                      </div>
                    )}
                    {passwordError && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">{passwordError}</p>
                      </div>
                    )}

                    <Input
                      label="Current Password"
                      type="password"
                      {...registerPassword('currentPassword')}
                      error={passwordErrors.currentPassword?.message}
                      placeholder="Enter current password"
                    />

                    <Input
                      label="New Password"
                      type="password"
                      {...registerPassword('newPassword')}
                      error={passwordErrors.newPassword?.message}
                      placeholder="Enter new password"
                      description="Must be at least 8 characters"
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      {...registerPassword('confirmPassword')}
                      error={passwordErrors.confirmPassword?.message}
                      placeholder="Confirm new password"
                    />

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelPasswordChange}
                        disabled={isChangingPassword}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handlePasswordSubmit(onPasswordSubmit)}
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword ? (
                          <>
                            <Icon name="Loader2" size={14} className="animate-spin mr-2" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* OAuth Account Notice */}
            {!hasCredentialAccount && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-muted-foreground mt-0.5" />
                  <div>
                    <h5 className="font-medium text-foreground">Social Login Account</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your account is connected via social login. Password management is handled by your social provider.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Session Information */}
            <div className="space-y-3">
              <h5 className="font-medium text-foreground">Session Information</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Monitor" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email} • Active now
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-success font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Account Created */}
            <div className="space-y-3">
              <h5 className="font-medium text-foreground">Account Details</h5>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.createdAt 
                        ? new Date(session.user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {hasAccountChanges && (
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelAccountChanges}
              disabled={isUpdating}
            >
              Cancel Changes
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isUpdating}
              iconName={isUpdating ? "Loader2" : "Save"}
              iconPosition="left"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserAccountSection;