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
    const userToken = await AsyncStorage.getItem('userData'); 
    const firstTime = await AsyncStorage.getItem('firstTime')

    // This will switch to the intro screen the first time app is opened
    // if not, then it will switch to login or main app depending on if user is logged in 

    if (userToken) { 
      this.props.navigation.navigate('Main')
    } else {
      this.props.navigation.navigate(firstTime ? 'SignIn' : 'Auth');

    }

    // this.props.navigation.navigate('Main')
     
  };
 
  // Render any loading content that you like here
  render() {
    return (   
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <ActivityIndicator size="large" color="black" style={{alignSelf:'center'}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
  }
})