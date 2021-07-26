import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import nodejs from 'nodejs-mobile-react-native';

import HomeStack from './components/homeStack';
import {
  getCameraPermission,
  getStoragePermission,
  setStorageTreeUri,
} from './services/permissions';

const App = () => {
  useEffect(() => {
    async function getAccess() {
      await getCameraPermission();
      await getStoragePermission();
      await setStorageTreeUri();
    }
    getAccess();
    nodejs.start('main.js', {redirectOutputToLogcat: false});
    nodejs.channel.addListener('message', msg => {
      console.warn(msg);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
