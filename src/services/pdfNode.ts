import nodejs from 'nodejs-mobile-react-native';
import {chapterProps} from '../types';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const createPdf = (chapters: chapterProps[]) => {
  return new Promise((resolve, reject) => {
    try {
      const onCreatePdfDone = (obj: string[]) => {
        resolve(obj);
      };
      nodejs.channel.addListener('onCreatePdfDone', onCreatePdfDone);
      nodejs.channel.post('createPdf', chapters);
    } catch (err) {
      reject(err);
    }
  });
};

export const modifyPdf = () => {};
