import {Button, Text} from '@rneui/themed';
import React, {forwardRef, ReactNode} from 'react';
import {
  DrawerLayoutAndroid,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {Mode} from 'react-native-big-calendar';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  onChangeCalendarMode: (mode: Mode) => void;
};

const Drawer = forwardRef(function Drawer(
  {children, onChangeCalendarMode}: Props,
  ref,
) {
  const {width} = useWindowDimensions();

  return (
    <DrawerLayoutAndroid
      ref={ref as React.RefObject<DrawerLayoutAndroid>}
      drawerPosition="left"
      drawerWidth={width - 120}
      renderNavigationView={() => (
        <SafeAreaView style={{flex: 1}}>
          <View style={[styles.container, styles.navigationContainer]}>
            <View style={{gap: 4}}>
              <Text style={styles.paragraph}>Change Calendar View Mode</Text>
              <Button
                title={'Day Mode'}
                onPress={() => onChangeCalendarMode('day')}
              />
              <Button
                title={'3 day Mode'}
                onPress={() => onChangeCalendarMode('3days')}
              />
              <Button
                title={'Week Mode'}
                onPress={() => onChangeCalendarMode('week')}
              />
              <Button
                title={'Month'}
                onPress={() => onChangeCalendarMode('month')}
              />
            </View>
            <Button
              title="Close drawer"
              onPress={() =>
                (
                  ref as React.RefObject<DrawerLayoutAndroid>
                ).current?.closeDrawer()
              }
            />
          </View>
        </SafeAreaView>
      )}>
      {children}
    </DrawerLayoutAndroid>
  );
});

export default Drawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});
