import React from 'react';
import { StyleSheet, View, Text, RefreshControl,Alert, ActivityIndicator, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { HeaderBackButton } from 'react-navigation-stack';
import Filters from '../../components/Filters';
import SingleOfferItem from '../../components/items/SingleOfferItem';
import demoImage from '../../assets/imgs/demo.png'
import db from '../../utils/db/Storage'
import api from '../../utils/api/ApiService'



export default class MultipleOffersScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            search: true,
            offers: [],
            loading: false,
            isRefreshing: false,
            error: null,
            searchString: '',
            sendingOfferResponse: false,
            offerDetails: {}
        }


    }

    async componentDidMount() {
        const { state } = await this.props.navigation;

        this.setState({
            offerDetails: state.params.offerDetails,
            offers: state.params.offerDetails.items,
        })
        await this.setUserData();
    }

    async setUserData() {
        return await db.get('userData').then(data => {
            this.setState({
                userData: JSON.parse(data)
            })
        })
    }




    static navigationOptions = ({ navigation }) => {

        return {
            title: ``,
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

    requestAcceptConfirmation = () => {
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
                    onPress: () => this.acceptOffer()

                },

            ],
            { cancelable: false }
        );
    }

    requestDeclineConfirmation = () => {
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
                    onPress: () => this.declineOffer()

                },

            ],
            { cancelable: false }
        );
    }

    acceptOffer() {
        this.setState({ sendingOfferResponse: true })

        let data = {
            offerId: this.state.offerDetails.id,
            itemId: this.state.offerDetails.itemId,
            swapId: this.state.offerDetails.swapId,
        }

        api.post('/items/acceptOffer', data)
            .then((response) => {
                this.props.navigation.goBack(null);
                this.props.navigation.state.params.onGoBack();
                Alert.alert('', `Meet up with ${this.state.offerDetails.offeredBy.username} to swap your items`)
            })

    }


    declineOffer() {
        this.setState({ sendingOfferResponse: true })

        let data = {
            offerId: this.state.offerDetails.id,
            itemId: this.state.offerDetails.itemId,
            swapId: this.state.offerDetails.swapId,
        }

        api.post('/items/declineOffer', data)
            .then((response) => {
                this.props.navigation.goBack(null);
                this.props.navigation.state.params.onGoBack();
            })
    }

    renderItem = ({ item, index }) => {
        return (
            <SingleOfferItem
                {...this.props}
                offeredBy={this.state.offerDetails.offeredBy}
                accepted={this.state.offerDetails.accepted}
                title={item.title}
                images={item.images}
                id={item.id}
                price={item.price}
                liked={item.liked}
                likes={item.likes}
                favorited={item.favorited}
                description={item.description}
                preferences={item.preferences}
                categories={item.categories}
                numberAvailable={item.quantity}
                itemId={this.state.offerDetails.itemId}
                postedby={this.state.offerDetails.postedby}
                offered={this.state.offerDetails.offered}
                id={this.state.offerDetails.id}
                swapId={this.state.offerDetails.swapId}
                index={index}
                sendingOfferResponse={this.state.sendingOfferResponse}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ backgroundColor: '#fff', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        this.state.sendingOfferResponse ?
                            <View style={{ flex: 1, alignItems: 'flex-end', right: 0,justifyContent:'center' }}>
                                <ActivityIndicator style={styles.acceptedText} />
                            </View>
                            :
                            this.state.offerDetails.accepted ?
                                <Text style={styles.acceptedText}>Offer Accepted</Text>
                                :
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={styles.offerButton}
                                        onPress={() => this.requestAcceptConfirmation()}
                                    >
                                        <Text style={{ textAlign: 'center', fontSize: 12, color: '#FF9D5C' }}>Accept Offer</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.offerButton}
                                        onPress={() => this.requestDeclineConfirmation()}
                                    >
                                        <Text style={{ textAlign: 'center', fontSize: 12, color: 'red' }}>Decline Offer</Text>
                                    </TouchableOpacity>
                                </View>
                    }
                </View>

                <FlatList
                    data={this.state.offers}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    extraData={this.state}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: Platform.OS === 'ios' ? 60 : 80,
    },
    header: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    bottomSpace: {
        marginBottom: 50
    },
    offerButton: {
        borderWidth: 0.6,
        backgroundColor: "transparent",
        width: 105,
        borderRadius: 20,
        borderColor: "black",
        padding: 7,
        marginHorizontal: 30
    },
    acceptedText: {
        fontSize: 15,
        color: 'green',

    }

});