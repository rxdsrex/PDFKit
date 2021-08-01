/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Modal, Pressable, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';

import styles from '../components/styles';
import {chapterProps, addChapterModalProps} from '../types';
import {useNavigation} from '@react-navigation/native';

const AddChapterModal = ({
  modalVisible,
  setModalVisible,
  setChapterTitle,
  setDonePicking,
  chapterTitle,
  images,
  dnBtnDisabled,
  chapterId,
  chapters,
  setChapters,
  setChapterId,
  setDnBtnDisabled,
  setImages,
  backScreenName,
}: addChapterModalProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const css = styles(isDarkMode);
  const navigation = useNavigation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setChapterTitle('');
        setDonePicking(false);
      }}>
      <View style={css.centeredView}>
        <View style={css.modalView}>
          <View style={css.inline}>
            <Text style={css.modalText}>Chapter Title: </Text>
            <TextInput
              style={css.chInput}
              value={chapterTitle}
              onChangeText={setChapterTitle}
              multiline={false}
              placeholderTextColor="navajowhite"
              placeholder="Enter name of the chapter"
              defaultValue=""
            />
          </View>
          <View style={css.selectImagesView}>
            <Button
              color="teal"
              mode="contained"
              uppercase={false}
              onPress={() => {
                setModalVisible(!modalVisible);
                setDonePicking(true);
                navigation.navigate('PickImage', {
                  gotImages: images,
                  backScreenName: backScreenName,
                });
              }}>
              <Text style={css.text}>
                {images.length > 0
                  ? images.length + ' images selected'
                  : 'Add Images'}
              </Text>
            </Button>
          </View>
          <View style={css.inline}>
            <Pressable
              style={[css.modalButton, css.modalButtonClose]}
              onPress={() => {
                setChapterTitle('');
                setModalVisible(!modalVisible);
                setDonePicking(false);
              }}>
              <Text style={css.text}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                css.modalButton,
                css.modalButtonDone,
                {backgroundColor: dnBtnDisabled ? 'slategray' : 'royalblue'},
              ]}
              disabled={dnBtnDisabled}
              onPress={() => {
                if (images.length > 0 && chapterId !== '') {
                  const newBook = chapters.map((chapter, index) => {
                    if (chapter.id === chapterId) {
                      chapter.pages = images;
                      chapter.chapterTitle =
                        chapterTitle === '' ? index + 1 + '' : chapterTitle;
                    }
                    return chapter;
                  });
                  setChapters(newBook);
                  setChapterId('');
                  setDnBtnDisabled(true);
                  setDonePicking(false);
                  setImages([]);
                } else if (images.length === 0 && chapterId !== '') {
                  const data = chapters.filter(
                    item => item.id && item.id !== chapterId,
                  );
                  setChapters(data);
                  setChapterId('');
                  setDnBtnDisabled(true);
                  setDonePicking(false);
                  setImages([]);
                } else if (images.length > 0) {
                  const chapterData: chapterProps = {
                    id: Math.random().toString(36).slice(2),
                    chapterTitle:
                      chapterTitle === ''
                        ? chapters.length + 1 + ''
                        : chapterTitle,
                    pages: images,
                  };
                  setChapters([...chapters, chapterData]);
                  setDnBtnDisabled(true);
                  setDonePicking(false);
                  setImages([]);
                }
                setChapterTitle('');
                setModalVisible(!modalVisible);
              }}>
              <Text style={css.text}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddChapterModal;
