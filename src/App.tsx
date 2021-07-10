/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {useColorScheme} from 'react-native';

import Colors from './colors';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeStack from './components/homeStack';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          colors: {
            background: isDarkMode ? Colors.black : Colors.white,
            text: isDarkMode ? Colors.white : Colors.black,
            border: isDarkMode ? Colors.black : Colors.white,
            card: isDarkMode ? Colors.black : Colors.white,
            notification: isDarkMode ? Colors.lighter : Colors.lighter,
            primary: isDarkMode ? Colors.white : Colors.black,
          },
          dark: isDarkMode,
        }}>
        <HomeStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
