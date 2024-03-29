import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import nodejs from 'nodejs-mobile-react-native';

import HomeStack from './components/homeStack';
import {getCameraPermission, getStoragePermission, setStorageTreeUri} from './services/permissions';
import {RootStackParamList} from './types';
import {displayAlert} from './utils/alerts';

LogBox.ignoreLogs([
  'ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.',
]);

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const App = () => {
  useEffect(() => {
    async function getAccessNStartNode() {
      try {
        await getCameraPermission();
        await getStoragePermission();
        await setStorageTreeUri();
        await AsyncStorage.setItem('nodeInit', 'false');
        nodejs.start('main.js', {redirectOutputToLogcat: false});
        nodejs.channel.addListener('message', async msg => {
          if (msg === 'NodeInit') {
            await AsyncStorage.setItem('nodeInit', 'true');
          }
        });
      } catch (err: any) {
        displayAlert('Error', err.message);
      }
    }
    getAccessNStartNode();
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
