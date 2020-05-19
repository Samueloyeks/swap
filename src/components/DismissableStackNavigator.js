import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
export default function DismissableStackNavigator(routes, options) {

  const StackNav = createStackNavigator(routes, options);

  const DismissableStackNav = ({navigation, screenProps}) => {
    const { state, goBack } = navigation;
    const props = {
      ...screenProps,
      dismiss: () => goBack(state.key),
    };

    return (
      <StackNav
        screenProps={props}
        navigation={navigation}
      />
    );
  }

  DismissableStackNav.router = StackNav.router;
  return DismissableStackNav;
};