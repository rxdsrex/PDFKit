import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';

import styles from './styling/styles';
import {imgPickerScreenProps} from '../types';

const PickImagesScreen = ({backScreenName}: imgPickerScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
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
            navigation.navigate(backScreenName);
          }}>
          <Text style={styles(isDarkMode).text}>
            Go back to {backScreenName}
          </Text>
        </Button>
        <Text style={styles(isDarkMode).text}>Image Picker Screen!</Text>
      </View>
    </ScrollView>
  );
};

export default PickImagesScreen;
