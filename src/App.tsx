/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
import nodejs from 'nodejs-mobile-react-native';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeStack from './components/homeStack';

const App = () => {
  useEffect(() => {
    const listener = (msg: string) => {
      console.log('Message from Node: ' + msg);
    };
    nodejs.start('main.js', {redirectOutputToLogcat: false});
    nodejs.channel.addListener('message', listener);

    // returned function will be called on component unmount
    return () => {
      nodejs.channel.removeListener('message', listener);
    };
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
