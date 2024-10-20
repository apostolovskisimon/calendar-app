import Header from '@/components/Header';
import RegisterScreen from '@/screens/Public/RegisterScreen';
import WelcomeScreen from '@/screens/Public/WelcomeScreen';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';

const Stack = createNativeStackNavigator();

const PublicScreens = () => {
  const HeaderComponent = useCallback((props: NativeStackHeaderProps) => {
    return <Header {...props} />;
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          header: HeaderComponent,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          header: HeaderComponent,
        }}
      />
    </Stack.Navigator>
  );
};

export default PublicScreens;
