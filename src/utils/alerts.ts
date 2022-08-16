import {Alert, AlertButton} from 'react-native';

function truncateString(str: string, num: number) {
  if (str && typeof str === 'string') {
    // If the length of str is less than or equal to num
    // just return str--don't truncate it.
    if (str.length <= num) {
      return str;
    }
    // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, num) + '...';
  } else {
    return 'Internal error occurred.';
  }
}

export const displayAlert = (title: string, msg: string, alertBtns?: AlertButton[]) => {
  Alert.alert(
    title,
    truncateString(msg, 140),
    alertBtns || [
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ],
    {cancelable: true},
  );
};
