import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserAccountSection = ({ userAccount, onUpdate }) => {
  const [formData, setFormData] = useState(userAccount);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (passwordErrors?.[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData?.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData?.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePassword()) {
      // Mock password change - in real app, this would call an API
      alert('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
  };

  const handleEnable2FA = () => {
    // Mock 2FA setup - in real app, this would show QR code or send SMS
    alert('Two-factor authentication setup initiated. Check your email for instructions.');
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground mb-3">Account Information</h4>
          
          <Input
            label="Full Name"
            type="text"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            placeholder="Enter your full name"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            placeholder="Enter your email address"
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            placeholder="Enter your phone number"
          />

          <div className="space-y-3 mt-6">
            <h5 className="font-medium text-foreground">Email Preferences</h5>
            
            <Checkbox
              label="Marketing emails"
              description="Receive updates about new features and tips"
              checked={formData?.marketingEmails}
              onChange={(e) => handleInputChange('marketingEmails', e?.target?.checked)}
            />

            <Checkbox
              label="Security alerts"
              description="Get notified about account security events"
              checked={formData?.securityAlerts}
              onChange={(e) => handleInputChange('securityAlerts', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-6">
          <h4 className="font-medium text-foreground">Security Settings</h4>
          
          {/* Password Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-foreground">Password</h5>
                <p className="text-sm text-muted-foreground">Last changed: October 15, 2025</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                Change Password
              </Button>
            </div>

            {showPasswordForm && (
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData?.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                  error={passwordErrors?.currentPassword}
                  placeholder="Enter current password"
                />

                <Input
                  label="New Password"
                  type="password"
                  value={passwordData?.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                  error={passwordErrors?.newPassword}
                  placeholder="Enter new password"
                  description="Must be at least 8 characters"
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData?.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                  error={passwordErrors?.confirmPassword}
                  placeholder="Confirm new password"
                />

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handlePasswordSubmit}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-foreground">Two-Factor Authentication</h5>
                <p className="text-sm text-muted-foreground">
                  {formData?.twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {formData?.twoFactorEnabled && (
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="Shield" size={16} />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                )}
                <Button
                  variant={formData?.twoFactorEnabled ? "outline" : "default"}
                  size="sm"
                  onClick={handleEnable2FA}
                >
                  {formData?.twoFactorEnabled ? 'Manage' : 'Enable 2FA'}
                </Button>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Active Sessions</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Monitor" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Current Session</p>
                    <p className="text-xs text-muted-foreground">Chrome on Windows • New York, NY</p>
                  </div>
                </div>
                <span className="text-xs text-success font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Smartphone" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Mobile App</p>
                    <p className="text-xs text-muted-foreground">iPhone • Last active 2 hours ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Icon name="LogOut" size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => {
              setFormData(userAccount);
              setHasChanges(false);
            }}
          >
            Cancel Changes
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserAccountSection;