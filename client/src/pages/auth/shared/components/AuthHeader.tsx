import AuthenticationHeader from '@/components/ui/AuthenticationHeader';
import type { AuthHeaderProps } from '../types';

const AuthHeader = ({ isOnline }: AuthHeaderProps) => {
  return (
    <AuthenticationHeader 
      showConnectivityStatus={true}
      isOnline={isOnline}
    />
  );
};

export default AuthHeader;