import {PermissionsAndroid} from 'react-native';

export const requestCameraPermission = () => {
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

        if (!(grantedCamera === PermissionsAndroid.RESULTS.GRANTED)) {
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
};

export const requestStoragePermission = () => {
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

        if (!(grantedStorageRead === PermissionsAndroid.RESULTS.GRANTED)) {
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
          if (!(grantedStorageWrite === PermissionsAndroid.RESULTS.GRANTED)) {
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
};
