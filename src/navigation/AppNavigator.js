import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LandingScreen  from '../screens/LandingScreen'
// import  SignupScreen  from '../src/screens/SignupScreen'
// import  SignInScreen  from '../src/screens/SignInScreen'
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import TabNav from './TabNavigator'





const AuthStack = createStackNavigator({ Landing: LandingScreen });
// const MainStack = createStackNavigator({ Home: HomeScreen, Profile: ProfileScreen, History: HistoryScreen, Payments: PaymentsScreen ,initialRouteName:'Home'});


export default createAppContainer( 
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Main: TabNav,
  },
    {
      initialRouteName: 'AuthLoading',
    }),
);
