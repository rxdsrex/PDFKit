import React from 'react';
import {Text, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from '../components/styles';
import {imgRouteProps} from '../types';
import {Results} from '@baronha/react-native-multiple-image-picker';

const CreateScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const route: imgRouteProps = useRoute();
  const css = styles(isDarkMode);

  const images: Results[] = route.params ? route.params.gotImages : [];

  return (
    <ScrollView contentContainerStyle={[css.default, css.centerDiv]}>
      <SafeAreaView style={[css.default, css.centerDiv]}>
        <Button
          color="blue"
          mode="contained"
          uppercase={false}
          onPress={function () {
            navigation.navigate('PickImage', {backScreenName: 'Create'});
          }}>
          <Text style={css.text}>Pick Images</Text>
        </Button>
        <Text style={css.text}>Create Screen!</Text>
        <Text style={css.text}>{images.length} images selected!</Text>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateScreen;
