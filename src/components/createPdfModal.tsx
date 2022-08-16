import React from 'react';
import {Text, View, Modal, TextInput, Vibration} from 'react-native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {createPdfButtonHandler} from '../handlers/createPdfModalHandlers';

import styles from '../components/styles';
import {createPdfModalProps} from '../types';

const CreatePdfModal = ({
  createModalVisible,
  setCreateModalVisible,
  setPdfFileName,
  pdfFileName,
  chapters,
  setChapters,
  setCSpinnerVisible,
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
              onPress={() => {
                createPdfButtonHandler(
                  pdfFileName,
                  setCreateModalVisible,
                  setCSpinnerVisible,
                  chapters,
                  setPdfFileName,
                  setChapters,
                );
              }}>
              <Text style={css.text}>Create PDF</Text>
            </Button>
          </View>
          <View style={css.selectImagesView}>
            <Button
              color="orange"
              mode="contained"
              uppercase={false}
              onPress={async () => {
                setTimeout(() => {
                  Vibration.vibrate(10, false);
                }, 0);
                setCreateModalVisible(false);
                setPdfFileName('');
              }}>
              <Text style={css.text}>Cancel</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePdfModal;
