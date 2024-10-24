import CalendarHeader from '@/components/CalendarHeader';
import Icon from '@/components/Icon';
import {EventsContextProvider} from '@/contexts/EventsContext';
import Events from '@/screens/Private/Events';
import Profile from '@/screens/Private/Profile';
import {TabBarIconProps} from '@/services/types';
import {
  BottomTabHeaderProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Theme} from '@rneui/base';
import {Header, useTheme} from '@rneui/themed';
import React, {FC, useCallback} from 'react';
import {StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();

const PrivateScreens = () => {
  const PrivateHeader = useCallback(
    (props: BottomTabHeaderProps) => (
      <PrivateHeaderComponent routeName={props.route.name} />
    ),
    [],
  );

  const EventHeader = useCallback(
    (props: BottomTabHeaderProps) => <CalendarHeader {...props} />,
    [],
  );

  const TabBarIcon = useCallback(
    (props: TabBarIconProps & {iconName: string}) => {
      return <TabBarIconComponent {...props} />;
    },
    [],
  );

  const {theme} = useTheme();

  const styles = createStyles(theme);

  return (
    <EventsContextProvider>
      <Tab.Navigator screenOptions={{}}>
        <Tab.Screen
          name="Events"
          component={Events}
          options={{
            header: EventHeader,
            tabBarIcon: props =>
              TabBarIcon({...props, iconName: 'calendar-outline'}),
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            header: PrivateHeader,
            tabBarIcon: props =>
              TabBarIcon({...props, iconName: 'person-outline'}),
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        />
      </Tab.Navigator>
    </EventsContextProvider>
  );
};

export default PrivateScreens;

const TabBarIconComponent: FC<TabBarIconProps & {iconName: string}> = ({
  focused,
  iconName,
}) => {
  const {theme} = useTheme();
  return (
    <Icon
      name={iconName}
      color={focused ? theme.colors.success : theme.colors.white}
      size={30}
    />
  );
};

// type mismatch, for time sake making a simple header inside like the public one
const PrivateHeaderComponent: FC<{routeName: string}> = ({routeName = ''}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  return (
    <Header
      containerStyle={styles.container}
      centerComponent={{text: routeName, style: styles.text}}
    />
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {height: 110, alignItems: 'center'},
    text: {fontSize: 24, color: theme.colors.white, textAlign: 'left'},
    tabBarLabel: {
      color: theme.colors.white,
      fontWeight: 'bold',
      fontSize: 16,
    },
    tabBarStyle: {
      backgroundColor: theme.colors.secondary,
      height: 80,
      paddingBottom: 5,
    },
  });
