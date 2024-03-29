import React, {useState, useEffect, useCallback} from 'react';
import {Text, Dimensions, View, Image, Pressable, Vibration} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MultipleImagePicker, {Results} from '@baronha/react-native-multiple-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DraggableFlatList, {RenderItemParams} from 'react-native-draggable-flatlist';

import styles from '../components/styles';
import {imgRouteProps} from '../types';
import Colors from '../colors';
import {displayAlert} from '../utils/alerts';

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

  const renderItem = useCallback(
    ({item, drag, isActive}: RenderItemParams<Results>) => {
      const onDelete = (value: Results) => {
        const data = images.filter(
          imageItem => imageItem?.localIdentifier && imageItem?.localIdentifier !== value?.localIdentifier,
        );
        setImages(data);
      };

      return (
        <View>
          <Pressable
            onLongPress={async () => {
              drag();
              setTimeout(() => {
                Vibration.vibrate(10, false);
              }, 0);
            }}>
            <Image
              source={{
                uri: item?.path,
                width: IMAGE_WIDTH,
              }}
              style={css.media}
              blurRadius={isActive ? 3 : 0}
              progressiveRenderingEnabled={true}
            />
            <Pressable
              onPress={() => {
                onDelete(item);
                setTimeout(() => {
                  Vibration.vibrate(10, false);
                }, 0);
              }}
              style={css.imageButtonDelete}>
              <Ionicons name="close-circle" color="white" size={20} />
            </Pressable>
          </Pressable>
        </View>
      );
    },
    [IMAGE_WIDTH, css.imageButtonDelete, css.media, images],
  );

  const getImages = async () => {
    setTimeout(() => {
      Vibration.vibrate(10, false);
    }, 0);
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'image',
        isPreview: false,
        selectedAssets: images,
        maxSelectedAssets: 50,
        selectedColor: '#1e84b0',
      });
      setImages(response);
    } catch (err: any) {
      displayAlert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={[css.default, {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}]}>
      <Text style={css.textHeading}>Selected Images</Text>
      <View style={styles(isDarkMode, 0, images.length).addImagesTextView}>
        <Text style={css.addImageText}>Add images</Text>
      </View>
      <View style={styles(isDarkMode, 0, images.length).imageView}>
        <DraggableFlatList
          data={images}
          keyExtractor={(item, index) => (item?.fileName ?? item?.path) + index}
          renderItem={renderItem}
          numColumns={1}
          onDragEnd={({data}) => {
            setTimeout(() => {
              Vibration.vibrate(10, false);
            }, 0);
            setImages(data);
          }}
          autoscrollSpeed={1200}
        />
      </View>
      <View style={css.selectView}>
        <Button style={css.buttonAdd} color="green" mode="contained" uppercase={false} onPress={getImages}>
          <Text style={css.text}>{images.length ? 'Add More' : 'Add'}</Text>
        </Button>
        <Button
          style={css.buttonClose}
          color="red"
          mode="contained"
          uppercase={false}
          onPress={function () {
            setTimeout(() => {
              Vibration.vibrate(10, false);
            }, 0);
            navigation.navigate(backScreenName as 'Create' | 'Modify', {
              gotImages: images,
            });
          }}>
          <Text style={css.text}>Done</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PickImagesScreen;
