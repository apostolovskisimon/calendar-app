import {useAuth} from '@/contexts/AuthContext';
import PrivateScreens from '@/screens/Private';
import PublicScreens from '@/screens/Public';
import React from 'react';

const AppConfig = () => {
  const {user} = useAuth();

  if (!!user && user.email) {
    return <PrivateScreens />;
  }
  // if user isn't logged in then show him the public screen for setting up an account or logging in
  return <PublicScreens />;
};

export default AppConfig;
