import React from 'react';
import {Text, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from './styling/styles';
import {imgPickerScreenProps} from '../types';

const PickImagesScreen = ({backScreenName}: imgPickerScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const [isPress, setIsPress] = React.useState(false);
  return (
    <ScrollView contentContainerStyle={styles(isDarkMode).default}>
      <SafeAreaView style={styles(isDarkMode).default}>
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
      </SafeAreaView>
    </ScrollView>
  );
};

export default PickImagesScreen;
