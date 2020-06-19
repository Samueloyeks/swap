import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, NetInfo, YellowBox, Alert, AppRegistry } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import AnimatedSplash from "react-native-animated-splash-screen";
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import api from './src/utils/api/ApiService';
import toast from './src/utils/SimpleToast'
import NetworkUtils from './src/utils/NetworkUtils'





YellowBox.ignoreWarnings(
  ['VirtualizedLists should never be nested'],
  ['Functions are not valid as a React child.'],
  ['Failed child context type:'],
  ["No native ExponentConstants module found, are you sure the expo-constants's module is linked properly?"],
  ['The "UMNativeModulesProxy" native module is not exported through NativeModules;'],
  ['Setting a timer']
);



class App extends React.Component {
  state = {
    isLoaded: false
  };

  async componentDidMount() {
    this.setState({ isLoaded: true });

    this.checkPermission();
    this.createNotificationListeners();
    this.createFcmTokenRefreshListener();
    SplashScreen.hide();
    this.CheckConnectivity();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    this.onTokenRefreshListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      alert('Please allow notifications in settings to get offer notifications');
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {

      const channelId = new firebase.notifications.Android.Channel(
        'Default',
        'Default',
        firebase.notifications.Android.Importance.High
      );
      firebase.notifications().android.createChannel(channelId);

      let notification_to_be_displayed = new firebase.notifications.Notification({
        data: notification._android._notification._data,
        sound: 'default',
        show_in_foreground: true,
        title: notification.title,
        body: notification.body,
      });

      if (Platform.OS == 'android') {
        notification_to_be_displayed.android
          .setPriority(firebase.notifications.Android.Priority.High)
          .android.setChannelId('Default')
          .android.setVibrate(1000);
      }
      // console.log('FOREGROUND NOTIFICATION LISTENER: \n', notification_to_be_displayed);

      firebase.notifications().displayNotification(notification_to_be_displayed);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      // console.log('notificationOpen: ' + notificationOpen)

      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage(async (message) => {
      //process data message

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
    });
  }

  async createFcmTokenRefreshListener() {
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(async fcmToken => {

      const udata = await AsyncStorage.getItem('userData');

      if (udata) {
        let userData = JSON.parse(udata)
        let uid = userData.uid

        userData.fcmToken = fcmToken;
        await AsyncStorage.setItem('userData',JSON.stringify(userData));

        let data = {
          "uid": uid,
          "fcmToken": fcmToken
        }

        api.post('/users/updateFcmToken', data)
      }

    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  CheckConnectivity = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable()
    if (!isConnected) {
      toast.show('No internet Connection')
    }
  };




  render() {
    return (
      (Platform.OS === 'ios')
        ?
          <AnimatedSplash
          isLoaded={this.state.isLoaded}
          logoImage={require("./src/assets/imgs/logo.png")}
          backgroundColor={"#090909"}
          logoHeight={150}
          logoWidht={150}
        >
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" backgroundColor="#ffff" />}
          <AppNavigator />
        </View>
        </AnimatedSplash>  
        :
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" backgroundColor="#ffff" />}
          <AppNavigator />
        </View>

    );
  }
}

export default App;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});



