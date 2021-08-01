import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LogBox} from 'react-native';

import nodejs from 'nodejs-mobile-react-native';

import HomeStack from './components/homeStack';
import {
  getCameraPermission,
  getStoragePermission,
  setStorageTreeUri,
} from './services/permissions';

LogBox.ignoreLogs([
  'ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.',
]);

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
