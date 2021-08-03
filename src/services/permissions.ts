import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, BackHandler} from 'react-native';

import FilesystemNativeModule from '../FileSystemNativeModule';

export const getCameraPermission = async () => {
  try {
    await requestCameraPermission();
  } catch (err) {
    console.warn(err.message);
    Alert.alert(
      'Camera Permission Error',
      'Something went wrong while requesting Camera Permissions.\nPlease restart the app.',
      [
        {
          text: 'OK',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      {cancelable: false},
    );
  }
};

export const getStoragePermission = async () => {
  try {
    let gotStorePerm = false;
    do {
      gotStorePerm = await requestStoragePermission();
    } while (!gotStorePerm);
  } catch (err) {
    console.warn(err.message);
    Alert.alert(
      'Storage Permission Error',
      'Something went wrong while requesting Storage Permissions.\nPlease restart the app.',
      [
        {
          text: 'OK',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      {cancelable: false},
    );
  }
};

export const setStorageTreeUri = async () => {
  const storedTreeUri = await AsyncStorage.getItem('rootFolderUri');
  const granted = storedTreeUri
    ? await FilesystemNativeModule.checkTreePermissionsGranted(storedTreeUri)
    : false;

  if (!storedTreeUri || !granted) {
    Alert.alert(
      'Select App folder',
      'Please select the folder where you want the app to create the PDF files.',
      [
        {
          text: 'OK',
          onPress: async () => {
            await getAccessToFolder();
          },
        },
      ],
      {cancelable: false},
    );
  }
};

async function requestCameraPermission() {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const camIsGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (!camIsGranted) {
        const grantedCamera = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message:
              'This app requires access to camera to capture images' +
              ' and add them to a PDF document.',
            buttonPositive: 'OK',
          },
        );

        if (grantedCamera === PermissionsAndroid.RESULTS.DENIED) {
          console.warn('CAMERA permission denied');
          resolve(false);
          return;
        }
      }
      resolve(true);
    } catch (err) {
      console.warn(err.message);
      reject(err);
    }
  });
}

async function requestStoragePermission() {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const isStorageReadGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      let isStorageWriteGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!isStorageReadGranted && !isStorageWriteGranted) {
        const grantedStorageRead = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message:
              'This app requires access to your storage to access your images' +
              ' and write PDF files.',
            buttonPositive: 'OK',
          },
        );

        if (grantedStorageRead === PermissionsAndroid.RESULTS.DENIED) {
          console.warn('STORAGE permission denied');
          resolve(false);
          return;
        }

        isStorageWriteGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (!isStorageWriteGranted) {
          const grantedStorageWrite = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          if (grantedStorageWrite === PermissionsAndroid.RESULTS.DENIED) {
            console.warn('STORAGE permission denied');
            resolve(false);
            return;
          }
        }
      }
      resolve(true);
    } catch (err) {
      console.warn(err);
      reject(err);
    }
  });
}

async function getAccessToFolder() {
  let treeUri;
  try {
    const docFolderUri =
      await FilesystemNativeModule.getDocumentsDirectoryContentUri();
    do {
      treeUri = await FilesystemNativeModule.askPermissionForStorage(
        docFolderUri,
      );
    } while (
      treeUri === 'E_PICKER_CANCELLED' ||
      treeUri === 'E_ROOT_FOLDER_NOT_ALLOWED' ||
      treeUri === 'E_NO_FOLDER_DATA_FOUND' ||
      !treeUri
    );
    await AsyncStorage.setItem('rootFolderUri', treeUri);
  } catch (err) {
    console.warn(err.message);
    Alert.alert(
      'Folder Picker Error',
      'Something went wrong while selecting folder.\nPlease restart the app.',
      [
        {
          text: 'OK',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      {cancelable: false},
    );
  }
}
