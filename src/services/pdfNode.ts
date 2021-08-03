import nodejs from 'nodejs-mobile-react-native';
import {chapterProps} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FilesystemNativeModule from '../FileSystemNativeModule';

export const createPdf = (chapters: chapterProps[], filename: string) => {
  return new Promise<string>(async (resolve, reject) => {
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

        try {
          if (pdfFileLocation && treeFolderUriStr) {
            let copyFileResponse;
            if (destFolderUriStr) {
              copyFileResponse =
                await FilesystemNativeModule.copyFileFromToPath(
                  cacheDir,
                  filename,
                  destFolderUriStr,
                  'application/pdf',
                  treeFolderUriStr,
                );
            } else {
              copyFileResponse =
                await FilesystemNativeModule.copyFileFromToPath(
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
                sCreatedDocs.docs.indexOf(copyFileResponse.outputFileUriStr) ===
                -1
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
          } else {
            reject(new Error('PDF file creation failed'));
          }
        } catch (err) {
          reject(err);
        }
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

export const modifyPdf = (chapters: chapterProps[], inputFilePath: string) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const treeFolderUriStr = await AsyncStorage.getItem('rootFolderUri');
      const destFolderUriStr = await AsyncStorage.getItem('destFolderUri');

      async function onModifyPdfError(err: Error) {
        nodejs.channel.removeListener('onModifyPdfDone', onModifyPdfDone);
        nodejs.channel.removeListener('onModifyPdfError', onModifyPdfError);
        reject(err);
      }

      async function onModifyPdfDone(pdfFileLocation: string) {
        nodejs.channel.removeListener('onCreatePdfDone', onModifyPdfDone);
        nodejs.channel.removeListener('onCreatePdfError', onModifyPdfError);

        try {
          if (pdfFileLocation && treeFolderUriStr) {
            const separatorLastIndex = pdfFileLocation.lastIndexOf('/');
            const [cacheDir, filename] = [
              pdfFileLocation.slice(0, separatorLastIndex),
              pdfFileLocation.slice(separatorLastIndex + 1),
            ];

            let copyFileResponse;
            if (destFolderUriStr) {
              copyFileResponse =
                await FilesystemNativeModule.copyFileFromToPath(
                  cacheDir,
                  filename,
                  destFolderUriStr,
                  'application/pdf',
                  treeFolderUriStr,
                );
            } else {
              copyFileResponse =
                await FilesystemNativeModule.copyFileFromToPath(
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
                sCreatedDocs.docs.indexOf(copyFileResponse.outputFileUriStr) ===
                -1
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
          } else {
            reject(new Error('PDF file creation failed'));
          }
        } catch (err) {
          reject(err);
        }
      }

      nodejs.channel.addListener('onModifyPdfDone', onModifyPdfDone);
      nodejs.channel.addListener('onModifyPdfError', onModifyPdfError);

      if (inputFilePath && treeFolderUriStr) {
        nodejs.channel.post('modifyPdf', chapters, inputFilePath);
      } else {
        reject(new Error('Cache directory path is blank'));
      }
    } catch (err) {
      reject(err);
    }
  });
};
