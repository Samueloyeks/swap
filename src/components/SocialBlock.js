import React from 'react';
import T from 'prop-types';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import facebookImg from '../assets/imgs/facebookImg.png'
import googleImg from '../assets/imgs/googleImg.png'

const styles = StyleSheet.create({
  socialBlock: {
 flexWrap: 'wrap', 
 alignItems: 'center', 
 flexDirection: 'row',
  justifyContent: 'space-evenly',
   marginTop: 10
  },
  socialButton: {
    width: 40,
    height: 40,
  },
});

const SocialBlock = ({ children, handleFacebookSubmit, handleGoogleSubmit }) => (
  <View style={styles.socialBlock}>
    {children}
    <TouchableOpacity onPress={handleFacebookSubmit}>
      <View style={styles.socialButton}>
        <Image source={facebookImg} />
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleGoogleSubmit}>
      <View style={styles.socialButton}>
        <Image source={googleImg} />
      </View>
    </TouchableOpacity>
  </View>
);

SocialBlock.propTypes = {
  children: T.node,
  handleFacebookSubmit: T.func.isRequired,
  handleGoogleSubmit: T.func.isRequired,
};

export default SocialBlock;
