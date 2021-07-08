import {StyleSheet} from 'react-native';
import Colors from '../../colors';

const styles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    default: {
      paddingTop: '10%',
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      color: isDarkMode ? Colors.white : Colors.black,
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    },
    text: {
      color: isDarkMode ? Colors.white : Colors.black,
    },
  });
};

export default styles;
