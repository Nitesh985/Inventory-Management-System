import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import type { AuthFooterProps } from '../types';

const AuthFooter = ({ className = '' }: AuthFooterProps) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      {/* Registration Link */}
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

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Legal Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-muted-foreground">
        <a
          href="/terms"
          className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
        >
          <Icon name="FileText" size={12} />
          <span>Terms of Service</span>
        </a>
        
        <a
          href="/privacy"
          className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
        >
          <Icon name="Shield" size={12} />
          <span>Privacy Policy</span>
        </a>
        
        <a
          href="/support"
          className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
        >
          <Icon name="HelpCircle" size={12} />
          <span>Support</span>
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Digital Khata. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthFooter;