import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import AnimatedSplash from "react-native-animated-splash-screen";
import splashImage from './src/assets/imgs/logo.png'
import SplashScreen from 'react-native-splash-screen';




class App extends React.Component {
  state = {
    isLoaded: false
  };
 
  async componentDidMount() {
    SplashScreen.hide()
    this.setState({ isLoaded: true }); 
  }
 
  render() {
    return (
      <AnimatedSplash
      isLoaded={this.state.isLoaded}
      logoImage={require("./src/assets/imgs/logo.png")}
      backgroundColor={"#fff"} 
      // backgroundColor={"#090909"} 
      logoHeight={150}
      logoWidht={150}
    >
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" backgroundColor="#ffff"/>}
        <AppNavigator />
      </View>
    </AnimatedSplash>
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



