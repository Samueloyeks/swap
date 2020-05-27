import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import db from '../utils/db/Storage';



export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      loading: true,
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }



  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // AsyncStorage.removeItem('userData')
    const userToken = await AsyncStorage.getItem('userData');
    const firstTime = await AsyncStorage.getItem('firstTime')

    // This will switch to the intro screen the first time app is opened
    // if not, then it will switch to login or main app depending on if user is logged in 

    {
      userToken ?
        this.props.navigation.navigate('Main')
        :
        firstTime ?
          this.props.navigation.navigate('SignIn')
          :
          this.props.navigation.navigate('Auth')

    }



  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <ActivityIndicator size="large" color="black" style={{ alignSelf: 'center' }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
})