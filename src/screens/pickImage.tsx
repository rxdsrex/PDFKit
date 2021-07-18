import React, {useState, useEffect} from 'react';
import {Text, Dimensions, View, FlatList, Image, Pressable} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

import styles from '../components/styles';
import {renderItemProps, imgRouteProps, Results} from '../types';
import Colors from '../colors';

const PickImagesScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const route: imgRouteProps = useRoute();

  const imagesInit: Results[] = [];
  const [images, setImages] = useState(imagesInit);

  const {width} = Dimensions.get('window');
  const IMAGE_WIDTH = width - 24;

  const css = styles(isDarkMode, IMAGE_WIDTH);
  const [backScreenName, setBackScreenName] = useState('');

  useEffect(() => {
    setImages(route.params.gotImages);
    setBackScreenName(route.params.backScreenName);
  }, [route.params.gotImages, route.params.backScreenName]);

  const onDelete = (value: Results) => {
    const data = images.filter(
      item =>
        item?.localIdentifier &&
        item?.localIdentifier !== value?.localIdentifier,
    );
    setImages(data);
  };

  const renderItem = ({item}: renderItemProps) => {
    return (
      <View>
        <Image
          width={IMAGE_WIDTH}
          source={{
            uri: item?.path,
          }}
          style={css.media}
        />
        <Pressable onPress={() => onDelete(item)} style={css.buttonDelete}>
          <Text style={css.titleDelete}>x</Text>
        </Pressable>
      </View>
    );
  };

  const getImages = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'image',
        isPreview: false,
        selectedAssets: images,
        maxSelectedAssets: 50,
        selectedColor: '#1e84b0',
      });
      setImages(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <SafeAreaView
      style={[
        css.default,
        {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
      ]}>
      <Text style={css.textHeading}>Selected Images</Text>
      <View style={css.default}>
        <FlatList
          data={images}
          keyExtractor={(item, index) => (item?.filename ?? item?.path) + index}
          renderItem={renderItem}
          numColumns={1}
        />
      </View>
      <View style={css.selectView}>
        <Button
          style={css.buttonClose}
          color="red"
          mode="contained"
          uppercase={false}
          onPress={function () {
            navigation.navigate(backScreenName, {
              gotImages: images,
            });
          }}>
          <Text style={css.text}>Done</Text>
        </Button>
        <Button
          style={css.buttonAdd}
          color="green"
          mode="contained"
          uppercase={false}
          onPress={getImages}>
          <Text style={css.text}>Add</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PickImagesScreen;
