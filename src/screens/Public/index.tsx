import Header from '@/components/Header';
import CompleteRegistration from '@/screens/Public/CompleteRegistration';
import RegisterScreen from '@/screens/Public/RegisterScreen';
import LandingScreen from '@/screens/Public/LandingScreen';
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

  const HeaderComponentWelcome = useCallback(
    (props: NativeStackHeaderProps) => {
      return <Header isisLandingScreen {...props} />;
    },
    [],
  );

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Welcome"
        component={LandingScreen}
        options={{
          header: HeaderComponentWelcome,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          header: HeaderComponent,
        }}
      />
      <Stack.Screen
        name="Complete Registration"
        component={CompleteRegistration}
        options={{
          header: HeaderComponent,
        }}
      />
    </Stack.Navigator>
  );
};

export default PublicScreens;
