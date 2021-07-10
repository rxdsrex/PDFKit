import {StyleSheet} from 'react-native';
import Colors from '../../colors';

const styles = (isDarkMode?: boolean, width: number = 0) => {
  return StyleSheet.create({
    default: {
      flex: 1,
      color: isDarkMode ? Colors.white : Colors.black,
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    },
    centerDiv: {
      paddingTop: '5%',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    textHeading: {
      paddingTop: '3%',
      fontWeight: 'bold',
      fontSize: 24,
      textAlign: 'center',
      color: isDarkMode ? Colors.white : Colors.black,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 16,
      color: isDarkMode ? Colors.white : Colors.black,
    },
    imageView: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 24,
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
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    buttonClose: {
      alignSelf: 'flex-end',
      paddingBottom: '3%',
    },
    buttonAdd: {
      alignSelf: 'flex-end',
      paddingBottom: '3%',
    },
    buttonDelete: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: '#ffffff92',
      borderRadius: 4,
    },
    titleDelete: {
      fontWeight: 'bold',
      fontSize: 12,
      color: isDarkMode ? Colors.white : Colors.black,
    },
  });
};

export default styles;
