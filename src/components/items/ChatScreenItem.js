import React, { Component } from 'react';
import { StyleSheet, Animated, View, Text, ActivityIndicator, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import demoAvatar from '../../assets/imgs/demoAvatar.png'




export default class ChatScreenItem extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Swipeable
                renderRightActions={() => {
                    return (
                        <TouchableOpacity style={styles.deleteButton}
                            onPress={() => {
                                this.props.deleteChat(this.props.id,this.props.itemDetails.id)
                            }}
                        >
                            <Icon size={30} name="trash-can" style={styles.deleteIcon} />
                        </TouchableOpacity>
                    );
                }}
            >
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('ChatsScreen', { itemDetails: this.props.itemDetails, chatTo: { uid: this.props.id,username:this.props.username } })}
                >
                    <View style={styles.container}>
                        <View style={styles.ImgContainer}>
                            <Image
                                style={styles.itemImage}
                                source={this.props.itemDetails.images ? ({ uri: this.props.itemDetails.images[0] }) : itemImage} />
                        </View>

                        <View style={styles.content}>
                            <View style={styles.stackedView}>
                                <View style={{ flex: 0.7,flexDirection:'row' }}>
                                <Image
                                style={styles.avatarImage}
                                source={this.props.profilePicture ? ({ uri: this.props.profilePicture }) : demoAvatar} />
                                    <Text style={styles.titleText}>{this.props.username}</Text>
                                </View>

                                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                    <TimeAgo time={this.props.lastMessageTime} interval={20000} style={{ fontSize: 8, color: '#808080', position: 'absolute', bottom: 5 }} />

                                </View>
                            </View>

                            <View style={styles.stackedView}>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={styles.lastMessageText}>{this.props.lastMessage}</Text>
                                </View>

                                {
                                    !this.props.opened ?
                                        <View style={{ flex: 0.1 }}>
                                            <Icon name="brightness-1" color="#FF9D5C" />
                                        </View>
                                        :
                                        null
                                }
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginBottom: 3,
        // marginTop: 3,
        height: 85
    },
    ImgContainer: {
        flex: 0.2,
        // backgroundColor:'red',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'column',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'

    },
    avatarImage: {
        width: 20,
        height: 20,
        borderRadius: 35,
        marginRight:10,
        marginBottom:10
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 10
    },
    lastMessageText: {
        fontSize: 12,
        color: 'grey'
    },
    content: {
        flex: 0.8,
        padding: 12,
        paddingLeft: 15,
        // backgroundColor: 'blue'
    },
    offerButton: {
        borderWidth: 0.6,
        backgroundColor: "transparent",
        width: 85,
        borderRadius: 20,
        borderColor: "black",
        padding: 1,
    },
    stackedView: {
        // flex: 0.2,
        // backgroundColor: 'blue',
        flexDirection: 'row'
    },
    titleText: {
        fontSize: 15,
        // padding:3
        // textTransform: 'uppercase'
    },
    deleteButton: {
        backgroundColor: 'red',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 3,
        marginBottom: 3
    },
    deleteIcon: {
        alignSelf: 'center',
        margin: 20,
    },
    acceptedText: {
        fontSize: 12,
        color: 'green',
        alignSelf: 'flex-end',
        textAlign: 'right',
        flex: 1
    }

});