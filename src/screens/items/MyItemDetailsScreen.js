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
import toast from '../../utils/SimpleToast'





export default class MyItemDetailsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userData: null,
            itemDetails: {},
            isImageViewVisible: true,
            selectedIndex: 0,
            isRefreshing: false,
            offers: [],
            loading: false,
            sendingOfferResponse: false,
            markingAsSwapped: false
        }

        this.markAsSwapped = this.markAsSwapped.bind(this);
        this.deleteItem = this.deleteItem.bind(this)

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
            title: `${navigation.state.params.itemDetails.title}`,
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
                // navigation.state.params.onGoBack(navigation.state.params.itemDetails);
            }
            } />,
        }
    }

    async componentDidMount() {
        const { state } = await this.props.navigation;
        this.setState({
            itemDetails: state.params.itemDetails,
            selectedIndex: state.params.selectedIndex ? state.params.selectedIndex : 0,
        })
        await this.setUserData();
        this.getOffers();
        // alert(JSON.stringify(this.state.itemDetails))
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    getOffers = () => {
        this.setState({ loading: true })

        let data = {
            itemId: this.state.itemDetails.id
        }

        api.post('/items/getItemOffers', data).then((response) => {

            this.setState({
                offers: response.data.data,
                loading: false
            })

        }, err => {
            toast.show('Error')
            console.log(err);
            this.setState({ loading: false })
        })
    }

    onRefresh() {
        this.getOffers();
    }

    async setUserData() {
        return await db.get('userData').then(data => {
            this.setState({
                userData: JSON.parse(data)
            })
        })
    }

    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };

    requestMarkingConfirmation = () => {
        Alert.alert(
            "Mark as swapped?",
            "You will no longer receive new offers for this item and pending offers will be removed",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => this.markAsSwapped()

                },

            ],
            { cancelable: false }
        );
    }

    markAsSwapped = () => {
        this.setState({ markingAsSwapped: true })

        let data = {
            id: this.state.itemDetails.id
        }

        api.post('/items/markItemAsSwapped', data).then((response) => {
            if (response.data.status == 'success') {

                let details = this.state.itemDetails
                const { swapped } = details

                const newDetails = {
                    ...details,
                    swapped: !swapped,
                }

                this.setState({
                    markingAsSwapped: false,
                    itemDetails: newDetails
                })
            } else {
                this.setState({ markingAsSwapped: false });
                toast.show('Unable to mark as swapped');
            }
        })

    }

    requestDeleteConfirmation = () => {
        Alert.alert(
            "Delete This Item?",
            "Are you sure you want to delete this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => this.deleteItem()

                },

            ],
            { cancelable: false }
        );
    }

    deleteItem() {
        this.setState({ loading: true })

        let data = {
            itemId: this.state.itemDetails.id
        }

        api.post('/items/deleteItem', data)
            .then((response) => {
                this.props.navigation.goBack(null);
                this.props.navigation.state.params.onGoBack()
            })

    }

    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    };

    refreshDetails = (ok) => {
        this.getOffers();
    }

    requestAcceptConfirmation = (data) => {
        Alert.alert(
            "Accept Offer?",
            "Are you sure you want to accept this offer?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => this.acceptOffer(data)

                },

            ],
            { cancelable: false }
        );
    }

    requestDeclineConfirmation = (data) => {
        Alert.alert(
            "Decline Offer?",
            "Decline this offer?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => this.declineOffer(data)

                },

            ],
            { cancelable: false }
        );
    }

    acceptOffer(data) {
        this.setState({ sendingOfferResponse: true })
        let index = data.index

        api.post('/items/acceptOffer', data)
            .then((response) => {
                if (response.data.status == 'success') {
                    let newOffers = [...this.state.offers];

                    newOffers[index] = { ...newOffers[index], accepted: !newOffers[index].accepted };

                    this.setState({ offers: newOffers, sendingOfferResponse: false }, () => {
                        Alert.alert('', `Meet up with ${data.offeredby} to swap your items`)
                    });
                } else {
                    this.setState({ sendingOfferResponse: false });
                    toast.show('Error Accepting Offer')
                }
            })

    }


    declineOffer(data) {
        // this.setState({ sendingOfferResponse: true })
        let index = data.index

        const newOffers = this.state.offers.filter((item, arrIndex) =>
            arrIndex !== index
        );
        this.setState({ offers: newOffers }, () => {
            api.post('/items/declineOffer', data)
        });

    }


    renderItem = ({ item, index }) => {
        return (
            item.items.length > 1 ?
                <MultipleOfferItem
                    {...this.props}
                    acceptOffer={this.requestAcceptConfirmation}
                    declineOffer={this.requestDeclineConfirmation}
                    refreshDetails={this.refreshDetails}
                    offeredBy={item.offeredby}
                    accepted={item.accepted}
                    title={item.items[0].title}
                    id={item.id}
                    items={item.items}
                    itemId={item.itemId}
                    postedby={item.postedby}
                    userId={this.state.userData.uid}
                    offered={item.offered}
                    id={item.offerId}
                    swapId={item.swapId}
                    index={index}
                    sendingOfferResponse={this.state.sendingOfferResponse}
                />
                :
                <OfferItem
                    {...this.props}
                    acceptOffer={this.requestAcceptConfirmation}
                    declineOffer={this.requestDeclineConfirmation}
                    refreshDetails={this.refreshDetails}
                    offeredBy={item.offeredby}
                    accepted={item.accepted}
                    title={item.items[0].title}
                    id={item.id}
                    items={item.items}
                    itemId={item.itemId}
                    postedby={item.postedby}
                    userId={this.state.userData.uid}
                    offered={item.offered}
                    id={item.offerId}
                    swapId={item.swapId}
                    index={index}
                    sendingOfferResponse={this.state.sendingOfferResponse}
                />
        )
    }

    reloadPage = () => {
        this.getOffers()
    }


    render() {
        return (
            <View >
                <View style={{ backgroundColor: '#FF9D5C', padding: 10 }}>
                    <SegmentedControlTab
                        values={["Item", "Offers"]}
                        selectedIndex={this.state.selectedIndex}
                        onTabPress={this.handleIndexChange}
                        borderRadius={50}
                        tabTextStyle={{ color: '#FF9D5C' }}
                        activeTabStyle={{ backgroundColor: 'black' }}
                        tabStyle={{ borderColor: 'transparent' }}
                    />
                </View>
                {
                    (this.state.loading) ?
                        <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                            <ActivityIndicator />
                        </View>
                        :
                        ((this.state.selectedIndex == 0) ? (
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
                                            {
                                                this.state.markingAsSwapped ?
                                                    <View style={{ flex: 0.7 }}>
                                                        <Text style={{ fontSize: 8, color: 'green', bottom: 16, position: 'absolute', }}>Marking...</Text>
                                                    </View>
                                                    :
                                                    <View style={{ flexDirection: 'row', flex: 0.78 }}>
                                                        <View style={{ flex: 0.08 }}>
                                                            <Icon name="check-circle"
                                                                size={15}
                                                                color={this.state.itemDetails.swapped ? '#40A459' : '#D6D8E0'}
                                                                onPress={!this.state.itemDetails.swapped ? () => this.requestMarkingConfirmation() : null}
                                                            />
                                                        </View>

                                                        <View style={{ flex: 0.7 }}>
                                                            <Text style={{ fontSize: 8, bottom: 16, position: 'absolute', color: (this.state.itemDetails.swapped) ? '#40A459' : '#D6D8E0' }}>{this.state.itemDetails.swapped ? 'Marked as Swapped' : 'Mark as Swapped'}</Text>
                                                        </View>
                                                    </View>
                                            }

                                        </View>

                                        <View style={styles.stackedView}>
                                            <View style={{ flex: 0.5 }}><Text style={{ fontSize: 12 }}>Offers: {this.state.offers ? this.state.offers.length : 0}</Text></View>
                                            <View style={{ flex: 0.5 }}><Text style={{ fontSize: 12 }}>Units: {this.state.itemDetails.numberAvailable}</Text></View>
                                        </View>

                                        <View style={{ flex: 0.2, marginLeft: 12, bottom: 0 }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.navigation.navigate('MyItemChatsScreen', { itemDetails: this.state.itemDetails })
                                                }}
                                            >
                                                <Icon
                                                    key={this.props.id}
                                                    name="wechat"
                                                    size={22}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 15 }}>
                                    <View style={{ flex: 0.3 }}>
                                        <TouchableOpacity style={styles.offerButton}
                                            onPress={() => this.props.navigation.navigate("EditItemScreen", { itemDetails: this.state.itemDetails, onGoBack: this.refreshDetails })}
                                        >
                                            <Text style={{ textAlign: 'center', fontSize: 12, color: '#FF9D5C' }}>Edit Item</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flex: 0.3 }}>
                                        <TouchableOpacity style={styles.offerButton} onPress={() => this.requestDeleteConfirmation()}>
                                            <Text style={{ textAlign: 'center', fontSize: 12, color: '#FE3939' }}>Delete Item</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={{ fontSize: 14, color: '#545F71', marginVertical: 5 }}>Item Description</Text>
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
                        ) : (
                                (
                                    this.state.offers.length == 0 ?
                                        <View>
                                            <Text style={{ textAlign: 'center', fontSize: 13, color: 'lightgrey', margin: 20 }}>
                                                No Offers to Display
                                        </Text>
                                            <TouchableOpacity onPress={() => this.reloadPage()}>
                                                <Icon style={{ textAlign: 'center' }} name="rotate-right" size={20} />
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <FlatList
                                            data={this.state.offers}
                                            renderItem={this.renderItem}
                                            keyExtractor={item => item.offerId}
                                            contentContainerStyle={{ paddingBottom: 50 }}
                                            extraData={this.state}
                                            refreshControl={
                                                <RefreshControl
                                                    refreshing={this.state.isRefreshing}
                                                    onRefresh={this.onRefresh.bind(this)}
                                                />
                                            }
                                            ListFooterComponent={this.renderFooter.bind(this)}
                                            onEndReachedThreshold={0.4}
                                        />
                                )
                            ))
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
