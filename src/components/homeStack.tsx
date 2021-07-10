import React from 'react';
import {useColorScheme} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import Colors from '../colors';
import CreateScreen from '../screens/create';
import ModifyScreen from '../screens/modify';

const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const bottomBarStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Tab.Navigator
      initialRouteName="Create"
      backBehavior="order"
      activeColor="#e91e63"
      barStyle={bottomBarStyle}>
      <Tab.Screen
        name="Create"
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({color}) => (
            <Ionicons name="md-create-sharp" color={color} size={24} />
          ),
          tabBarAccessibilityLabel: 'Create a new PDF',
        }}
        component={CreateScreen}
      />
      <Tab.Screen
        name="Modify"
        options={{
          tabBarLabel: 'Modify',
          tabBarIcon: ({color}) => (
            <Ionicons name="md-duplicate-sharp" color={color} size={24} />
          ),
          tabBarAccessibilityLabel: 'Modify an existing PDF',
        }}
        component={ModifyScreen}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
