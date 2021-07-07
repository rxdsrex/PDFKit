import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';

import styles from './styling/styles';

const CreateScreen = () => {
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
            navigation.navigate('PickImage');
          }}>
          <Text style={styles(isDarkMode).text}>Pick Images</Text>
        </Button>
        <Text style={styles(isDarkMode).text}>Home Screen!</Text>
      </View>
    </ScrollView>
  );
};

export default CreateScreen;
