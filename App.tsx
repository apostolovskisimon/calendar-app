import AppConfig from '@/App/index';
import {AuthContextProvider} from '@/contexts/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '@rneui/themed';
import React from 'react';
import {useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#393e42' : '#e1e8ee',
  };
  return (
    <NavigationContainer>
      <SafeAreaProvider style={backgroundStyle}>
        <ThemeProvider>
          <AuthContextProvider>
            <AppConfig />
          </AuthContextProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default App;
