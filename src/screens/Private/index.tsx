import Header from '@/components/Header';
import Events from '@/screens/Private/Events';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';

const Tab = createBottomTabNavigator();

const PrivateScreens = () => {
  const HeaderComponent = useCallback((props: NativeStackHeaderProps) => {
    return <Header {...props} rightText />;
  }, []);

  const HeaderComponentWelcome = useCallback(
    (props: NativeStackHeaderProps) => {
      return <Header rightText isisLandingScreen {...props} />;
    },
    [],
  );

  return (
    <Tab.Navigator screenOptions={{}}>
      <Tab.Screen
        name="Events"
        component={Events}
        // options={{
        //   header: HeaderComponentWelcome,
        // }}
      />
    </Tab.Navigator>
  );
};

export default PrivateScreens;
