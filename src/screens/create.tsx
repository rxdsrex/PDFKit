import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, Modal, Pressable, TextInput} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from '../components/styles';
import {imgRouteProps, bookProps, renderBookItemProps, Results} from '../types';
import Colors from '../colors';
// import nodejs from 'nodejs-mobile-react-native';

const CreateScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const css = styles(isDarkMode);
  const navigation = useNavigation();
  const route: imgRouteProps = useRoute();

  const initBook: bookProps[] = [];
  const initImages: Results[] = [];
  const [donePicking, setDonePicking] = useState(false);
  const [dnBtnDisabled, setDnBtnDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [book, setBook] = useState(initBook);
  const [chapterTitle, setChapterTitle] = useState('');
  const [images, setImages] = useState(initImages);
  const [chapterId, setChapterId] = useState('');

  useEffect(() => {
    function handleModalVisibility() {
      if (donePicking) {
        setModalVisible(!modalVisible);
        if (route.params.gotImages.length || chapterId !== '') {
          setImages(route.params.gotImages);
          setDnBtnDisabled(false);
        }
      }
    }
    navigation.addListener('focus', handleModalVisibility);

    return function cleanup() {
      navigation.removeListener('focus', handleModalVisibility);
    };
  }, [
    chapterId,
    dnBtnDisabled,
    donePicking,
    modalVisible,
    navigation,
    route.params.gotImages,
  ]);

  const onDelete = (value: bookProps) => {
    const data = book.filter(item => item.id && item.id !== value.id);
    setBook(data);
  };

  const renderItem = ({item}: renderBookItemProps) => {
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
                backScreenName: 'Create',
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
    <SafeAreaView
      style={[
        css.default,
        css.centerDiv,
        {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
      ]}>
      <View
        style={[
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
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={css.text}>Add Chapter</Text>
          </Button>
          <Button
            color="teal"
            mode="contained"
            style={css.modalButtonDone}
            uppercase={false}
            disabled={images.length > 0 ? false : true}
            onPress={async () => {
              // TODO Add logic
              console.log('createPdf');
            }}>
            <Text style={css.text}>Create PDF</Text>
          </Button>
        </View>
        <FlatList
          style={{maxWidth: '85%'}}
          data={book}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={1}
        />
      </View>
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
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setDonePicking(true);
                  navigation.navigate('PickImage', {
                    gotImages: images,
                    backScreenName: 'Create',
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
                  // eslint-disable-next-line react-native/no-inline-styles
                  {backgroundColor: dnBtnDisabled ? 'slategray' : 'royalblue'},
                ]}
                disabled={dnBtnDisabled}
                onPress={() => {
                  if (images.length > 0 && chapterId !== '') {
                    const newBook = book.map((chapter, index) => {
                      if (chapter.id === chapterId) {
                        chapter.pages = images;
                        chapter.chapterTitle =
                          chapterTitle === '' ? index + 1 + '' : chapterTitle;
                      }
                      return chapter;
                    });
                    setBook(newBook);
                    setChapterId('');
                    setDnBtnDisabled(true);
                    setDonePicking(false);
                    setImages([]);
                  } else if (images.length === 0 && chapterId !== '') {
                    const data = book.filter(
                      item => item.id && item.id !== chapterId,
                    );
                    setBook(data);
                    setChapterId('');
                    setDnBtnDisabled(true);
                    setDonePicking(false);
                    setImages([]);
                  } else if (images.length > 0) {
                    const chapterData: bookProps = {
                      id: Math.random().toString(36).slice(2),
                      chapterTitle:
                        chapterTitle === ''
                          ? book.length + 1 + ''
                          : chapterTitle,
                      pages: images,
                    };
                    setBook([...book, chapterData]);
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
    </SafeAreaView>
  );
};

export default CreateScreen;
