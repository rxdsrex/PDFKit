import React from 'react';
import {Text, View, Modal, ToastAndroid} from 'react-native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {modifyPdf} from '../services/pdfNode';

import FilesystemNativeModule from '../FileSystemNativeModule';
import styles from './styles';
import {modifyPdfModalProps} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModifyPdfModal = ({
  createModalVisible,
  setCreateModalVisible,
  setInputPdfFilePath,
  inputPdfFilePath,
  chapters,
  setChapters,
}: modifyPdfModalProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const css = styles(isDarkMode);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={createModalVisible}
      onRequestClose={() => {
        setCreateModalVisible(false);
        setInputPdfFilePath('');
      }}>
      <View style={css.centeredView}>
        <View style={css.modalView}>
          <View>
            <Button
              color="royalblue"
              mode="contained"
              uppercase={false}
              onPress={async () => {
                try {
                  setCreateModalVisible(false);

                  let destFolderUriStr = await AsyncStorage.getItem(
                    'destFolderUri',
                  );
                  if (!destFolderUriStr) {
                    destFolderUriStr = '';
                  }

                  const inputPdfUriStr =
                    await FilesystemNativeModule.openPdfFileForRead(
                      destFolderUriStr,
                    );

                  const inputFilePath =
                    await FilesystemNativeModule.copyNResolveFilePath(
                      inputPdfUriStr,
                    );

                  setInputPdfFilePath(inputFilePath);

                  setCreateModalVisible(true);
                } catch (err) {
                  console.warn(err.message);
                }
              }}>
              <Text style={css.text}>
                {inputPdfFilePath ? 'PDF selected' : 'Select a PDF'}
              </Text>
            </Button>
          </View>
          <View style={css.selectImagesView}>
            <Button
              color="teal"
              mode="contained"
              uppercase={false}
              onPress={async () => {
                try {
                  if (inputPdfFilePath) {
                    setCreateModalVisible(false);
                    const docUri = await modifyPdf(chapters, inputPdfFilePath);
                    ToastAndroid.show(
                      'PDF created successfully!',
                      ToastAndroid.SHORT,
                    );
                    await FilesystemNativeModule.openDocumentInChosenApp(
                      docUri,
                    );
                    setInputPdfFilePath('');
                    setChapters([]);
                  } else {
                    ToastAndroid.show(
                      'Please select a PDF file',
                      ToastAndroid.SHORT,
                    );
                  }
                } catch (err) {
                  console.warn(err.message);
                }
              }}>
              <Text style={css.text}>Modify PDF</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModifyPdfModal;
