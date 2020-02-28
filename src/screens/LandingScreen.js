import React from 'react';
import { StyleSheet,View,Text,Image, TouchableOpacity} from 'react-native';
// import AppIntroSlider from 'react-native-app-intro-slider';
// import {  } from 'react-native-gesture-handler';



 
  export default class LandingScreen extends React.Component {


    state = {
      showRealApp: false,
    }



    render() {
      return(
        <View>
          <Text>HELLO</Text>
        </View>
      )
    }
  }

   
const styles = StyleSheet.create({
    mainContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    image: {
      // width: '30%',
      // height: '40%',
    },
    text: {
      color: 'black',
      backgroundColor: 'transparent',
      textAlign: 'center',
      paddingHorizontal: 16,
      fontSize:24,
      margin:30,
    },
    title: {
      fontSize: 22,
      color: 'black',
      backgroundColor: 'transparent',
      textAlign: 'center',
      marginBottom: 16,
    },
    slide:{
      width:'100%',
      height:'100%',
      flex:1,
      alignItems:'center',
      justifyContent:'center',
    },
    slider:{
       flex:1,
       height:'50%'
    },
    button:{
      backgroundColor: '#4A087D',
      borderRadius: 35,
      width: 300,
      height: 57,
      textAlign:'center',
      alignItems:'center',
      justifyContent:'center', 
      marginTop:10,
    },
    buttonText:{
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 21,
      color: '#FFF'
    },    
    transparentButton:{
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor:'#4A087D',
      borderRadius: 35,
      width: 300,
      height: 57,
      textAlign:'center',
      alignItems:'center',
      justifyContent:'center', 
      marginTop:10,
    },
    transparentButtonText:{
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 21,
      color: '#4A087D'
    }

  });