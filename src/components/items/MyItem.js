import React, { Component } from 'react';
import { StyleSheet, Animated, View, Text,ActivityIndicator, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import Swipeable from 'react-native-gesture-handler/Swipeable';



export default class MyItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { markingAsSwapped } = nextProps
        const { markingAsSwapped: oldmarkingAsSwapped } = this.props

        // If "liked" or "likeCount" is different, then update                          
        return markingAsSwapped !== oldmarkingAsSwapped
    }



    render() {
        return (
            <Swipeable
                renderRightActions={() => {
                    return (
                        <TouchableOpacity style={styles.deleteButton}
                            onPress={() => {
                                this.props.deleteItem(this.props.index, this.props.id)
                            }}
                        >
                            <Icon size={30} name="trash-can" style={styles.deleteIcon} />
                        </TouchableOpacity>
                    );
                }}
            >
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('MyItemDetailsScreen', { itemDetails: this.props, onGoBack: this.props.refreshDetails, selectedIndex: 0 })}
                >
                    <View style={styles.container}>
                        <View style={styles.ImgContainer}>
                            <Image
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                source={this.props.images ? ({ uri: this.props.images[0] }) : itemImage} />
                        </View>
                        <View style={styles.content}>
                            <View style={styles.stackedView}>
                                <View style={{ flex: 1 }}>

                                    <Text style={styles.titleText}>{this.props.title}</Text></View>

                            </View>
                            <View style={styles.stackedView}>
                                <View style={{ flex: 0.25 }}>
                                    <TimeAgo time={this.props.posted} interval={20000} style={{ fontSize: 7, color: '#808080', position: 'absolute', bottom: 5 }} />
                                </View>

                            </View>
                            {
                                this.props.markingAsSwapped ?
                                    <View style={styles.stackedView}>
                                        <Text style={{fontSize:7,color:'green'}}>Marking...</Text>
                                    </View>
                                    :
                                    <View style={styles.stackedView}>
                                        <View style={{ flex: 0.06 }}>
                                            <Icon name="check-circle"
                                                color={this.props.swapped ? '#40A459' : '#D6D8E0'}
                                                onPress={!this.props.swapped ? () => this.props.markAsSwapped(this.props.index, this.props.id) : null}
                                            />
                                        </View>
                                        <View style={{ flex: 0.94 }}>
                                            <Text style={{ fontSize: 10, color: (this.props.swapped) ? '#40A459' : '#D6D8E0' }}>{this.props.swapped ? 'Marked as Swapped' : 'Mark as Swapped'}</Text>
                                        </View>
                                    </View>
                            }
                            <View style={styles.stackedView}>
                                <View style={{ flex: 0.09, bottom: 0 }}>
                                    <Icon
                                        key={this.props.id}
                                        name="heart"
                                        size={15}
                                        color='#FF9D5C'
                                    />
                                </View>
                                <View style={{ flex: 0.05 }}>
                                    <Text style={{ fontSize: 10, color: '#858585', bottom: 7, position: 'absolute' }}>{this.props.likes}</Text>
                                </View>
                                <View style={{ flex: 0.2, marginLeft: 12, bottom: 0 }}>
                                    <TouchableOpacity>
                                        <Icon
                                            key={this.props.id}
                                            name="wechat"
                                            size={15}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flex: 0.7, alignItems: 'flex-end' }}>
                                    <TouchableOpacity style={styles.offerButton}
                                        onPress={() => this.props.navigation.navigate('MyItemDetailsScreen', { itemDetails: this.props, onGoBack: this.props.refreshDetails, selectedIndex: 1 })}
                                    >
                                        <Text style={{ textAlign: 'center', fontSize: 12, color: '#FF9D5C' }}>View Offers</Text>
                                    </TouchableOpacity>
                                </View>
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
        // shadowOffset: { width: 10, height: 10, },
        // shadowColor: 'black',
        // shadowOpacity: 1.0,
        backgroundColor: '#FFF',
        marginBottom: 3,
        marginTop: 3,
        height: 100
    },
    ImgContainer: {
        flex: 0.35,
        // backgroundColor:'red',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'column',
        overflow: 'hidden'

    },
    content: {
        flex: 0.65,
        padding: 10,
        paddingLeft: 15
        // backgroundColor:'blue'
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
        flex: 0.25,
        // backgroundColor: 'blue',
        flexDirection: 'row'
    },
    titleText: {
        fontSize: 15,
        textTransform: 'uppercase'
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