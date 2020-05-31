import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import itemImage from '../../assets/imgs/item.png';
import TimeAgo from 'react-native-timeago';



export default class SingleOfferItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { sendingOfferResponse } = nextProps
        const { sendingOfferResponse: oldsendingOfferResponse } = this.props

        // If "liked" or "likeCount" is different, then update                          
        return sendingOfferResponse !== oldsendingOfferResponse
    }
 
    onRefresh = () => {
        return;
    }
    
    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('SingleOfferDetailsScreen', { offerDetails: this.props, onGoBack: this.props.refreshDetails })}
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
                                <Text style={styles.titleText}>{this.props.title}</Text>
                            </View>

                        </View>
                        <View style={styles.stackedView}>
                            <View ><Text style={{ fontSize: 10 }}>Offered By</Text></View>
                            <View >
                                <TouchableOpacity
                                onPress={
                                    () =>
                                        this.props.navigation.navigate('UserProfileScreen',
                                            {
                                                userId: this.props.offeredBy.uid,
                                                username: this.props.offeredBy.username,
                                                onGoBack: this.onRefresh
                                            })
                                }
                                ><Text style={{ fontSize: 10, color: '#FF9D5C', paddingLeft: 5 }}>{this.props.offeredBy.username}</Text></TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flex: 1, paddingVertical: 10 }}>
                            <Text style={{ fontSize: 10, color: '#808080' }}> Offer Made: <TimeAgo time={this.props.offered} interval={20000} style={{ fontSize: 10, color: '#808080', }} /></Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
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
        // height:100
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
        marginHorizontal: 5
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
    acceptedText: {
        fontSize: 12,
        color: 'green',
        alignSelf: 'flex-end',
        textAlign: 'right',
        flex: 1
    }

});