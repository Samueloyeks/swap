import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CompletedSwapItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { rating,review } = nextProps
        const { rating:oldRating, review:oldReview } = this.props

        // If "rating" or "review" is different, then update                          
        return rating !== oldRating || review !== oldReview 
    }

    render() {
        return (
            <TouchableOpacity style={{ marginBottom: 10 }}>
                <View style={styles.container}>

                    <View style={styles.offerItem}>
                        <View style={styles.ImgContainer}>
                            {this.props.offerItems.length > 1 ?
                                <View>
                                    <Image style={{ position: 'absolute', right: 0, bottom: 0, width: 70, zIndex: 1, height: 70 }} source={this.props.offerItems[0].images[0]} />
                                    <Image style={{ position: 'absolute', left: 0, top: 0, width: 70, height: 77 }} source={this.props.offerItems[1].images[0]} />
                                </View>
                                :
                                <Image style={{ width: 77, height: 77 }} resizeMode="stretch" source={this.props.offerItems[0].images[0]} />
                            }
                        </View> 
                        <View style={styles.content}>
                            <Text style={{ textTransform: 'uppercase', fontSize: 9 }}>
                                {(this.props.offerItems.length == 1) ?
                                    (this.props.offerItems[0].title)
                                    :
                                    (this.props.offerItems[0].title + ` & ${this.props.offerItems.length - 1} more`)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.ImgContainer}>
                            <Image style={{ width: 77, height: 77 }} resizeMode="stretch" source={this.props.item.images[0]} />
                        </View>
                        <View style={styles.content}>
                            <Text style={{ textTransform: 'uppercase', fontSize: 9,flex:1,flexDirection:'row' }}>{this.props.item.title}</Text>

                            <View style={styles.stackedView}>
                                <View ><Text style={{ fontSize: 8 }}>Posted By</Text></View>
                                <View >
                                    <TouchableOpacity><Text style={{ fontSize: 8, color: '#FF9D5C', paddingLeft: 5 }}>{this.props.item.postedby}</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 0.95, backgroundColor: '#FFF', height: 25, flexDirection: 'row', borderRadius: 50, paddingHorizontal: 10 }}>
                        <Text style={{ alignSelf: 'center', fontSize: 7, color: '#40A459', flex: 0.4 }}>
                            Offer Date: <Text style={{ color: 'black' }}>{this.props.offered}</Text>
                        </Text>
                        {!this.props.rating ?
                            <TouchableOpacity style={styles.rateButton} onPress={() => this.props.toggleModal(this.props)}><Text style={{ textAlign: 'center', fontSize: 12, color: '#FF9D5C' }}>Rate</Text></TouchableOpacity>
                            :
                            <View style={styles.rated}><Icon name="star"><Text>{this.props.rating}</Text></Icon></View>
                        }
                        <Text style={{ alignSelf: 'center', fontSize: 7, color: '#FE3939', flex: 0.4, textAlign: 'right' }}>
                            Swapped: <Text style={{ color: 'black' }}>{this.props.swapDate ? this.props.swapDate : 'Not Set'}</Text>
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // shadowOffset: { width: 10, height: 10, },
        // shadowColor: 'black',
        // shadowOpacity: 1.0,
        marginBottom: 3,
        marginTop: 3,
    },
    ImgContainer: {
        flex: 0.45,
        // backgroundColor:'red',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'column',
        alignContent: 'center',
        overflow:'hidden'
    },
    content: {
        flex: 0.55,
        padding: 5,
        paddingLeft: 10
        // backgroundColor:'blue'
    },
    rateButton: {
        borderWidth: 0.6,
        backgroundColor: "#2F2E41",
        width: 85,
        borderRadius: 20,
        borderColor: "black",
        padding: 4,
        alignSelf: 'center',
        flex: 0.2
    },
    rated: {
        borderWidth: 0.6,
        backgroundColor: "#FF9D5C",
        width: 85,
        borderRadius: 20,
        borderColor: "black",
        padding: 4,
        alignSelf: 'center',
        flex: 0.2,
        justifyContent:'center',
        alignItems:'center'
    },
    stackedView: {
        flex: 0.25,
        // backgroundColor: 'blue',
        flexDirection: 'row',
    },
    titleText: {
        fontSize: 15,
        textTransform: 'uppercase'
    },
    item: {
        flex: 0.49,
        backgroundColor: '#FFF',
        flexDirection: 'row',
    },
    offerItem: {
        flex: 0.49,
        backgroundColor: '#FFF',
        flexDirection: 'row',

    }

});