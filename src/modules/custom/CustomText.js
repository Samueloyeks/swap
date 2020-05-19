import React from 'react';
import { StyleSheet, Text  } from 'react-native';

export const CustomText = props => <Text style={styles.text}>{props.children}</Text>

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Righteous-Regular',
  }
});