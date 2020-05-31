import React from 'react';
import { StyleSheet, View, BackHandler, Alert, Text, RefreshControl, ActivityIndicator, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import MyItem from '../../components/items/MyItem'
import db from '../../utils/db/Storage'
import api from '../../utils/api/ApiService'
import toast from '../../utils/SimpleToast';
import SegmentedControlTab from "react-native-segmented-control-tab";
import demoImage from '../../assets/imgs/demo.png'
import demoImage2 from '../../assets/imgs/demo2.png'
import SwapItem from '../../components/items/SwapItem';
import CompletedSwapItem from '../../components/items/CompletedSwapItem';
import RatingModal from '../../components/RatingModal'







export default class SwapsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isImageViewVisible: true,
      selectedIndex: 0,
      isModalVisible: false,
      rateableSwap: null,
      userData: null,
      loading: false,
      isRefreshing: false,
      error: null,
      markingAsSwapped: false,
      swaps: []
    }

    this.markAsCompleted = this.markAsCompleted.bind(this)
    this.toggleModal = this.toggleModal.bind(this);
    this.submitRating = this.submitRating.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }


  async componentDidMount() {

    this.props.navigation.setParams({
      refreshDetails: this.refreshDetails
    });

    await this.setUserData();
    this.getSwaps();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }



  async setUserData() {
    return await db.get('userData').then(data => {
      this.setState({
        userData: JSON.parse(data)
      })
    })
  }


  getSwaps = () => {
    this.setState({ loading: true })

    var data = {
      "uid": this.state.userData.uid,
    }

    api.post('/items/getSwaps', data).then((response) => {

      this.setState({
        swaps: response.data.data,
        loading: false
      })

    })
  }

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  };

  static navigationOptions = ({ navigation }) => {
    const screen = Dimensions.get("window");

    const { state, setParams, navigate } = navigation;
    const params = state.params || {};


    (params.refresh) ? params.refreshDetails() : null

    return {
      headerStyle: {
        backgroundColor: '#FFF',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View
          style={{
            flex: 1,
            backgroundColor: Platform.OS === 'ios' ? '#FFF' : '',
            alignItems: 'center',
            flexDirection: 'column',
            paddingHorizontal: 15,
            height: StatusBar.currentHeight,
            width: screen.width - 10
          }}>
          <View style={styles.header}><Text style={{ fontSize: 20 }}>Swaps</Text></View>
        </View>
      ),
    };
  };

  markAsCompleted = id => {
    let item = this.state.swaps[id]
    const { completed } = item

    const newItem = {
      ...item,
      completed: !completed,
    }


    this.setState({
      swaps: {
        ...this.state.swaps,
        [id]: newItem
      }
    })
  }

  requestWithdrawConfirmation = (data) => {
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
          onPress: () => this.withdrawOffer(data)

        },

      ],
      { cancelable: false }
    );
  }

  withdrawOffer = (data) => {
    this.setState({ loading: true })

    api.post('/items/withdrawOffer', data).then((response) => {

      if (response.data.status == 'success') {
        this.getSwaps()
      } else {
        toast.show('Unable to withdraw offer')
      }

    }, error => {
      toast.show('Unable to withdraw offer')

    })

  }



  onRefresh = () => {
    this.getSwaps();
  }

  refreshDetails = (data) => {
    this.getSwaps()
  }

  renderItem = ({ item, index }) => {
    return (
      !item.completed ?
        <SwapItem
          {...this.props}
          withdrawOffer={this.requestWithdrawConfirmation}
          id={item.swapId}
          offered={item.offered}
          refreshDetails={this.refreshDetails}
          // swapDate={item.swapDate}
          completed={item.completed}
          item={item.item}


          onRefresh={this.onRefresh}
          userId={this.state.userData.uid}
          // images={item.item.images}
          postedby={item.postedby}
          offerId={item.offerId}
          swapId={item.swapId}
          // title={item.item.title}
          // price={item.item.price}
          // posted={item.item.posted}
          // liked={item.item.liked}
          // favorited={item.item.favorited}
          // id={item.item.id}
          index={index}
          // description={item.item.description}
          // preferences={item.item.preferences}
          // categories={item.item.categories}
          // numberAvailable={item.item.quantity}
          offerItems={item.offerItems}
        />
        :
        null
    )
  }

  renderCompletedItem = ({ item, index }) => {
    return (
      item.completed ?
        <CompletedSwapItem
          {...this.props}
          markAsCompleted={this.markAsCompleted}
          toggleModal={this.toggleModal}
          timeAgo={item.timeAgo}
          id={item.id}
          offered={item.offered}
          swapDate={item.swapDate}
          completed={item.completed}
          item={item.item}
          offerItems={item.offerItems}
          rating={item.rating}
        />
        :
        null
    )
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

  toggleModal = (swap) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      rateableSwap: swap
    });
  };

  submitRating = (reviewObject) => {
    let swap = this.state.swaps[reviewObject.id]

    const newSwap = {
      ...swap,
      rating: reviewObject.rating,
      review: reviewObject.review
    }

    this.setState({
      swaps: {
        ...this.state.swaps,
        [reviewObject.id]: newSwap
      },
    }, () => {
      this.setState({
        rateableSwap: newSwap
      })
      this.toggleModal(newSwap)
    })
  }

  reloadPage = () => {
    this.getSwaps()
  }

  render() {
    return (
      <View >

        <View style={{ backgroundColor: '#FFF', padding: 10 }}>
          <SegmentedControlTab
            values={["Pending", "Completed"]}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            borderRadius={50}
            tabTextStyle={{ color: 'black' }}
            activeTabStyle={{ backgroundColor: '#FF9D5C' }}
            tabStyle={{ borderColor: 'black' }}
          />
        </View>

        {
          (this.state.loading || !this.state.userData) ?
            <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
              <ActivityIndicator />
            </View>
            :
            (this.state.selectedIndex == 0) ? (
              this.state.swaps.length == 0 ?
                <View>
                  <Text style={{ textAlign: 'center', fontSize: 13, color: 'lightgrey', margin: 20 }}>
                    No Swaps to Display
                 </Text>
                  <TouchableOpacity onPress={() => this.reloadPage()}>
                    <Icon style={{ textAlign: 'center' }} name="rotate-right" size={20} />
                  </TouchableOpacity>
                </View>
                :
                <FlatList
                  data={this.state.swaps}
                  renderItem={this.renderItem}
                  keyExtractor={item => item.swapId}
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
            ) : (
                this.state.swaps.length == 0 ?
                  <View>
                    <Text style={{ textAlign: 'center', fontSize: 13, color: 'lightgrey', margin: 20 }}>
                      No Swaps to Display
                  </Text>
                    <TouchableOpacity onPress={() => this.reloadPage()}>
                      <Icon style={{ textAlign: 'center' }} name="rotate-right" size={20} />
                    </TouchableOpacity>
                  </View>
                  :
                  <View>
                    <RatingModal
                      isVisible={this.state.isModalVisible}
                      toggleModal={this.toggleModal}
                      swap={this.state.rateableSwap}
                      rating={this.state.rateableSwap ? this.state.rateableSwap.rating : null}
                      review={this.state.rateableSwap ? this.state.rateableSwap.review : null}
                      submitRating={this.submitRating}
                    />
                    <FlatList
                      data={this.state.swaps}
                      renderItem={this.renderCompletedItem}
                      keyExtractor={item => item.swapId}
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
                  </View>
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
