import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import itemImage from '../../assets/imgs/item.png'



export default class ConfirmOfferItem extends Component {
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
                    <Image
                            style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', zIndex: 1, height: '100%' }} 
                            source={this.props.images ? ({ uri: this.props.images[0] }) : itemImage} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.stackedView}>
                            <Text style={styles.titleText}>{this.props.title}</Text>
                        </View>

                            <View style={{ alignSelf:'flex-end' }}>
                                <TouchableOpacity >
                                <Icon name="cancel"
                                    style={{ alignSelf: 'flex-end' }}
                                    size={37}
                                    color="#FE3939"
                                    onPress={() => this.props.removeFromOffer(this.props.index)}
                                />
                                </TouchableOpacity>
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
        flex: 0.45,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'column',
        overflow:'hidden',
        height:79,
        width:70
    },
    content: {
        flex: 0.55,
        padding: 5,
        paddingLeft: 5
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
        fontSize: 9,
        textTransform: 'uppercase',
        marginBottom:5
    }

});