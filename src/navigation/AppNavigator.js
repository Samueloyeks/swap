import React from 'react';
import { Text, Button, View, StatusBar, Dimensions, StyleSheet } from 'react-native'
import { createAppContainer, createSwitchNavigator, NavigationActions} from 'react-navigation';
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

import ExploreItemDetailsScreen from '../screens/explore/ExploreItemDetailsScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'
import EditProfileScreen from '../screens/profile/EditProfileScreen'
import ChatsScreen from '../screens/chat/ChatsScreen'
import SettingsScreen from '../screens/profile/SettingsScreen'
import MyFavoritesScreen from '../screens/profile/MyFavoritesScreen'
import { HeaderBackButton } from 'react-navigation-stack';






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

const ProfileStack = DismissableStackNavigator({
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#FF9D5C',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitle: () => null,
      headerLeft: () =>
        <HeaderBackButton onPress={() => {
          navigation.goBack(null)
          navigation.state.params.onGoBack();
        }
        } />,
    })
  },
  EditProfileScreen: {
    screen: EditProfileScreen,
  },
  SettingsScreen: {
    screen: SettingsScreen
  },
  MyFavoritesScreen: {
    screen: MyFavoritesScreen
  },
  ExploreItemDetailsScreen: {
    screen: ExploreItemDetailsScreen,
  },
  ChatsScreen: {
    screen: ChatsScreen,
  }

});

const AuthStack = createStackNavigator({
  // Landing: {
  //   screen: LandingScreen,
  //   navigationOptions: {
  //     headerShown: false,
  //   }
  // },
  SignIn: {
    screen: SignInScreen,
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

const MainStack = createStackNavigator({
  Main: {
    screen: TabNav,
    navigationOptions: {
      headerShown: false,
    }
  },
  UploadModal: {
    screen: UploadStack,
    navigationOptions: {
      headerShown: false,
    }
  },
  profile: {
    screen: ProfileStack,
    navigationOptions: {
      headerShown: false,
    }
  }
}, {
  mode: 'modal',
})


export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: {
      screen: AuthLoadingScreen,
      navigationOptions: () => {
        return {
          headerShown: false
        }
      },
    },
    Intro: {
      screen: LandingScreen
    },
    Auth: {
      screen: AuthStack
    },
    Main: {
      screen: MainStack
    }
  }, {
    headerMode: 'none',
    mode: 'modal',
  })
);

