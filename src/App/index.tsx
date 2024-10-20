import Header from '@/components/Header';
import {useAuth} from '@/contexts/AuthContext';
import WelcomeScreen from '@/screens/Public/WelcomeScreen';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';

const Stack = createNativeStackNavigator();

const AppConfig = () => {
  const {isLoggedIn} = useAuth();

  const HeaderComponent = useCallback((props: NativeStackHeaderProps) => {
    return <Header {...props} centerText="The Calendar App" />;
  }, []);

  // if user isn't logged in then show him the public screen for setting up an account or logging in
  if (!isLoggedIn) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            header: HeaderComponent,
          }}
        />
      </Stack.Navigator>
    );
  }

  return null;
};

export default AppConfig;
