import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LargeButton extends Component {
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.action} style={styles.button} ><Text style={styles.buttonText}>{this.props.text}</Text></TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
})