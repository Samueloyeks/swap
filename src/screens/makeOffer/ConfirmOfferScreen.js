import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import SelectItem from '../../components/items/SelectItem'
import demoImage from '../../assets/imgs/demo.png'
import ConfirmOfferItem from '../../components/items/ConfirmOfferItem'
import ConfirmItem from '../../components/items/ConfirmItem'




export default class ConfirmOfferScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            search: true,
            offerItems: {
                "1": {
                    id: 1,
                    title: 'New Nike Shoes',
                    postedby: 'sam1234',
                    price: '$20',
                    timeAgo: '2 days',
                    images: [demoImage, demoImage, demoImage, demoImage],
                    liked: false,
                    favorited: false,
                    description:
                        'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
                    preferences: ['New Watch', 'Black Snapback', 'A date'],
                    categories: ['Men', 'Fashion', 'Footwear'],
                    numberAvailable: 2,
                    markAsOffered:true
                },
                "2": {
                    id: 2,
                    title: 'Used Wig',
                    postedby: 'kemi999',
                    price: '$50',
                    timeAgo: '1 hour',
                    images: [demoImage, demoImage, demoImage, demoImage],
                    liked: false,
                    favorited: false,
                    description:
                        'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
                    preferences: ['New Watch', 'Black Snapback', 'A date'],
                    categories: ['Men', 'Fashion', 'Footwear'],
                    numberAvailable: 2,
                    markAsOffered:true
                },
                "3": {
                    id: 3,
                    title: 'Used Joggers',
                    postedby: 'jones007',
                    price: '$20',
                    timeAgo: '1 week',
                    images: [demoImage, demoImage, demoImage, demoImage],
                    liked: false,
                    favorited: false,
                    description:
                        'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
                    preferences: ['New Watch', 'Black Snapback', 'A date'],
                    categories: ['Men', 'Fashion', 'Footwear'],
                    numberAvailable: 2,
                    markAsOffered:true
                },
            },
            item:{
                "1": {
                    id: 1,
                    title: 'New Nike Shoes',
                    postedby: 'sam1234',
                    price: '$20',
                    timeAgo: '2 days',
                    images: [demoImage, demoImage, demoImage, demoImage],
                    liked: false,
                    favorited: false,
                    description:
                        'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
                    preferences: ['New Watch', 'Black Snapback', 'A date'],
                    categories: ['Men', 'Fashion', 'Footwear'],
                    numberAvailable: 2,
                    markAsOffered:true
                },  
            }
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

    removeFromOffer = id => {
        let item = this.state.offerItems[id]
        const { markAsOffered } = item
    
        const newItem = {
          ...item,
          markAsOffered: !markAsOffered,
        }
    
        this.setState({
          offerItems: {
            ...this.state.offerItems,
            [id]: newItem
          }
        })
      }

    renderOfferItem = ({ item, index }) => {
        return (
            item.markAsOffered?
            <ConfirmOfferItem
            {...this.props}
            removeFromOffer={this.removeFromOffer}
            images={item.images}
            postedby={item.postedby}
            title={item.title}
            price={item.price}
            timeAgo={item.timeAgo}
            liked={item.liked}
            favorited={item.favorited}
            id={item.id}
            description={item.description}
            preferences={item.preferences}
            categories={item.categories}
            numberAvailable={item.numberAvailable}
            markAsOffered={item.markAsOffered}
        />:
        null
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <ConfirmItem
                {...this.props}
                favorite={this.favorite}
                like={this.like}
                images={item.images}
                postedby={item.postedby}
                title={item.title}
                price={item.price}
                timeAgo={item.timeAgo}
                liked={item.liked}
                favorited={item.favorited}
                id={item.id}
                description={item.description}
                preferences={item.preferences}
                categories={item.categories}
                numberAvailable={item.numberAvailable}
            />
        )
    }



    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.firstHalf}>
                    <FlatList
                        data={Object.values(this.state.offerItems)}
                        renderItem={this.renderOfferItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false}

                    />
                    <View style={{ height: 100,backgroundColor:'transparent' }}>

                    </View>
                </View>
                <View style={styles.centerContainer}>
                    <View style={styles.icon}>
                        <Icon name="exchange" size={27}></Icon>
                    </View>
                </View>
                <View style={styles.secondHalf}>
                <FlatList
                        data={Object.values(this.state.item)}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false}
                        extraData={this.state}

                    />
                    <View style={{ height: 100,backgroundColor:'transparent' }}>

                    </View>
                </View>

                <View style={styles.floatingButton}>
                    <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('SwapsScreen')}>
                        <Text style={styles.buttonText}>Send Offer</Text
                        ></TouchableOpacity>
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
        // marginTop: 10,
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

