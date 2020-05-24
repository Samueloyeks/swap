import React, { Component } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, ListView, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, BackHandler, ScrollView } from 'react-native';
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




export default class MyItemDetailsScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            itemDetails: {},
            isImageViewVisible: true,
            selectedIndex: 0,
            offers: {
                "1": {
                    id: 1,
                    offeredBy: 'sam346',
                    timeAgo: '2 days',
                    items: [{
                        title: 'New Nike Shoes',
                        postedby: 'sam346',
                        price: '$20',
                        timeAgo: '2 days',
                        images: [demoImage, demoImage, demoImage, demoImage],
                        liked: false,
                        favorited: false,
                        description:
                            'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
                        preferences: ['New Watch', 'Black Snapback', 'A date'],
                        categories: ['Men', 'Fashion', 'Footwear'],
                        numberAvailable: 2
                    }]
                },
                "2": {
                    id: 2,
                    offeredBy: 'jamesokoye',
                    timeAgo: '2 weeks',
                    items: [{
                        title: 'Apple Watch',
                        postedby: 'jamesokoye',
                        timeAgo: '2 days',
                        images: [demoImage, demoImage, demoImage, demoImage],
                        liked: false,
                        favorited: false,
                        description:
                            'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
                        preferences: ['New Watch', 'Black Snapback', 'A date'],
                        categories: ['Men', 'Fashion', 'Accessories'],
                        numberAvailable: 1
                    }, {
                        title: 'Used Macbook Pro',
                        postedby: 'jamesokoye',
                        price: '$20',
                        timeAgo: '2 days',
                        images: [demoImage2, demoImage, demoImage, demoImage],
                        liked: false,
                        favorited: false,
                        description:
                            'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
                        preferences: ['New Watch', 'Black Snapback', 'A date'],
                        categories: ['Gadgets', 'Accessories'],
                        numberAvailable: 1
                    }]
                },
                "3": {
                    id: 3,
                    offeredBy: 'cindy289',
                    timeAgo: '5 months',
                    items: [{
                        title: 'Bottle of Vodka',
                        postedby: 'cindy289',
                        price: '$10',
                        timeAgo: '2 days',
                        images: [demoImage, demoImage, demoImage, demoImage],
                        liked: false,
                        favorited: false,
                        description:
                            'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
                        preferences: ['New Watch', 'Black Snapback', 'A date'],
                        categories: ['Men', 'Consumables'],
                        numberAvailable: 5
                    }]
                },
            }
        }

        this.markAsSwapped = this.markAsSwapped.bind(this);

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
                navigation.state.params.onGoBack(navigation.state.params.itemDetails);
            }
            } />,
        }
    }

    async componentDidMount() {
        const { state } = await this.props.navigation;
        this.setState({
            itemDetails: state.params.itemDetails,
        })
        await this.setUserData();
        // alert(JSON.stringify(this.state.itemDetails))
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    setUserData() {
        db.get('userData').then(data => {
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

    markAsSwapped = () => {
        let details = this.state.itemDetails
        const { swapped } = details

        const newDetails = {
            ...details,
            swapped: !swapped,
        }

        this.setState({
            itemDetails: newDetails
        })
    }



    renderItem = ({ item, index }) => {
        return (
            item.items.length > 1 ?
                <MultipleOfferItem
                    {...this.props}
                    offeredBy={item.offeredBy}
                    title={item.items[0].title}
                    timeAgo={item.timeAgo}
                    id={item.id}
                    items={item.items}
                />
                :
                <OfferItem
                    {...this.props}
                    offeredBy={item.offeredBy}
                    title={item.items[0].title}
                    timeAgo={item.timeAgo}
                    id={item.id}
                    items={item.items}
                />
        )
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
                {(this.state.selectedIndex == 0) ? (
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
                                    <View style={{ flex: 0.08 }}>
                                        <Icon name="check-circle"
                                            size={15}
                                            color={this.state.itemDetails.swapped ? '#40A459' : '#D6D8E0'}
                                            onPress={() => this.markAsSwapped()}
                                        />
                                    </View>
                                    <View style={{ flex: 0.7 }}>
                                        <Text style={{ fontSize: 8, bottom: 16, position: 'absolute', color: (this.state.itemDetails.swapped) ? '#40A459' : '#D6D8E0' }}>{this.state.itemDetails.swapped ? 'Marked as Swapped' : 'Mark as Swapped'}</Text>
                                    </View>
                                </View>

                                <View style={styles.stackedView}>
                                <View style={{ flex: 0.5 }}><Text style={{ fontSize: 12 }}>Offers: {this.state.itemDetails.offers?this.state.itemDetails.offers.length:0}</Text></View>
                                    <View style={{ flex: 0.5 }}><Text style={{ fontSize: 12 }}>Units: {this.state.itemDetails.numberAvailable}</Text></View>
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 15 }}>
                            <View style={{ flex: 0.3 }}>
                                <TouchableOpacity style={styles.offerButton}>
                                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#FF9D5C' }}>Edit Item</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 0.3 }}>
                                <TouchableOpacity style={styles.offerButton}><Text style={{ textAlign: 'center', fontSize: 12, color: '#FE3939' }}>Delete Item</Text></TouchableOpacity>
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
                ) : (
                        <FlatList
                            data={Object.values(this.state.offers)}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={{ paddingBottom: 50 }}
                        />
                    )}
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
