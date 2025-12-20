//src/components/ui/AuthenticationFooter.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

interface AuthenticationFooterProps {
  currentPage: 'login' | 'register';
  className?: string;
}

const AuthenticationFooter = ({ 
  currentPage, 
  className = '' 
}: AuthenticationFooterProps) => {
  return (
    <footer className={`w-full bg-card border-t border-border ${className}`}>
      <div className="max-w-md mx-auto px-6 py-6 space-y-4">
        {/* Navigation Links */}
        <div className="flex flex-col space-y-3 text-center">
          {currentPage === 'login' ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center space-x-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
              >
                <Icon name="UserPlus" size={16} />
                <span>Create Account</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
              >
                <Icon name="LogIn" size={16} />
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Forgot Password Link (only on login) */}
          {currentPage === 'login' && (
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center space-x-2 text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              <Icon name="Key" size={14} />
              <span>Forgot Password?</span>
            </Link>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-muted-foreground">
          <Link
            to="/terms"
            className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
          >
            <Icon name="FileText" size={12} />
            <span>Terms of Service</span>
          </Link>
          
          <Link
            to="/privacy"
            className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
          >
            <Icon name="Shield" size={12} />
            <span>Privacy Policy</span>
          </Link>
          
          <Link
            to="/support"
            className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
          >
            <Icon name="HelpCircle" size={12} />
            <span>Support</span>
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Lock" size={12} className="text-success" />
            <span>SSL Secured</span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Database" size={12} className="text-primary" />
            <span>Data Protected</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            © 2024 Digital Khata. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AuthenticationFooter;