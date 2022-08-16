/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import {Pressable, View, Text, Vibration} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useColorScheme} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DraggableFlatList, {RenderItemParams} from 'react-native-draggable-flatlist';

import {chapterListProps, chapterProps} from '../types';
import styles from '../components/styles';

const ChapterList = ({
  chapters,
  setChapters,
  setDonePicking,
  setImages,
  setChapterTitle,
  setChapterId,
  backScreenName,
}: chapterListProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const css = styles(isDarkMode);
  const navigation = useNavigation();

  const renderItem = useCallback(
    ({item, drag, isActive}: RenderItemParams<chapterProps>) => {
      const onDelete = (value: chapterProps) => {
        const data = chapters.filter(chapterItem => chapterItem.id && chapterItem.id !== value.id);
        setChapters(data);
      };

      return (
        <View style={[css.default, css.centerDiv, {marginTop: 15, flexDirection: 'column'}]}>
          <Pressable
            style={{
              backgroundColor: 'mediumslateblue',
              minWidth: 350,
              minHeight: 60,
              borderRadius: 4,
              borderColor: 'red',
              borderWidth: isActive ? 1 : 0,
            }}
            onLongPress={async () => {
              drag();
              setTimeout(() => {
                Vibration.vibrate(10, false);
              }, 0);
            }}>
            <Text
              style={[
                css.text,
                {
                  maxWidth: '70%',
                  textAlign: 'left',
                  left: 60,
                  textAlignVertical: 'center',
                },
              ]}>
              <Text style={{fontWeight: 'bold'}}>Title</Text>
              <Text>: {item.chapterTitle}</Text>
            </Text>
            <Text
              style={[
                css.text,
                {
                  maxWidth: '90%',
                  textAlign: 'left',
                  left: 60,
                  textAlignVertical: 'center',
                },
              ]}>
              <Text style={{fontWeight: 'bold'}}>Pages</Text>
              <Text>: {item.pages.length}</Text>
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onDelete(item);
              setTimeout(() => {
                Vibration.vibrate(10, false);
              }, 0);
            }}
            style={css.buttonDelete}>
            <Ionicons name="trash-outline" color="white" size={26} />
          </Pressable>
          <Pressable
            onPress={() => {
              setTimeout(() => {
                Vibration.vibrate(10, false);
              }, 0);
              setDonePicking(true);
              setImages(item.pages);
              setChapterTitle(item.chapterTitle);
              setChapterId(item.id);
              navigation.navigate('PickImage', {
                gotImages: item.pages,
                backScreenName: backScreenName,
              });
            }}
            style={css.buttonEdit}>
            <Ionicons name="create-outline" color="white" size={26} />
          </Pressable>
        </View>
      );
    },
    [backScreenName, chapters, css, navigation, setChapterId, setChapterTitle, setChapters, setDonePicking, setImages],
  );
  return (
    <DraggableFlatList
      style={{maxWidth: '85%'}}
      data={chapters}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      onDragEnd={({data}) => {
        setTimeout(() => {
          Vibration.vibrate(10, false);
        }, 0);
        setChapters(data);
      }}
      autoscrollSpeed={500}
      numColumns={1}
    />
  );
};

export default ChapterList;
