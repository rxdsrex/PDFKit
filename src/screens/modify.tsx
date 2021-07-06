import React from 'react';
import {Text, useColorScheme, View, ScrollView} from 'react-native';

import styles from './styling/styles';

const ModifyScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <ScrollView contentContainerStyle={styles(isDarkMode).default}>
      <View style={styles(isDarkMode).default}>
        <Text style={styles(isDarkMode).text}>Modify Screen!</Text>
      </View>
    </ScrollView>
  );
};

export default ModifyScreen;
