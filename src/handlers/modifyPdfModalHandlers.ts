import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid, Vibration} from 'react-native';
import FilesystemNativeModule from '../FileSystemNativeModule';
import {modifyPdf} from '../services/pdfGenerationNode';
import {chapterProps} from '../types';
import {displayAlert} from '../utils/alerts';
import delay from '../utils/delay';

export const updatePdfButtonHandler = async (
  inputPdfFilePath: string,
  setCreateModalVisible: (createModalVisible: boolean) => void,
  chapters: chapterProps[],
  setInputPdfFilePath: (inputPdfFilePath: string) => void,
  setChapters: (chapters: chapterProps[]) => void,
  setMSpinnerVisible: (visibility: boolean) => void,
) => {
  setTimeout(() => {
    Vibration.vibrate(10, false);
  }, 0);
  try {
    if (inputPdfFilePath) {
      setCreateModalVisible(false);
      await delay(100);
      setMSpinnerVisible(true);
      const allHasRealPath = chapters.every((val: {pages: any[]}) =>
        val.pages.every((_val: {realPath: any}) => _val.realPath),
      );
      if (allHasRealPath) {
        const nodeCreateResponse = await modifyPdf(chapters, inputPdfFilePath);
        setMSpinnerVisible(false);
        await delay(300);
        ToastAndroid.show('PDF created successfully!', ToastAndroid.SHORT);

        if (nodeCreateResponse.nonStdImagesFound) {
          const buttons = [
            {
              text: 'Ok',
              onPress: async () => {
                await FilesystemNativeModule.openDocumentInChosenApp(nodeCreateResponse.fileUri);
              },
            },
          ];
          displayAlert('Warning', 'Some images were not JPEGs or PNGs.' + ' They are omitted in the PDF.', buttons);
        } else {
          await FilesystemNativeModule.openDocumentInChosenApp(nodeCreateResponse.fileUri);
        }

        setInputPdfFilePath('');
        setChapters([]);
      } else {
        setMSpinnerVisible(false);
        await delay(300);
        displayAlert('Error', 'PDF not modified : Error in getting paths of all the images.');
      }
    } else {
      ToastAndroid.show('Please select a PDF file', ToastAndroid.SHORT);
    }
  } catch (err: any) {
    if (err && err.message && typeof err.message === 'string' && err.message.includes('is encrypted')) {
      displayAlert('Error', 'This app currently does not support updating encrypted PDF files.');
    } else {
      displayAlert('Error', err.message);
    }
  }
};

export const selectChangePdfButtonHandler = async (
  setCreateModalVisible: {(createModalVisible: boolean): void},
  setInputPdfFilePath: {(inputPdfFilePath: string): void},
) => {
  setTimeout(() => {
    Vibration.vibrate(10, false);
  }, 0);
  try {
    setCreateModalVisible(false);

    let destFolderUriStr = await AsyncStorage.getItem('destFolderUri');
    if (!destFolderUriStr) {
      destFolderUriStr = '';
    }

    const inputPdfUriStr = await FilesystemNativeModule.openPdfFileForRead(destFolderUriStr);

    if (inputPdfUriStr && inputPdfUriStr !== 'E_PICKER_CANCELLED' && inputPdfUriStr !== 'E_NO_FILE_DATA_FOUND') {
      const inputFilePath = await FilesystemNativeModule.copyNResolveFilePath(inputPdfUriStr);
      setInputPdfFilePath(inputFilePath);
    } else if (inputPdfUriStr === 'E_NO_FILE_DATA_FOUND') {
      displayAlert('Error', 'No file data found while reading the PDF file.');
    }

    setCreateModalVisible(true);
  } catch (err: any) {
    displayAlert('Error', err.message);
  }
};
