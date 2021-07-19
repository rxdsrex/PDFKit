import {StyleSheet} from 'react-native';
import Colors from '../colors';

const styles = (
  isDarkMode?: boolean,
  width: number = 0,
  imagesLength: number = 0,
) => {
  return StyleSheet.create({
    default: {
      flex: 1,
      color: isDarkMode ? Colors.white : Colors.black,
    },
    centerDiv: {
      paddingTop: '5%',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    textHeading: {
      paddingTop: '3%',
      fontWeight: 'bold',
      fontSize: 24,
      textAlign: 'center',
      color: isDarkMode ? Colors.white : Colors.black,
    },
    text: {
      fontSize: 15,
      textAlign: 'center',
      color: Colors.white,
    },
    addImageText: {
      fontSize: 18,
      textAlign: 'center',
      color: Colors.white,
      width: 350,
    },
    addImagesTextView: {
      display: imagesLength > 0 ? 'none' : 'flex',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    imageView: {
      flex: 1,
      color: isDarkMode ? Colors.white : Colors.black,
      justifyContent: 'center',
      alignItems: 'center',
      display: imagesLength > 0 ? 'flex' : 'none',
    },
    media: {
      marginLeft: 6,
      width: width,
      height: width,
      marginBottom: 6,
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    openPicker: {
      flex: 1 / 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectView: {
      left: 2,
      right: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    buttonClose: {
      paddingVertical: 5,
      alignSelf: 'flex-end',
      width: (width + 22) / 2,
    },
    buttonAdd: {
      paddingVertical: 5,
      alignSelf: 'flex-end',
      width: (width + 22) / 2,
    },
    imageButtonDelete: {
      paddingHorizontal: 5,
      paddingVertical: 5,
      position: 'absolute',
      textAlign: 'center',
      opacity: 0.9,
      top: 2,
      right: 2,
      backgroundColor: 'salmon',
      borderRadius: 4,
    },
    buttonDelete: {
      paddingHorizontal: 8,
      paddingVertical: 14,
      position: 'absolute',
      top: 19,
      right: 2,
      backgroundColor: 'coral',
      borderRadius: 4,
    },
    buttonEdit: {
      paddingHorizontal: 8,
      paddingVertical: 14,
      position: 'absolute',
      top: 19,
      left: 2,
      backgroundColor: 'mediumseagreen',
      borderRadius: 4,
    },
    modalView: {
      margin: 20,
      backgroundColor: isDarkMode ? Colors.darkBlue : Colors.lightBlue,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      maxWidth: '90%',
    },
    modalButton: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    modalText: {
      marginTop: 10,
      marginBottom: 15,
      textAlign: 'center',
      color: Colors.white,
      maxWidth: '85%',
    },
    modalButtonDone: {
      backgroundColor: 'royalblue',
      marginLeft: 70,
    },
    modalButtonClose: {
      backgroundColor: '#2196F3',
      marginRight: 70,
    },
    chInput: {
      height: 40,
      marginTop: 2,
      marginBottom: 15,
      borderWidth: 1,
      backgroundColor: 'lightslategrey',
      color: Colors.white,
      maxWidth: '85%',
    },
    inline: {flexDirection: 'row'},
    selectImagesView: {paddingTop: 10, paddingBottom: 25},
  });
};

export default styles;
