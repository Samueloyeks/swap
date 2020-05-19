import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SelectItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { swapped } = nextProps
        const { swapped: oldSwapped } = this.props

        // If "swapped" is different, then update                          
        return swapped !== oldSwapped
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('MyItemDetailsScreen', { itemDetails: this.props })}
            >
                <View style={styles.container}>
                    <View style={styles.ImgContainer}>
                        <Image style={{ alignSelf: 'center' }} resizeMode="stretch" source={this.props.images[0]} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.stackedView}>
                            <View style={{ flex: 0.7 }}>

                                <Text style={styles.titleText}>{this.props.title}</Text></View>

                        </View>
                        <View style={styles.stackedView}>
                            <View style={{bottom:-10,flexDirection:'row'}}>
                            <View ><Text style={{ fontSize: 10,textAlignVertical:'bottom' }}>Posted:</Text></View>
                            <View >
                                <TouchableOpacity><Text style={{ fontSize: 10, paddingLeft: 5 }}>{this.props.postedOn}</Text></TouchableOpacity>
                            </View>
                            </View>

                            <View style={{flex:0.8 }}>
                                <Icon name="check-circle"
                                style={{alignSelf:'flex-end',paddingBottom:7}}
                                size={37}
                                    color={this.props.swapped ? '#40A459' : '#D6D8E0'}
                                    onPress={() => this.props.markAsOffered(this.props.id)}
                                />
                            </View>
                        </View>

                        <View style={styles.stackedBottomView}>
                            <View style={{ flex: 0.09, bottom: 0 }}>
                                <Icon
                                    key={this.props.id}
                                    name="heart"
                                    size={15}
                                    color='#FF9D5C'
                                />
                            </View>
                            <View style={{ flex: 0.08 }}>
                                <Text style={{ fontSize: 10, color: '#858585', bottom: 2, position: 'absolute'}}>{this.props.likeCount}</Text>
                            </View>


                            <View style={{ flex: 0.9, alignItems: 'flex-end' }}>
                                <TouchableOpacity style={styles.offerButton}><Text style={{ textAlign: 'center', fontSize: 12,color:'#FF9D5C' }}>View</Text></TouchableOpacity>
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
    stackedBottomView: {
        flex: 0.5,
        // backgroundColor: 'blue',
        flexDirection: 'row',
        bottom:0,
    },
    titleText: {
        fontSize: 15,
        textTransform: 'uppercase'
    }

});