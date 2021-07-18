/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  Text,
  ScrollView,
  View,
  FlatList,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from '../components/styles';
import {imgRouteProps, bookProps, renderBookItemProps} from '../types';
import {Results} from '@baronha/react-native-multiple-image-picker';
import Colors from '../colors';
import {useEffect} from 'react';

const CreateScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const css = styles(isDarkMode);
  const navigation = useNavigation();
  const route: imgRouteProps = useRoute();

  const initBook: bookProps[] = [];
  let images: Results[] = route.params ? route.params.gotImages : [];
  const [donePicking, setDonePicking] = useState(false);
  const [dnBtnDisabled, setDoneVisibility] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [book, setBook] = useState(initBook);
  const [chapterTitle, setChapterTitle] = React.useState('');

  const rem = () => {
    if (donePicking) {
      setModalVisible(!modalVisible);
      setDoneVisibility(!dnBtnDisabled);
    }
  };
  useEffect(() => {
    navigation.addListener('focus', rem);
  }, [dnBtnDisabled, donePicking, modalVisible, navigation, route.name]);

  const onDelete = (value: bookProps) => {
    const data = book.filter(item => item.id && item.id !== value.id);
    setBook(data);
  };

  const renderItem = ({item}: renderBookItemProps) => {
    return (
      <View style={[css.default, css.centerDiv]}>
        <Pressable style={{backgroundColor: 'tomato'}}>
          <Text>Chapter name: {item.chapterTitle}</Text>
          <Text>No. of pages: {item.pages.length}</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(item)} style={css.buttonDelete}>
          <Text style={css.titleDelete}>x</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        css.default,
        css.centerDiv,
        {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
      ]}>
      <ScrollView
        contentContainerStyle={[
          css.default,
          css.centerDiv,
          {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
        ]}>
        <View style={css.selectView}>
          <Button
            color="blue"
            mode="contained"
            uppercase={false}
            style={css.modalButtonClose}
            onPress={function () {
              setModalVisible(!modalVisible);
              // navigation.navigate('PickImage', {backScreenName: 'Create'});
            }}>
            <Text style={css.text}>Add Chapter</Text>
          </Button>
          <Button
            color="teal"
            mode="contained"
            style={css.modalButtonDone}
            uppercase={false}
            onPress={function () {
              console.log('createPdf');
            }}>
            <Text style={css.text}>Create PDF</Text>
          </Button>
        </View>
      </ScrollView>
      <FlatList
        style={{maxWidth: '85%'}}
        data={book}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={1}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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
                onPress={function () {
                  setModalVisible(!modalVisible);
                  setDonePicking(true);
                  navigation.navigate('PickImage', {backScreenName: 'Create'});
                }}>
                <Text style={css.text}>Add Images</Text>
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
                  // eslint-disable-next-line react-native/no-inline-styles
                  {backgroundColor: dnBtnDisabled ? 'slategray' : 'royalblue'},
                ]}
                disabled={dnBtnDisabled}
                onPress={() => {
                  if (images.length) {
                    const chapterData: bookProps = {
                      id: Math.random().toString(36).slice(2),
                      chapterTitle:
                        chapterTitle === ''
                          ? book.length + 1 + ''
                          : chapterTitle,
                      pages: images,
                    };
                    setBook([...book, chapterData]);
                    setDoneVisibility(!dnBtnDisabled);
                    setDonePicking(false);
                    images = [];
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
    </SafeAreaView>
  );
};

export default CreateScreen;
