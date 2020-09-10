import React, { Component } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, RefreshControl, FlatList, SafeAreaView, ListView, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, BackHandler, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import ImageSlide from '../../components/ImageSlide'
import { HeaderBackButton } from 'react-navigation-stack';
import SegmentedControlTab from "react-native-segmented-control-tab";
import demoImage from '../../assets/imgs/demo.png'
import demoImage2 from '../../assets/imgs/demo2.png'
import OfferItem from '../../components/items/OfferItem';
import MultipleOfferItem from '../../components/items/MultipleOfferItem';
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'




export default class SingleOfferDetailsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userData: null,
            itemDetails: {},
            offerDetails: {},
            isImageViewVisible: true,
            selectedIndex: 0,
            isRefreshing: false,
            loading: false
        }


        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }


    static navigationOptions = ({ navigation }) => {

        return {
            title: `${navigation.state.params.offerDetails.title}`,
            headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
            headerBackTitleVisible: false,
            headerStyle: {
                backgroundColor: '#FF9D5C',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerLeft: () => <HeaderBackButton onPress={() => {
                navigation.goBack(null);
                // navigation.state.params.onGoBack();
            }
            } />,
        }
    }

    async componentDidMount() {
        const { state } = await this.props.navigation;
        this.setState({
            // offerDetails: state.params.offerDetails,
            itemDetails: state.params.offerDetails,
        })
        await this.setUserData();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }



    async setUserData() {
        return await db.get('userData').then(data => {
            this.setState({
                userData: JSON.parse(data)
            })
        })
    }





    render() {
        return (
            <View >
                {
                    (this.state.loading) ?
                        <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                            <ActivityIndicator />
                        </View>
                        :
                        (
                            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 0.4, height: 150, marginBottom: 10, borderRadius: 5, overflow: 'hidden' }}>
                                        <ImageModal
                                            resizeMode='contain'
                                            imageBackgroundColor="lightgrey"
                                            style={{
                                                width: 150,
                                                height: 150,
                                            }}
                                            source={this.state.itemDetails.images ? ({ uri: this.state.itemDetails.images[0] }) : itemImage}
                                        />
                                    </View>
                                    <View style={{ flex: 0.6, flexDirection: 'column', padding: 10 }}>
                                        <Text style={styles.titleText}>{this.state.itemDetails.title}</Text>

                                        <View style={styles.stackedView}>
                                            <View ><Text style={{ fontSize: 10 }}>Offered By</Text></View>
                                            <View >
                                                <TouchableOpacity
                                                    onPress={
                                                        () =>
                                                            this.props.navigation.navigate('UserProfileScreen',
                                                                {
                                                                    userId: this.state.itemDetails.offeredBy.uid,
                                                                    username: this.state.itemDetails.offeredBy.username,
                                                                    onGoBack: ()=>{return}
                                                                })
                                                    }
                                                >
                                                    <Text style={{ fontSize: 10, color: '#FF9D5C', paddingLeft: 5 }}>
                                                        {this.state.itemDetails.offeredBy ? this.state.itemDetails.offeredBy.username : null}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={styles.stackedView}>
                                            <TimeAgo time={this.state.itemDetails.posted} interval={20000} style={{ fontSize: 10, color: '#808080' }} />

                                        </View>

                                        <View style={styles.stackedViewPadded}>
                                            <View style={{ flex: 0.08 }}>
                                                <Icon
                                                    key={this.state.itemDetails.id}
                                                    name="heart"
                                                    size={15}
                                                    color='#FF9D5C'
                                                />
                                            </View>
                                            <View style={{ flex: 0.14 }}>
                                                <Text style={{ fontSize: 8, color: '#858585', bottom: 16, position: 'absolute' }}>{this.state.itemDetails.likes}</Text>
                                            </View>

                                            <View style={{ flex: 0.33 }}>
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('ChatsScreen', { itemDetails: this.state.itemDetails, chatTo: this.state.itemDetails.offeredBy })}
                                                >
                                                    <Icon
                                                        key={this.state.itemDetails.id}
                                                        name="message"
                                                        size={20}
                                                        color={'#FFC107'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>



                                <Text style={{ fontSize: 14, color: '#545F71', marginVertical: 5 }}>Product Description</Text>
                                <Text style={{ color: '#9F9F9F', marginBottom: 10 }}>{this.state.itemDetails.description}</Text>

                                <Text style={{ fontSize: 14, color: '#545F71', marginVertical: 5 }}>Would Trade For:</Text>
                                <FlatList
                                    style={{ marginBottom: 10 }}
                                    data={this.state.itemDetails.preferences}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => <Text style={{ color: '#9F9F9F' }}>{item}</Text>}
                                />

                                <Text style={{ fontSize: 14, color: '#545F71' }}>More Images:</Text>
                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                    <FlatList
                                        horizontal={true}
                                        data={this.state.itemDetails.images ? this.state.itemDetails.images.slice(1) : null}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                                            <View style={{ color: 'red', width: 112, margin: 10, borderRadius: 5, overflow: 'hidden' }}>
                                                <ImageSlide image={item}></ImageSlide>
                                            </View>}
                                    />

                                </View>

                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={{ fontSize: 14, color: '#545F71', paddingVertical: 5 }}>Categories:</Text>
                                    </View>

                                    <View style={{ flex: 0.5 }}>
                                        <FlatList
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            data={this.state.itemDetails.categories ? this.state.itemDetails.categories : null}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => <Text> {(index == this.state.itemDetails.categories.length - 1) ? item.category : item.category + ','}</Text>}
                                        />
                                    </View>
                                </View>
                                <View style={{ height: 100 }}>

                                </View>
                            </ScrollView>
                        )
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        padding: 10
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
        flexDirection: 'row'
    },
    stackedViewPadded: {
        flex: 0.25,
        paddingTop: 5,
        flexDirection: 'row'
    },
    titleText: {
        fontSize: 15,
        textTransform: 'uppercase'
    },
    button: {
        backgroundColor: '#000000',
        borderRadius: 20,
        // width: 300,
        flex: 1,
        height: 30,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#FF9D5C'
    },
});
