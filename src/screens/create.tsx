import React, {useState, useEffect} from 'react';
import {Text, Vibration, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from '../components/styles';
import {imgRouteProps, chapterProps, Results} from '../types';
import Colors from '../colors';

import AddChapterModal from '../components/addChapterModal';
import CreatePdfModal from '../components/createPdfModal';
import ChapterList from '../components/chapterList';

const CreateScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const css = styles(isDarkMode);
  const navigation = useNavigation();
  const route: imgRouteProps = useRoute();

  const initChapters: chapterProps[] = [];
  const initImages: Results[] = [];
  const [donePicking, setDonePicking] = useState(false);
  const [dnBtnDisabled, setDnBtnDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [chapters, setChapters] = useState(initChapters);
  const [chapterTitle, setChapterTitle] = useState('');
  const [images, setImages] = useState(initImages);
  const [chapterId, setChapterId] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [cSpinnerVisible, setCSpinnerVisible] = useState(false);

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
  }, [chapterId, dnBtnDisabled, donePicking, modalVisible, navigation, route.params.gotImages]);

  return (
    <SafeAreaView style={[css.default, css.centerDiv, {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}]}>
      <Spinner visible={cSpinnerVisible} textContent={'Creating PDF...'} color={'#225bbd'} animation={'fade'} />
      <View style={[css.default, css.centerDiv, {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}]}>
        <View style={css.selectView}>
          <Button
            color="blue"
            mode="contained"
            uppercase={false}
            style={css.modalButtonClose}
            onPress={() => {
              setModalVisible(!modalVisible);
              setTimeout(() => {
                Vibration.vibrate(10, false);
              }, 0);
            }}>
            <Text style={css.text}>Add Chapter</Text>
          </Button>
          <Button
            mode="contained"
            style={chapters.length > 0 ? css.modalButtonDone : css.modalButtonDoneDisabled}
            uppercase={false}
            disabled={chapters.length > 0 ? false : true}
            onPress={async () => {
              setCreateModalVisible(true);
              setTimeout(() => {
                Vibration.vibrate(10, false);
              }, 0);
            }}>
            <Text style={css.text}>Create</Text>
          </Button>
          <View>
            <CreatePdfModal
              chapters={chapters}
              createModalVisible={createModalVisible}
              pdfFileName={pdfFileName}
              setChapters={setChapters}
              setCreateModalVisible={setCreateModalVisible}
              setPdfFileName={setPdfFileName}
              setCSpinnerVisible={setCSpinnerVisible}
            />
          </View>
        </View>
        <ChapterList
          chapters={chapters}
          setChapterId={setChapterId}
          setChapterTitle={setChapterTitle}
          setChapters={setChapters}
          setDonePicking={setDonePicking}
          setImages={setImages}
          backScreenName={'Create'}
        />
      </View>
      <AddChapterModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        chapterId={chapterId}
        chapterTitle={chapterTitle}
        chapters={chapters}
        dnBtnDisabled={dnBtnDisabled}
        images={images}
        setChapterId={setChapterId}
        setChapterTitle={setChapterTitle}
        setChapters={setChapters}
        setDnBtnDisabled={setDnBtnDisabled}
        setDonePicking={setDonePicking}
        setImages={setImages}
        backScreenName={'Create'}
      />
    </SafeAreaView>
  );
};

export default CreateScreen;
