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

import Colors from './components/colors';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CreateScreen from './screens/create';
import ModifyScreen from './screens/modify';

const Tab = createMaterialBottomTabNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Create"
        backBehavior="order"
        activeColor="#e91e63"
        barStyle={backgroundStyle}>
        <Tab.Screen
          name="Create"
          options={{
            tabBarLabel: 'Create',
            tabBarIcon: ({color}) => (
              <Ionicons name="md-create-sharp" color={color} size={24} />
            ),
            tabBarAccessibilityLabel: 'Create a new PDF',
          }}
          children={() => <CreateScreen isDarkMode />}
        />
        <Tab.Screen
          name="Modify"
          children={() => <ModifyScreen isDarkMode />}
          options={{
            tabBarLabel: 'Modify',
            tabBarIcon: ({color}) => (
              <Ionicons name="md-duplicate-sharp" color={color} size={24} />
            ),
            tabBarAccessibilityLabel: 'Modify an existing PDF',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
