import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text,YellowBox,Alert } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import AnimatedSplash from "react-native-animated-splash-screen";
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';




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
     SplashScreen.hide();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('ENABLED')
        this.getToken();
    } else {
      console.log('ENABLED')
        this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      console.log('no fcm token')
        fcmToken = await firebase.messaging().getToken();
        console.log('gotten fcm token: '+fcmToken)
        if (fcmToken) {
          console.log('fcm token: '+fcmToken)
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }

  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        console.log('user authorized')
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log('notification: '+notification)
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.log('notificationOpen: '+notificationOpen)

        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log('message: '+message)

      //process data message
      console.log(JSON.stringify(message));
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

  render() {
    return (      
      (Platform.OS === 'ios')
        ?
      //   <AnimatedSplash
      //   isLoaded={this.state.isLoaded}
      //   logoImage={require("./src/assets/imgs/logo.png")}
      //   backgroundColor={"#090909"}
      //   logoHeight={150}
      //   logoWidht={150}
      // >
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" backgroundColor="#ffff" />}
          <AppNavigator />
        </View>
      // </AnimatedSplash> 
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



