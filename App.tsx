import AppConfig from '@/App/index';
import {AuthContextProvider} from '@/contexts/AuthContext';
import theme from '@/services/theme';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '@rneui/themed';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <AuthContextProvider>
            <AppConfig />
          </AuthContextProvider>
          <Toast />
        </ThemeProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default App;
