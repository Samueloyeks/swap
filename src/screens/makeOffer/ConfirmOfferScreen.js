import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, BackHandler, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import SelectItem from '../../components/items/SelectItem'
import demoImage from '../../assets/imgs/demo.png'
import ConfirmOfferItem from '../../components/items/ConfirmOfferItem'
import ConfirmItem from '../../components/items/ConfirmItem'
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'
import FormButton from '../../components/FormButton'






export default class ConfirmOfferScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            search: true,
            offerItems: [],
            item: [],
            loading: false
        }

        this.removeFromOffer = this.removeFromOffer.bind(this);
    }




    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#FF9D5C',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerBackTitleVisible: false,
            headerTitle: () => (
                <View>
                    <View style={styles.header}><Text style={{ fontSize: 20 }}>Confirm Offer</Text></View>
                </View>
            ),
        };
    };

    async componentDidMount() {
        const { state } = await this.props.navigation;
        this.setState({
            offerItems: state.params.offerItems,
            item: [state.params.item],
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

    removeFromOffer = index => {
        if (this.state.offerItems.length == 1) {
            toast.show('You must offer at least 1 item')
        } else {
            let newOfferItems = [...this.state.offerItems];

            newOfferItems.splice(index, 1)


            this.setState({
                offerItems: newOfferItems
            })
        }
    }

    sendOffer = () => {
        this.setState({ loading: true })
        let itemId = this.state.item[0].id;
        let postedby = this.state.item[0].postedby.uid
        let offerItems = [...this.state.offerItems]
        let offerItemIds = [];

        for (var key in offerItems) {
            offerItemIds.push({ id: offerItems[key].id })
        }

        let offerData = {
            itemId,
            offerItemIds,
            offeredby: this.state.userData.uid,
            accepted: false,
            postedby: postedby
        }

        console.log(offerData)
        api.post('/items/sendOffer', offerData).then((response) => {
            if (response.data.status === 'success') {
                toast.show('Offer Sent Successfully')
                this.setState({ loading: false })
                this.props.navigation.popToTop()
                this.props.navigation.navigate('SwapsScreen')
            }
        }, err => {
            toast.show('Unable to send offer')
            this.setState({ loading: false })
        })
    }

    renderOfferItem = ({ item, index }) => {
        return (
            <ConfirmOfferItem
                {...this.props}
                removeFromOffer={this.removeFromOffer}
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
            />
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <ConfirmItem
                {...this.props}
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
            />
        )
    }



    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.firstHalf}>
                    <FlatList
                        data={this.state.offerItems}
                        renderItem={this.renderOfferItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false}

                    />
                    <View style={{ height: 100, backgroundColor: 'transparent' }}>

                    </View>
                </View>
                <View style={styles.centerContainer}>
                    <View style={styles.icon}>
                        <Icon name="exchange" size={27}></Icon>
                    </View>
                </View>
                <View style={styles.secondHalf}>
                    <FlatList
                        data={this.state.item}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false}
                        extraData={this.state}

                    />
                    <View style={{ height: 100, backgroundColor: 'transparent' }}>

                    </View>
                </View>

                <View style={styles.floatingButton}>
                    <FormButton
                        buttonType='outline'
                        onPress={this.sendOffer}
                        title='Send Offer'
                        buttonColor='#FF9D5C'
                        disabled={this.state.loading}
                        loading={this.state.loading}
                    />
                </View>

            </View>
        );
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
        flex: 1,

    },
    firstHalf: {
        flex: 0.49,
        // backgroundColor:'grey'
    },
    secondHalf: {
        flex: 0.49,
        // backgroundColor:'pink'
    },
    centerContainer: {
        flex: 0.004,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C4C4C4',
        zIndex: 1
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: '#FF9D5C',
        alignSelf: 'center',
        borderRadius: 50,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#000000',
        borderRadius: 35,
        width: 300,
        height: 57,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingButton: {
        position: 'absolute',
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        bottom: 40,
        width: '100%'
    },
    buttonText: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 21,
        color: '#FF9D5C'
    },

});

