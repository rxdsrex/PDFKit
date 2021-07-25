import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Alert, BackHandler, NativeModules} from 'react-native';
const {FilesystemNativeModule} = NativeModules;

import HomeStack from './components/homeStack';
import {
  requestCameraPermission,
  requestStoragePermission,
} from './services/permissions';

const getCameraPermission = async () => {
  await AsyncStorage.setItem('CameraPermitted', 'false');
  try {
    const gotCamPerm = await requestCameraPermission();
    await AsyncStorage.setItem('CameraPermitted', JSON.stringify(gotCamPerm));
  } catch (err) {
    await getCameraPermission();
  }
};

const getStoragePermission = async () => {
  await AsyncStorage.setItem('StoragePermitted', 'false');
  try {
    let gotStorePerm = false;
    do {
      gotStorePerm = await requestStoragePermission();
    } while (!gotStorePerm);
    await AsyncStorage.setItem(
      'StoragePermitted',
      JSON.stringify(gotStorePerm),
    );
  } catch (err) {
    await getStoragePermission();
  }
};

const getAccessToFolder = async () => {
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
    await AsyncStorage.setItem('StoragePermitted', 'false');
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
};

const App = () => {
  useEffect(() => {
    async function getAccess() {
      await getCameraPermission();
      await getStoragePermission();
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
    getAccess();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
