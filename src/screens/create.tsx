import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';

import styles from './styling/styles';
import {ScreenProps} from '../types';

const CreateScreen = ({isDarkMode}: ScreenProps) => {
  const [isPress, setIsPress] = React.useState(false);
  return (
    <ScrollView contentContainerStyle={styles(isDarkMode).default}>
      <View style={styles(isDarkMode).default}>
        <Button
          color={isPress ? 'blue' : 'red'}
          mode="contained"
          uppercase={false}
          onPress={function () {
            isPress ? setIsPress(false) : setIsPress(true);
          }}>
          <Text style={styles(isDarkMode).text}>Button Example</Text>
        </Button>
        <Text style={styles(isDarkMode).text}>Home Screen!</Text>
      </View>
    </ScrollView>
  );
};

export default CreateScreen;
