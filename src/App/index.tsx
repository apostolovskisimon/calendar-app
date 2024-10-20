import {useAuth} from '@/contexts/AuthContext';
import PublicScreens from '@/screens/Public';
import React from 'react';

const AppConfig = () => {
  const {isLoggedIn} = useAuth();

  // if user isn't logged in then show him the public screen for setting up an account or logging in
  if (!isLoggedIn) {
    return <PublicScreens />;
  }

  return null;
};

export default AppConfig;
