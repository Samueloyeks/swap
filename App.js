import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text,YellowBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import AnimatedSplash from "react-native-animated-splash-screen";
import SplashScreen from 'react-native-splash-screen';


YellowBox.ignoreWarnings(
  ['VirtualizedLists should never be nested'],
  ['Functions are not valid as a React child.'],
  ['Failed child context type:'], 
  ["No native ExponentConstants module found, are you sure the expo-constants's module is linked properly?"], 
  ['The "UMNativeModulesProxy" native module is not exported through NativeModules;']
  );



class App extends React.Component {
  state = {
    isLoaded: false
  };

  async componentDidMount() {
    this.setState({ isLoaded: true });
    //  useEffect(async()=>{
    await SplashScreen.hide();
    // })
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



