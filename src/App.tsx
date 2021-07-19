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
    nodejs.channel.send('haha');

    // returned function will be called on component unmount
    return function cleanup() {
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
