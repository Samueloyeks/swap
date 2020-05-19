import React from 'react';
import { Text, Button, View } from 'react-native'
import { createAppContainer, createSwitchNavigator, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LandingScreen from '../screens/LandingScreen'
import SignupScreen from '../screens/SignUpScreen'
import SignInScreen from '../screens/SignInScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import TabNav from './TabNavigator';
import UploadScreen from '../screens/upload/UploadScreen'
import DismissableStackNavigator from '../components/DismissableStackNavigator'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';





const UploadStack = DismissableStackNavigator({
  Upload: {
    screen: (props) => <UploadScreen title="Upload" {...props} />,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitle: () => null,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.goBack(null)}>
          <Icon name="remove" size={30} style={{ padding: 10 }}></Icon>
        </TouchableOpacity>
      ),
    }),
  },
})




const AuthStack = createStackNavigator({
  Landing: {
    screen: LandingScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  SignUp: {
    screen: SignupScreen,
    navigationOptions: () => {
      return {
        headerBackTitleVisible: false,
        headerTransparent: true,
        headerTintColor: '#FF9D5C',
        headerTitle: () => <Text></Text>
      }
    },
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  ForgotPassword: {
    screen: ForgotPasswordScreen,
    navigationOptions: {
      headerBackTitleVisible: false,
      headerTransparent: true,
      headerTintColor: '#FF9D5C',
      headerTitle: () => <Text></Text>
    }
  },
});


export default createAppContainer(
  createStackNavigator({

    AuthLoading: {
      screen: AuthLoadingScreen,
      navigationOptions: () => {
        return {
          headerShown: false
        }
      },
    },
    Auth: {
      screen: AuthStack
    },
    Main: {
      screen: TabNav
    },
    UploadModal: {
      screen: UploadStack
    }
  }, {
    headerMode: 'none',
    mode: 'modal',
  },
    {
      // initialRouteName: 'AuthLoading',
    }),
);
