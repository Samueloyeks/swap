import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NumberFormat from 'react-number-format';
import TimeAgo from 'react-native-timeago';
import itemImage from '../../assets/imgs/item.png'



export default class ExploreItem extends Component {
    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     const { liked, likeCount, favorited } = nextProps
    //     const { liked: oldLiked, likeCount: oldLikeCount, favorited: oldFavorited } = this.props

    //     return liked !== oldLiked || likeCount !== oldLikeCount || favorited !== oldFavorited
    // }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ExploreItemDetailsScreen', { itemDetails: this.props, onGoBack: this.props.refreshDetails })}
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
                            <View style={{ flex: 0.7 }}>
                                <Text style={styles.titleText}>{this.props.title}</Text> 
                            </View>
                            {
                                !(this.props.userId == this.props.postedby.uid) ?
                                    <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatsScreen', { itemDetails: this.props, chatTo:this.props.postedby })}>
                                            <Icon name="message" color="#FF9D5C" size={20} />
                                        </TouchableOpacity>
                                    </View> : null
                            }
                        </View>
                        <View style={styles.stackedView}>
                            <View ><Text style={{ fontSize: 10 }}>Posted By</Text></View>
                            <View >
                                <TouchableOpacity
                                    onPress={
                                        !(this.props.userId == this.props.postedby.uid) ?
                                            () =>
                                                this.props.navigation.navigate('UserProfileScreen',
                                                    {
                                                        userId: this.props.postedby.uid,
                                                        username: this.props.postedby.username,
                                                        onGoBack: this.props.onRefresh
                                                    }) 
                                                     : 
                                                     ()=>this.props.navigation.navigate('ProfileScreen')
                                                     }>
                                    <Text style={{ fontSize: 10, color: '#FF9D5C', paddingLeft: 5 }}>{this.props.postedby.username}</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.props.distance ?
                                    <Text style={{ fontSize: 10, color: 'red', marginLeft: 10 }}>
                                        {Math.round(this.props.distance * 1.60934)}km
                                    </Text>
                                    :
                                    null
                            }
                        </View>
                        <View style={styles.stackedView}>
                            <View >
                                <NumberFormat
                                    value={this.props.price}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'₦'}
                                    renderText={value => <Text style={{ fontSize: 10, color: '#40A459' }}>{value}</Text>}
                                />
                            </View>
                        </View>
                        <View style={styles.stackedView}>
                            <View style={{ flex: 0.25 }}>
                                <TimeAgo time={this.props.posted} interval={20000} style={{ fontSize: 7, color: '#808080', position: 'absolute', bottom: 5 }} />
                            </View>
                            <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                                <Icon
                                    key={this.props.id}
                                    name="heart-circle"
                                    size={20}
                                    color="#D6D8E0"
                                    color={this.props.liked ? '#FF9D5C' : '#D6D8E0'}
                                    onPress={() => this.props.like(this.props.index, this.props.id)}
                                />
                            </View>

                            <View style={{ flex: 0.15, paddingLeft: 5 }}>
                                <Icon
                                    key={this.props.id}
                                    name="star"
                                    size={20}
                                    color="#D6D8E0"
                                    color={this.props.favorited ? '#FFC107' : '#D6D8E0'}
                                    onPress={() => this.props.favorite(this.props.index, this.props.id)}
                                />
                            </View> 

                            {
                                !(this.props.userId == this.props.postedby.uid) ?
                                    <View style={{ flex: 0.45, alignItems: 'flex-end' }}>
                                        <TouchableOpacity style={styles.offerButton} onPress={() => this.props.navigation.navigate('SelectItemsScreen', { item: this.props })}>
                                            <Text style={{ textAlign: 'center', fontSize: 12, color: '#FF9D5C' }}>Make Offer</Text>
                                        </TouchableOpacity>
                                    </View> 
                                    : null
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
        height: 100
    },
    ImgContainer: {
        flex: 0.35,
        // backgroundColor:'red',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'column',
        overflow: 'hidden',
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