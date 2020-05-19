import React, {Component} from 'react';
import {Animated, TouchableHighlight, View} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';  
const SIZE = 80;
class AddButton extends Component {
    mode = new Animated.Value(0);
    toggleView = () => { 
        Animated.timing(this.mode, {
            toValue: this.mode._value === 0 ? 1 : 0,
            duration: 300 
        }).start();
        this.props.navigation.navigate('UploadModal') 
    };
    render() {
        const firstX = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [20, -40]
        });
        const firstY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -30]
        });
        const secondX = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 20]
        });
        const secondY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -55]
        });
        const thirdX = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 80]
        });
        const thirdY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -30]
        });
        const opacity = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const rotation = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '45deg']
        });
        return (
            <View style={{
                position: 'absolute',
                alignItems: 'center',
            }}>
                {/* <Animated.View style={{
                    position: 'absolute',
                    left: firstX,
                    top: firstY,
                    opacity
                }}>
                    <TouchableHighlight
                        onPress={() => {
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE / 2,
                            height: SIZE / 2,
                            borderRadius: SIZE / 4,
                            backgroundColor: '#48A2F8'
                        }}
                    >
                        <Icon name="rocket" size={16} color="#F8F8F8"/>
                    </TouchableHighlight>
                </Animated.View>
                <Animated.View style={{
                    position: 'absolute',
                    left: secondX,
                    top: secondY,
                    opacity
                }}>
                    <TouchableHighlight
                        onPress={() => {
                        }}
                        style={{
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE / 2,
                            height: SIZE / 2,
                            borderRadius: SIZE / 4,
                            backgroundColor: '#48A2F8'
                        }}
                    >
                        <Icon name="home" size={16} color="#F8F8F8"/>
                    </TouchableHighlight>
                </Animated.View>
                <Animated.View style={{
                    position: 'absolute',
                    left: thirdX,
                    top: thirdY,
                    opacity
                }}>
                    <TouchableHighlight
                        onPress={() => {
                        }}
                        style={{
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE / 2,
                            height: SIZE / 2,
                            borderRadius: SIZE / 4,
                            backgroundColor: '#48A2F8'
                        }}
                    >
                        <Icon name="archive" size={16} color="#F8F8F8"/>
                    </TouchableHighlight>
                </Animated.View> */}
                <TouchableHighlight
                    onPress={this.toggleView}
                    underlayColor="#FF9D5C"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: SIZE,
                        height: SIZE,
                        borderRadius: SIZE / 2,
                        backgroundColor: '#090909',
                        marginBottom:17
                    }}
                >
                    <Animated.View style={{
                        transform: [
                            {rotate: rotation}
                        ]
                    }}>
                        <Icon name="add" size={30} color="#F8F8F8"/>
                    </Animated.View>
                </TouchableHighlight>
            </View>
        );
    }
}
export {AddButton};