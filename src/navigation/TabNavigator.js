import React, { Component } from 'react';
import { AppRegistry, Dimensions, Text, TouchableWithoutFeedback, View } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, HeaderBackground } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AddButton } from '../components/AddButton'
import ExploreScreen from '../screens/explore/ExploreScreen'
import ExploreItemDetailsScreen from '../screens/explore/ExploreItemDetailsScreen'
import MyItemDetailsScreen from '../screens/items/MyItemDetailsScreen'
import ItemsScreen from '../screens/items/ItemsScreen'
import UploadScreen from '../screens/upload/UploadScreen'
import SwapsScreen from '../screens/swaps/SwapsScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'
import EditProfileScreen from '../screens/profile/EditProfileScreen'
import UserProfileScreen from '../screens/explore/UserProfileScreen'
import SelectItemsScreen from '../screens/makeOffer/SelectItemsScreen'
import ConfirmOfferScreen from '../screens/makeOffer/ConfirmOfferScreen'
import ChatsScreen from '../screens/chat/ChatsScreen'
import OfferDetailsScreen from '../screens/items/OfferDetailsScreen'
import MultipleOffersScreen from '../screens/items/MultipleOffersScreen'
import SingleOfferDetailsScreen from '../screens/items/SingleOfferDetailsScreen'
import EditItemScreen from '../screens/items/EditItemScreen'
import SettingsScreen from '../screens/profile/SettingsScreen'
import SwapDetailsScreen from '../screens/swaps/SwapDetailsScreen'












const ExploreStack = createStackNavigator({
  ExploreScreen: {
    screen: ExploreScreen,
  },
  ExploreItemDetailsScreen: {
    screen: ExploreItemDetailsScreen,
  },
  UserProfileScreen: {
    screen: UserProfileScreen,
  },
  SelectItemsScreen: {
    screen: SelectItemsScreen,
  },
  ConfirmOfferScreen: {
    screen: ConfirmOfferScreen,
  },
  ChatsScreen: {
    screen: ChatsScreen,
  },
  MyItemDetailsScreen: {
    screen: MyItemDetailsScreen,
  }
})

const ItemsStack = createStackNavigator({
  ItemsScreen: {
    screen: ItemsScreen
  },
  MyItemDetailsScreen: {
    screen: MyItemDetailsScreen,
  },
  OfferDetailsScreen: {
    screen: OfferDetailsScreen
  },
  MultipleOffersScreen: {
    screen: MultipleOffersScreen
  },
  SingleOfferDetailsScreen: {
    screen: SingleOfferDetailsScreen
  },
  EditItemScreen: {
    screen: EditItemScreen
  },
  UserProfileScreen: {
    screen: UserProfileScreen,
  },
});
const SwapsStack = createStackNavigator({
  SwapsScreen: {
    screen: SwapsScreen,
  },
  UserProfileScreen: {
    screen: UserProfileScreen,
  },
  SwapDetailsScreen: {
    screen: SwapDetailsScreen
  },
  MyItemDetailsScreen: {
    screen: MyItemDetailsScreen,
  }
});

const ProfileStack = createStackNavigator({
  ProfileScreen: {
    screen: ProfileScreen
  },
  EditProfileScreen: {
    screen: EditProfileScreen,
  },
  SettingsScreen: {
    screen: SettingsScreen
  }

});

ExploreStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName !== "ExploreScreen") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};

ItemsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName !== "ItemsScreen") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};

SwapsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName !== "SwapsScreen") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};

ProfileStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName !== "ProfileScreen") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};

const tabNav = createBottomTabNavigator({
  'Explore': {
    screen: ExploreStack,
    navigationOptions: () => ({
      tabBarLabel: 'Explore',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="explore"
          color={tintColor}
          size={24}
        />
      ),
    })
  },
  'My Items': {
    screen: ItemsStack,
    navigationOptions: () => ({
      tabBarLabel: 'My Items',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="list"
          color={tintColor}
          size={24}
        />
      )
    })
  },
  'Upload': {
    screen: () => null,
    navigationOptions: (props) => ({
      tabBarIcon: (<AddButton {...props} />),
      // tabBarOnPress: () => {alert('UploadModal') },
      tabBarLabel: <Text></Text>,
    })
  },
  'Swaps': {
    screen: SwapsStack,
    navigationOptions: () => ({
      tabBarLabel: 'Swaps',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="swap-horiz"
          color={tintColor}
          size={24}
        />
      )
    })
  },
  'Profile': {
    screen: ProfileStack,
    navigationOptions: () => ({
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="person"
          color={tintColor}
          size={24}
        />
      )
    })
  }
}, {
  initialRouteName: 'Explore',
  tabBarOptions: {
    showLabel: true,
    activeTintColor: '#FF9D5C', // active icon color
    inactiveTintColor: '#090909',  // inactive icon color
    style: {
      backgroundColor: '#fff', // TabBar background
    }
  },
});

export default tabNav


const styles = {
  menu: {
    padding: 10,
    float: 'right'
  }
}