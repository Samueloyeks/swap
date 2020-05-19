import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
            <TouchableOpacity>
                <View style={styles.container}>
                    <View style={styles.ImgContainer}>
                        <Image style={{ alignSelf: 'center' }} resizeMode="stretch" source={this.props.item.images[0]} />
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
                            <View ><Text style={{ fontSize: 10 }}>Offer Made:</Text></View>
                            <View >
                                <TouchableOpacity><Text style={{ fontSize: 10, paddingLeft: 5 }}>{this.props.timeAgo} ago</Text></TouchableOpacity>
                            </View>
                        </View> 
                        <View style={styles.stackedView}>
                            <View style={{ flex: 0.06 }}>
                                <Icon name="check-circle"
                                    color={this.props.completed ? '#40A459' : '#D6D8E0'}
                                    onPress={() => this.props.markAsCompleted(this.props.id)}
                                />
                            </View>
                            <View style={{ flex: 0.94 }}>
                                <Text style={{ fontSize: 10, color: (this.props.completed) ? '#40A459' : '#D6D8E0' }}>{this.props.completed ? 'Marked as Completed' : 'Mark as Completed'}</Text>
                            </View>
                        </View>
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
                                <Text style={{ fontSize: 10, color: '#858585', bottom: 7, position: 'absolute'}}>5</Text>
                            </View>

                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TouchableOpacity style={styles.offerButton}><Text style={{ textAlign: 'center', fontSize: 12,color:'#FF9D5C' }}>Withdraw Offer</Text></TouchableOpacity>
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
        height:100

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