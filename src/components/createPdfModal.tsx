import React from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  ToastAndroid,
  NativeModules,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {createPdf} from '../services/pdfNode';

import styles from '../components/styles';
import {createPdfModalProps} from '../types';

const {FilesystemNativeModule} = NativeModules;

const CreatePdfModal = ({
  createModalVisible,
  setCreateModalVisible,
  setPdfFileName,
  pdfFileName,
  chapters,
  setChapters,
}: createPdfModalProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const css = styles(isDarkMode);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={createModalVisible}
      onRequestClose={() => {
        setCreateModalVisible(false);
        setPdfFileName('');
      }}>
      <View style={css.centeredView}>
        <View style={css.modalView}>
          <View style={css.inline}>
            <Text style={css.modalText}>Filename: </Text>
            <TextInput
              style={css.chInput}
              value={pdfFileName}
              onChangeText={setPdfFileName}
              multiline={false}
              placeholderTextColor="navajowhite"
              placeholder="Enter the PDF filename"
              defaultValue=""
            />
          </View>
          <View style={css.selectImagesView}>
            <Button
              color="teal"
              mode="contained"
              uppercase={false}
              onPress={async () => {
                try {
                  if (pdfFileName) {
                    setCreateModalVisible(false);
                    const docUri = await createPdf(
                      chapters,
                      pdfFileName + '.pdf',
                    );
                    ToastAndroid.show(
                      'PDF created successfully!',
                      ToastAndroid.SHORT,
                    );
                    await FilesystemNativeModule.openDocumentInChosenApp(
                      docUri,
                    );
                    setPdfFileName('');
                    setChapters([]);
                  } else {
                    ToastAndroid.show(
                      'Please enter a file name',
                      ToastAndroid.SHORT,
                    );
                  }
                } catch (err) {
                  console.warn(err.message);
                }
              }}>
              <Text style={css.text}>Create PDF</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePdfModal;
