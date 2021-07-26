import nodejs from 'nodejs-mobile-react-native';
import {chapterProps} from '../types';
import {NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {FilesystemNativeModule} = NativeModules;

export const createPdf = (chapters: chapterProps[], filename: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cacheDir = await FilesystemNativeModule.getCacheDirectoryPath();
      const treeFolderUriStr = await AsyncStorage.getItem('rootFolderUri');
      const destFolderUriStr = await AsyncStorage.getItem('destFolderUri');

      async function onCreatePdfError(err: Error) {
        nodejs.channel.removeListener('onCreatePdfDone', onCreatePdfDone);
        nodejs.channel.removeListener('onCreatePdfError', onCreatePdfError);
        reject(err);
      }

      async function onCreatePdfDone(pdfFileLocation: string) {
        nodejs.channel.removeListener('onCreatePdfDone', onCreatePdfDone);
        nodejs.channel.removeListener('onCreatePdfError', onCreatePdfError);

        let copyFileResponse: nativeCopyFileProps;
        if (destFolderUriStr) {
          copyFileResponse = await FilesystemNativeModule.copyFileFromToPath(
            cacheDir,
            filename,
            destFolderUriStr,
            'application/pdf',
            treeFolderUriStr,
          );
        } else {
          copyFileResponse = await FilesystemNativeModule.copyFileFromToPath(
            cacheDir,
            filename,
            '',
            'application/pdf',
            treeFolderUriStr,
          );
        }

        await AsyncStorage.setItem(
          'destFolderUri',
          copyFileResponse.destinationFolderUriStr,
        );

        const sCreatedDocsStr = await AsyncStorage.getItem('createdDocs');
        if (
          sCreatedDocsStr &&
          typeof JSON.parse(sCreatedDocsStr) === 'object'
        ) {
          const sCreatedDocs = JSON.parse(sCreatedDocsStr);
          if (
            sCreatedDocs.docs.indexOf(copyFileResponse.outputFileUriStr) === -1
          ) {
            sCreatedDocs.docs.push(copyFileResponse.outputFileUriStr);
          }
          await AsyncStorage.setItem(
            'createdDocs',
            JSON.stringify(sCreatedDocs),
          );
        } else {
          const sCreatedDocs = {
            docs: [copyFileResponse.outputFileUriStr],
          };
          await AsyncStorage.setItem(
            'createdDocs',
            JSON.stringify(sCreatedDocs),
          );
        }

        await FilesystemNativeModule.deleteFileByPath(pdfFileLocation, '');

        resolve(copyFileResponse.outputFileUriStr);
      }

      nodejs.channel.addListener('onCreatePdfDone', onCreatePdfDone);
      nodejs.channel.addListener('onCreatePdfError', onCreatePdfError);

      if (cacheDir && treeFolderUriStr) {
        nodejs.channel.post('createPdf', chapters, cacheDir, filename);
      } else {
        reject(new Error('Cache directory path is blank'));
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const modifyPdf = () => {};

export type nativeCopyFileProps = {
  destinationFolderUriStr: string;
  outputFileUriStr: string;
};
