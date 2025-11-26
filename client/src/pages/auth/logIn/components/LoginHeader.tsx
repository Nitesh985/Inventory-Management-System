import React from 'react';
import AuthenticationHeader from '../../../../components/ui/AuthenticationHeader';
import { LoginHeaderProps } from '../types';

const LoginHeader = ({ isOnline }: LoginHeaderProps) => {
  return (
    <AuthenticationHeader 
      showConnectivityStatus={true}
      isOnline={isOnline}
    />
  );
};

export default LoginHeader;