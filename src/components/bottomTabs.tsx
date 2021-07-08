import React from 'react';
import {useColorScheme} from 'react-native';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../colors';
import CreateScreen from '../screens/create';
import ModifyScreen from '../screens/modify';
import PickImagesScreen from '../screens/pickImage';

const BottomTabs = () => {
  const Tab = createMaterialBottomTabNavigator();
  const CreateStack = createStackNavigator();
  const ModifyStack = createStackNavigator();

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
        children={() => (
          <CreateStack.Navigator initialRouteName="CreatePdf" headerMode="none">
            <CreateStack.Screen
              name="CreatePdf"
              children={() => <CreateScreen />}
            />
            <CreateStack.Screen
              name="PickImage"
              children={() => <PickImagesScreen backScreenName="CreatePdf" />}
            />
          </CreateStack.Navigator>
        )}
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
        children={() => (
          <ModifyStack.Navigator initialRouteName="ModifyPdf" headerMode="none">
            <ModifyStack.Screen
              name="ModifyPdf"
              children={() => <ModifyScreen />}
            />
            <ModifyStack.Screen
              name="PickImage"
              children={() => <PickImagesScreen backScreenName="ModifyPdf" />}
            />
          </ModifyStack.Navigator>
        )}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
