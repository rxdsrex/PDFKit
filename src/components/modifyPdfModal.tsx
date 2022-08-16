import React from 'react';
import {Text, View, Modal, Vibration} from 'react-native';
import {Button} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {selectChangePdfButtonHandler, updatePdfButtonHandler} from '../handlers/modifyPdfModalHandlers';

import styles from './styles';
import {modifyPdfModalProps} from '../types';

const ModifyPdfModal = ({
  createModalVisible,
  setCreateModalVisible,
  setInputPdfFilePath,
  inputPdfFilePath,
  chapters,
  setChapters,
  setMSpinnerVisible,
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
          <View style={css.selectImagesView}>
            <Button
              color="royalblue"
              mode="contained"
              uppercase={false}
              onPress={() => {
                selectChangePdfButtonHandler(setCreateModalVisible, setInputPdfFilePath);
              }}>
              <Text style={css.text}>{inputPdfFilePath ? 'Change selected PDF' : 'Select a PDF'}</Text>
            </Button>
          </View>
          <View style={css.selectImagesView}>
            <Button
              color="teal"
              mode="contained"
              uppercase={false}
              disabled={inputPdfFilePath ? false : true}
              onPress={() => {
                updatePdfButtonHandler(
                  inputPdfFilePath,
                  setCreateModalVisible,
                  chapters,
                  setInputPdfFilePath,
                  setChapters,
                  setMSpinnerVisible,
                );
              }}>
              <Text style={css.text}>Update PDF</Text>
            </Button>
          </View>
          <View style={css.selectImagesView}>
            <Button
              color="orange"
              mode="contained"
              uppercase={false}
              onPress={() => {
                setTimeout(() => {
                  Vibration.vibrate(10, false);
                }, 0);
                setCreateModalVisible(false);
                setInputPdfFilePath('');
              }}>
              <Text style={css.text}>Cancel</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModifyPdfModal;
