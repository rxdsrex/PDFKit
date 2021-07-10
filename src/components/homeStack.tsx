import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeTabs from './homeTabs';
import PickImage from '../screens/pickImage';

const RootStack = createStackNavigator();

const HomeStack = () => {
  return (
    <RootStack.Navigator
      headerMode="none"
      initialRouteName="Home"
      screenOptions={{headerShown: false, animationTypeForReplace: 'pop'}}>
      <RootStack.Screen name="Home" component={HomeTabs} />
      <RootStack.Screen name="PickImage" component={PickImage} />
    </RootStack.Navigator>
  );
};

export default HomeStack;
