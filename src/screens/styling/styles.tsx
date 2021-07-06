import {StyleSheet} from 'react-native';
import Colors from '../../components/colors';

const styles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    default: {
      paddingTop: '5%',
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
