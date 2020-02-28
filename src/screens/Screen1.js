import React from 'react';
import { StyleSheet,View,Text,Image, TouchableOpacity} from 'react-native';
// import AppIntroSlider from 'react-native-app-intro-slider';
// import {  } from 'react-native-gesture-handler';



 
  export default class Screen1 extends React.Component {

    render() {
      return(
        <View>
          <Text>Screen1</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Screen2')}><Text>Screen2</Text></TouchableOpacity>
        </View>
      )
    }
  }