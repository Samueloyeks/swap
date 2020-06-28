import React from 'react';
import { StyleSheet, View, Text, Image, LinearGradient, TouchableOpacity, ActivityIndicator } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';






export default class LandingScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showRealApp: false,
    }
  }

  on_Done_all_slides = () => {
    this.setState({ showRealApp: true });
    AsyncStorage.setItem('firstTime', 'true')
  };

  on_Skip_slides = () => {
    this.setState({ showRealApp: true });
    AsyncStorage.setItem('firstTime', 'true')
  };

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="arrow-forward"
          color="#FF9D5C"
          size={24}
          style={{ backgroundColor: '#000000' }}
        />
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="check"
          color="#FF9D5C"
          size={24}
          style={{ backgroundColor: '#000000' }}
        />
      </View>
    );
  };


  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
    AsyncStorage.setItem('firstTime', 'true')
  }

  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }



  render() {
    if (this.state.showRealApp) {
      return (
        <View style={styles.slide}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')} style={styles.button} ><Text style={styles.buttonText}>Get Started</Text></TouchableOpacity>
        </View>
      );
    } else {
      return (
        <AppIntroSlider
          renderItem={this._renderItem}
          slides={slides}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          onDone={this.on_Done_all_slides}
          showSkipButton={true}
          skipLabel={<Text style={{ color: '#000000' }}>Skip</Text>}
          onSkip={this.on_Skip_slides} />
      );
    }
  }


}


const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#C4C4C4',
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    margin: 10,
  },
  title: {
    fontSize: 20,
    color: '#090909', 
    backgroundColor: 'transparent',
    textAlign: 'center',
    // marginBottom: 16,
    height: '10%'
  },
  image: {
    height: '10%'
  },
  slide: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 35,
    width: 300,
    height: 57,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 21,
    color: '#FF9D5C'
  },

});


const slides = [
  {
    key: 'first',
    title: 'Welcome to Swap',
    // title:'Post Items You Want to Swap',
    text: 'Upload your items with a description for others to see and view items from other users',
    image: require('../assets/imgs/introSlide1.png'),
    backgroundColor: '#FAFAFA',
    titleStyle: styles.title,
    textStyle: styles.text,
  },
  {
    key: 'second',
    title: 'Get Offers From Real People',
    text: 'Chat with, send and receive offers from people  willing to swap with other items or cash',
    image: require('../assets/imgs/introSlide2.png'),
    backgroundColor: '#FAFAFA',
    titleStyle: styles.title,
    textStyle: styles.text,
  },
  {
    key: 'third',
    title: 'Meet Up and Swap',
    text: 'Meet at a convenient location and swap your items. Get value from your used items today',
    image: require('../assets/imgs/introSlide3.png'),
    backgroundColor: '#FAFAFA',
    titleStyle: styles.title,
    textStyle: styles.text,
  }
];