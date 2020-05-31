import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';



export default class SwapItem  extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { completed } = nextProps
        const { completed: oldCompleted } = this.props

        // If "swapped" is different, then update                          
        return completed !== oldCompleted
    }

    render() {
        return (
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SwapDetailsScreen', { swapDetails: this.props, onGoBack: this.props.refreshDetails })}
            >
                <View style={styles.container}>
                    <View style={styles.ImgContainer}>
                    <Image
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            source={this.props.item.images ? ({ uri: this.props.item.images[0] }) : itemImage} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.stackedView}>
                            <View style={{ flex: 1 }}> 

                                <Text style={styles.titleText}>{this.props.item.title}</Text></View>
                            <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                <TouchableOpacity><Icon name="message" color="#FF9D5C" size={20} /></TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.stackedView}>
                            <View ><Text style={{ fontSize: 7 }}>Offer Made:</Text></View>
                            <View >
                            <TimeAgo time={this.props.offered} interval={20000} style={{ fontSize: 7, color: '#808080',marginLeft:3}} />
                            </View>
                        </View> 
                        {/* <View style={styles.stackedView}>
                            <View style={{ flex: 0.06 }}>
                                <Icon name="check-circle"
                                    color={this.props.completed ? '#40A459' : '#D6D8E0'}
                                    onPress={() => this.props.markAsCompleted(this.props.index,this.props.item.id)}
                                />
                            </View>
                            <View style={{ flex: 0.94 }}>
                                <Text style={{ fontSize: 10, color: (this.props.completed) ? '#40A459' : '#D6D8E0' }}>{this.props.completed ? 'Marked as Completed' : 'Mark as Completed'}</Text>
                            </View>
                        </View> */}
                        <View style={styles.stackedView}>
                            <View style={{ flex: 0.09, bottom: 0 }}>
                                <Icon
                                    key={this.props.item.id}
                                    name="heart"
                                    size={15}
                                    color='#FF9D5C'
                                />
                            </View>
                            <View style={{ flex: 0.05 }}>
                    <Text style={{ fontSize: 10, color: '#858585', bottom: 7, position: 'absolute'}}>{this.props.item.likes}</Text>
                            </View>

                        {
                            !this.props.completed?
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity style={styles.offerButton}
                                                onPress={() => this.props.withdrawOffer({
                                                    offerId: this.props.offerId,
                                                    itemId: this.props.item.id,
                                                    swapId: this.props.swapId,
                                                    index: this.props.index
                                                })}
                            >
                                <Text style={{ textAlign: 'center', fontSize: 12,color:'#FF9D5C' }}>Withdraw Offer</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
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
        height:100

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
        width: 100,
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