import notifee from '@notifee/react-native';

const channelId = async () =>
  notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

export const showNotification = async (title: string, body: string) => {
  await notifee.requestPermission();
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: await channelId(),
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
};
