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

  return (
    <Tab.Navigator
      initialRouteName="Create"
      backBehavior="order"
      activeColor={Colors.wheatish}
      shifting={true}>
      <Tab.Screen
        name="Create"
        options={{
          tabBarLabel: 'Create',
          tabBarColor: isDarkMode ? Colors.darkBlue : Colors.lightBlue,
          tabBarIcon: ({color}) => (
            <Ionicons name="md-create-sharp" color={color} size={24} />
          ),
          tabBarAccessibilityLabel: 'Create a new PDF',
        }}
        initialParams={{gotImages: []}}
        component={CreateScreen}
      />
      <Tab.Screen
        name="Modify"
        options={{
          tabBarLabel: 'Modify',
          tabBarColor: isDarkMode ? Colors.darkGreen : Colors.lightGreen,
          tabBarIcon: ({color}) => (
            <Ionicons name="md-duplicate-sharp" color={color} size={24} />
          ),
          tabBarAccessibilityLabel: 'Modify an existing PDF',
        }}
        initialParams={{gotImages: []}}
        component={ModifyScreen}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
