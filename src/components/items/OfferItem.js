import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class OfferItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { liked, likeCount, favorited } = nextProps
        const { liked: oldLiked, likeCount: oldLikeCount, favorited: oldFavorited } = this.props

        // If "liked" or "likeCount" is different, then update                          
        return liked !== oldLiked || likeCount !== oldLikeCount || favorited !== oldFavorited
    }

    render() {
        return (
            <TouchableOpacity>
                <View style={styles.container}>
                    <View style={styles.ImgContainer}>
                        <Image style={{ alignSelf: 'center' }} resizeMode="stretch" source={this.props.items[0].images[0]} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.stackedView}>

                            <View style={{ flex: 0.8 }}>
                                <Text style={styles.titleText}>{this.props.title}</Text>
                            </View>

                            <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                                <TouchableOpacity><Icon name="message" color="#FF9D5C" size={20} /></TouchableOpacity>
                            </View>

                        </View>
                        <View style={styles.stackedView}>
                            <View ><Text style={{ fontSize: 10 }}>Offered By</Text></View>
                            <View >
                                <TouchableOpacity><Text style={{ fontSize: 10, color: '#FF9D5C', paddingLeft: 5 }}>{this.props.offeredBy}</Text></TouchableOpacity>
                            </View>
                        </View>

                        <View style={{flex:1,paddingVertical:10}}>
                            <Text style={{ fontSize: 10, color: '#808080' }}> Offer Made: {this.props.timeAgo} ago</Text>
                        </View>

                        <View style={styles.stackedView}>
                            <View style={{ flex: 1, alignItems: 'flex-end',right:0 }}>
                                <TouchableOpacity style={styles.offerButton}><Text style={{ textAlign: 'center', fontSize: 12, color: '#FF9D5C' }}>Accept Offer</Text></TouchableOpacity>
                            </View>
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
        overflow:'hidden'

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
    }

});