import {ToastAndroid, Vibration} from 'react-native';
import FilesystemNativeModule from '../FileSystemNativeModule';
import {createPdf} from '../services/pdfGenerationNode';
import {chapterProps} from '../types';
import {displayAlert} from '../utils/alerts';
import delay from '../utils/delay';

export const createPdfButtonHandler = async (
  pdfFileName: string,
  setCreateModalVisible: (createModalVisible: boolean) => void,
  setCSpinnerVisible: (cSpinnerVisible: boolean) => void,
  chapters: chapterProps[],
  setPdfFileName: (pdfFileName: string) => void,
  setChapters: (chapters: never[]) => void,
) => {
  try {
    setTimeout(() => {
      Vibration.vibrate(10, false);
    }, 0);
    if (pdfFileName) {
      setCreateModalVisible(false);
      await delay(100);
      setCSpinnerVisible(true);
      const allHasRealPath = chapters.every(val => val.pages.every(_val => _val.realPath));
      if (allHasRealPath) {
        const nodeCreateResponse = await createPdf(chapters, pdfFileName + '.pdf');
        setCSpinnerVisible(false);
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

        setPdfFileName('');
        setChapters([]);
      } else {
        setCSpinnerVisible(false);
        await delay(300);
        displayAlert('Error', 'PDF not created : Error in getting paths of images.');
      }
    } else {
      ToastAndroid.show('Please enter a file name', ToastAndroid.SHORT);
    }
  } catch (err: any) {
    displayAlert('Error', err.message);
  }
};
