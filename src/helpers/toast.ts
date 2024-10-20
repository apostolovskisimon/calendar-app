import Toast, {ToastType} from 'react-native-toast-message';

export const showToast = (
  text1: string,
  type: ToastType = 'info',
  text2: string,
) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};
