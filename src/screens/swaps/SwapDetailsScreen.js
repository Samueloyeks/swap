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
import MyItem from '../../components/items/MyItem'



 


export default class SwapDetailsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userData: null,
            itemDetails: {},
            swapDetails: null,
            isImageViewVisible: true,
            selectedIndex: 0,
            isRefreshing: false,
            offers: [],
            offerItems: [],
            loading: false,
            sendingOfferResponse: false,
            markingAsSwapped: false
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
            title: `${navigation.state.params.swapDetails.item.title}`,
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
            swapDetails: state.params.swapDetails,
            itemDetails: state.params.swapDetails.item,
            offerItems: state.params.swapDetails.offerItems,
            selectedIndex: state.params.selectedIndex ? state.params.selectedIndex : 0,
        })

        await this.setUserData();
        // this.getOffers();
        // alert(JSON.stringify(this.state.itemDetails))
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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


    requestWithdrawConfirmation = () => {
        Alert.alert(
            "Withdraw Offer?",
            "Are you sure you want to withdraw this offer?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => this.withdrawOffer()

                },

            ],
            { cancelable: false }
        );
    }



    withdrawOffer = () => {
        this.setState({ loading: true })
    
        let data = {
            offerId: this.state.swapDetails.offerId,
            itemId: this.state.itemDetails.id,
            swapId: this.state.swapDetails.swapId,
        }

        api.post('/items/withdrawOffer', data).then((response) => {
    
          if (response.data.status == 'success') {

            this.props.navigation.goBack(null);
            this.props.navigation.state.params.onGoBack()

          } else {
            toast.show('Unable to withdraw offer')
          }
    
        }, error => {
          toast.show('Unable to withdraw offer')
    
        })
    
      }

    deleteItem = (index, id) => {

        const newItems = this.state.offerItems.filter((item, arrIndex) =>
            arrIndex !== index
        );
        this.setState({ offerItems: newItems }, () => {

            var data = {
                "itemId": id
            }

            api.post('/items/deleteItem', data)
        });

    }


    requestConfirmation = (index, id) => {
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
                    onPress: () => this.markAsSwapped(index, id)

                },

            ],
            { cancelable: false }
        );
    }

    markAsSwapped = (index, id) => {

        this.setState({ markingAsSwapped: true })

        let data = {
            id: id
        }

        api.post('/items/markItemAsSwapped', data).then((response) => {

            if (response.data.status == 'success') {
                let newItems = [...this.state.offerItems];

                newItems[index] = { ...newItems[index], swapped: !newItems[index].swapped };

                this.setState({
                    markingAsSwapped: false,
                    offerItems: newItems
                })

            } else {

                this.setState({ markingAsSwapped: false });
                toast.show('Unable to mark as swapped');

            }

        })

    }

    onRefresh = () => {
        return;
    }

    refreshDetails = () => {
        return;
    }

    renderItem = ({ item, index }) => {
        return (
            <MyItem
                {...this.props}
                markingAsSwapped={this.state.markingAsSwapped}
                markAsSwapped={this.requestConfirmation}
                refreshDetails={this.refreshDetails}
                deleteItem={this.deleteItem}
                images={item.images}
                postedby={item.postedby}
                title={item.title}
                price={item.price}
                posted={item.posted}
                liked={item.liked}
                favorited={item.favorited}
                id={item.id}
                index={index}
                description={item.description}
                preferences={item.preferences}
                categories={item.categories}
                numberAvailable={item.quantity}
                swapped={item.swapped}
                likes={item.likes}
            />
        )
    }

    render() {
        return (
            <View >
                <View style={{ backgroundColor: '#FF9D5C', padding: 10 }}>
                    <SegmentedControlTab
                        values={["Item", "Your Offer"]}
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

                                        {
                                            (this.state.swapDetails && this.state.userData) ?
                                                <View style={styles.stackedView}>
                                                    <View ><Text style={{ fontSize: 12 }}>Posted By</Text></View>
                                                    <View >
                                                        <TouchableOpacity onPress={
                                                            !(this.state.itemDetails.postedby.uid == this.state.userData.uid) ?
                                                                () =>
                                                                    this.props.navigation.navigate('UserProfileScreen',
                                                                        {
                                                                            userId: this.state.swapDetails.postedby.uid,
                                                                            username: this.state.swapDetails.postedby.username,
                                                                            onGoBack: this.onRefresh
                                                                        })
                                                                : null
                                                        }>
                                                            <Text style={{ fontSize: 12, color: '#FF9D5C', paddingLeft: 5 }}>
                                                                {this.state.swapDetails.postedby.username}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View> : null
                                        }


                                        <View style={styles.stackedView}>
                                            <View ><Text style={{ fontSize: 10 }}>Offer Made:</Text></View>
                                            <View >
                                                <TimeAgo time={this.state.itemDetails.posted} interval={20000} style={{ fontSize: 10, color: '#808080', marginLeft: 3 }} />
                                            </View>
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
                                                <Text style={{ fontSize: 8, color: '#858585', bottom: 10, position: 'absolute' }}>{this.state.itemDetails.likes}</Text>
                                            </View>


                                        </View>

                                        {
                                            (this.state.swapDetails && !this.state.swapDetails.completed)?
                                            <View style={styles.stackedView}>
                                                <TouchableOpacity style={styles.button} onPress={() => this.requestWithdrawConfirmation()}>
                                                    <Text style={styles.buttonText}>Withdraw Offer</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            null
                                        }
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
                                    this.state.offerItems.length == 0 ?
                                        <Text style={{ textAlign: 'center', fontSize: 13, color: 'lightgrey', margin: 20 }}>
                                            No Offers to Display
                                         </Text>
                                        :
                                        <FlatList
                                            data={this.state.offerItems}
                                            renderItem={this.renderItem}
                                            keyExtractor={item => item.id}
                                            contentContainerStyle={{ paddingBottom: 50 }}
                                            extraData={this.state}
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
