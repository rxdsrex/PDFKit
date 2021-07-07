import React from 'react';
import {Text, View, ScrollView} from 'react-native';

import styles from './styling/styles';
import {ScreenProps} from '../types';

const ModifyScreen = ({isDarkMode}: ScreenProps) => {
  return (
    <ScrollView contentContainerStyle={styles(isDarkMode).default}>
      <View style={styles(isDarkMode).default}>
        <Text style={styles(isDarkMode).text}>Modify Screen!</Text>
      </View>
    </ScrollView>
  );
};

export default ModifyScreen;
