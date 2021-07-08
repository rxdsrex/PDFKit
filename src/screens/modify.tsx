import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from './styling/styles';

const ModifyScreen = () => {
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
            navigation.navigate('PickImage');
          }}>
          <Text style={styles(isDarkMode).text}>Pick Images</Text>
        </Button>
        <Text style={styles(isDarkMode).text}>Modify Screen!</Text>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ModifyScreen;
