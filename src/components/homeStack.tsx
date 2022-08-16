import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeTabs from './homeTabs';
import PickImage from '../screens/pickImage';

const RootStack = createStackNavigator();

const HomeStack = () => {
  return (
    <RootStack.Navigator initialRouteName="Home" screenOptions={{headerShown: false, headerMode: 'screen'}}>
      <RootStack.Screen name="Home" component={HomeTabs} />
      <RootStack.Screen name="PickImage" component={PickImage} />
    </RootStack.Navigator>
  );
};

export default HomeStack;
