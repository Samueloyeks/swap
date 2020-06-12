import firebase from 'react-native-firebase';

export default async (message) => {
  // handle your message
  const notification = new firebase.notifications.Notification()
  .setNotificationId(message.messageId)
  .setTitle(message.data.title)
  .setBody(message.data.body)
  .android.setChannelId('Default')
  .android.setSmallIcon('ic_stat_ic_notification')
  .android.setPriority(firebase.notifications.Android.Priority.Max)
  .setSound('default');

  await firebase.notifications().displayNotification(notification);
  return Promise.resolve();
}