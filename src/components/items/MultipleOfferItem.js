import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity,ActivityIndicator, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import itemImage from '../../assets/imgs/item.png';
import TimeAgo from 'react-native-timeago';

export default class MultipleOfferItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { sendingOfferResponse } = nextProps
        const { sendingOfferResponse: oldsendingOfferResponse} = this.props

        // If "liked" or "likeCount" is different, then update                          
        return sendingOfferResponse !== oldsendingOfferResponse 
    }
 
    onRefresh = () => {
        return;
    }
    
    render() {
        return (
            <TouchableOpacity 
            onPress={() => this.props.navigation.navigate('MultipleOffersScreen', { offerDetails: this.props, onGoBack: this.props.refreshDetails })}
            >
                <View style={styles.container}>
                    <View style={styles.ImgContainer}>
                        <Image style={{ position: 'absolute', right: 0, bottom: 0, width: 130, zIndex: 1, height: 90, borderRadius: 10 }} source={this.props.items ? ({ uri: this.props.items[0].images[0] }) : itemImage} />
                        <Image style={{ position: 'absolute', left: 0, top: 0, width: 130, height: 90 }} source={this.props.items ? ({ uri: this.props.items[1].images[0] }) : itemImage} />

                    </View>
                    <View style={styles.content}>
                        <View style={styles.stackedView}>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.titleText}>
                                    {(this.props.items.length == 2) ?
                                        (this.props.title + ` & 1 other`)
                                        :
                                        (this.props.title + ` & ${this.props.items.length - 1} others`)}
                                </Text>
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

                        <View style={styles.stackedView}>
                            {
                                this.props.sendingOfferResponse ?
                                    <View style={{ flex: 1, alignItems: 'flex-end', right: 0 }}>
                                        <ActivityIndicator style={styles.acceptedText} />
                                    </View>
                                    : this.props.accepted ?
                                        <Text style={styles.acceptedText}>Accepted</Text>
                                        :
                                        <View style={{ flex: 1, alignItems: 'flex-end', right: 0 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity style={styles.offerButton}
                                                    onPress={() => this.props.acceptOffer(data = {
                                                        offerId: this.props.id,
                                                        itemId: this.props.itemId,
                                                        swapId: this.props.swapId,
                                                        offeredby: this.props.offeredBy.username,
                                                        index: this.props.index
                                                    })}
                                                >
                                                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#FF9D5C' }}>Accept Offer</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.offerButton}
                                                    onPress={() => this.props.declineOffer({
                                                        offerId: this.props.id,
                                                        itemId: this.props.itemId,
                                                        swapId: this.props.swapId,
                                                        index: this.props.index
                                                    })}
                                                >
                                                    <Text style={{ textAlign: 'center', fontSize: 12, color: 'red' }}>Decline Offer</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                            }
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