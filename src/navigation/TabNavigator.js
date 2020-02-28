import React, { Component } from 'react';
import { AppRegistry, Dimensions } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import Screen1 from '../screens/Screen1'
import Screen2 from '../screens/Screen2'
import Screen3 from '../screens/Screen3'
import Screen4 from '../screens/Screen4'
import Screen5 from '../screens/Screen5'



const Stack1 = createStackNavigator({ Screen1: Screen1, Screen2: Screen2 });
const Stack2 = createStackNavigator({ Screen1: Screen3 });
const Stack3 = createStackNavigator({ Screen1: Screen4 });
const Stack4 = createStackNavigator({ Screen1: Screen5 });


const tabNav = createBottomTabNavigator({
    Tab1: Stack1,
    Tab2: Stack2,
    Tab3: Stack3,
    Tab4: Stack4
}, {
    initialRouteName: 'Tab1',
});

export default tabNav

