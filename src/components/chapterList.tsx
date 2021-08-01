/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, Pressable, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useColorScheme} from 'react-native';

import {chapterListProps, chapterProps, renderChapterProps} from '../types';
import styles from '../components/styles';
import {useNavigation} from '@react-navigation/native';

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

  const onDelete = (value: chapterProps) => {
    const data = chapters.filter(
      chapterItem => chapterItem.id && chapterItem.id !== value.id,
    );
    setChapters(data);
  };

  const renderItem = ({item}: renderChapterProps) => {
    return (
      <View>
        <View
          style={[
            css.default,
            css.centerDiv,
            {marginTop: 15, flexDirection: 'column'},
          ]}>
          <Pressable
            style={{
              backgroundColor: 'mediumslateblue',
              minWidth: 350,
              minHeight: 60,
              borderRadius: 4,
            }}>
            <Text
              style={[
                css.text,
                {
                  maxWidth: '70%',
                  textAlign: 'left',
                  left: 50,
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
                  left: 50,
                  textAlignVertical: 'center',
                },
              ]}>
              <Text style={{fontWeight: 'bold'}}>Pages</Text>
              <Text>: {item.pages.length}</Text>
            </Text>
          </Pressable>
          <Pressable onPress={() => onDelete(item)} style={css.buttonDelete}>
            <Ionicons name="trash-outline" color="white" size={26} />
          </Pressable>
          <Pressable
            onPress={() => {
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
      </View>
    );
  };
  return (
    <FlatList
      style={{maxWidth: '85%'}}
      data={chapters}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      numColumns={1}
    />
  );
};

export default ChapterList;
