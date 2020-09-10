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
      rateableSwapIndex: null,
      userData: null,
      markingAsSwapped: false,
      swaps: [],
      pageSize: 11,
      lastSwapStamp: null,
      loading: false,
      loadingMore: false,
      loadedAll: false,
      isRefreshing: false,
      error: null,
      silentlyGettingSwaps: false,
      scrollEnabled: true,
    }

    this.markAsCompleted = this.markAsCompleted.bind(this)
    this.toggleModal = this.toggleModal.bind(this);
    this.submitRating = this.submitRating.bind(this)
  }



  async componentDidMount() {

    // const { state } = await this.props.navigation;
    // this.setState({
    //   selectedIndex: state.params.selectedIndex ? state.params.selectedIndex : 0,
    // })


    await this.props.navigation.setParams({
      refreshDetails: this.refreshDetails,
      changeIndex: this.changeIndex
    });

    this.setState({ loading: true })
    await this.setUserData();
    this.getAllSwaps();

    this.updateList = setInterval(() => {
      if (!this.state.silentlyGettingSwaps) {
        this.setState({
          silentlyGettingSwaps: true
        }, () => {
          this.silentlyGetAllSwaps()
        })
      }
    }, 60000);

  }

  componentWillUnmount() {
    clearInterval(this.updateList);
  }


  async setUserData() {
    return await db.get('userData').then(data => {
      this.setState({
        userData: JSON.parse(data)
      })
    })
  }


  getAllSwaps = () => {
    if (this.state.userData) {
      const { pageSize } = this.state;


      var data = {
        "uid": this.state.userData.uid,
        "pageSize": pageSize,
        "lastSwapStamp": this.state.lastSwapStamp
      }

      api.post('/items/getAllSwaps', data).then((response) => {
        let swaps = response.data.data;
        
        if (!response.data.variable) {
          this.setState({
            swaps: [...this.state.swaps, ...swaps],
            loading: false,
            loadingMore: false,
            loadedAll: true,
            lastSwapStamp: null
          })
          return;
        }
  
        let lastSwapStamp
    
        if (response.data.variable) {
          lastSwapStamp = response.data.variable
        } 
  
  
        this.setState({
          swaps: [...this.state.swaps, ...swaps],
          loading: false,
          loadingMore: false,
          lastSwapStamp: lastSwapStamp
        })
  
      }, err => {
        toast.show('Error')
        this.setState({ loading: false })
      })

    }
  }

  silentlyGetAllSwaps = () => { 
    if (this.state.swaps.length !== 0) {
      // this.setState({ loading: true })
      const { pageSize } = this.state;

      var data = {
        "uid": this.state.userData.uid,
        "pageSize": pageSize,
        "lastItemStamp": this.state.swaps[0]['timestamp']
      }


      api.post('/items/silentlyGetAllSwaps', data).then((response) => {
        let swaps = response.data.data;

        this.setState({
          scrollEnabled: false,
          items: [...swaps, ...this.state.swaps],
          silentlyGettingSwaps: false,
        }, () => {
          this.setState({
            scrollEnabled: true
          })
        })
        this.arrayholder = this.state.swaps

      })
    }
  }

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  };


  static navigationOptions = ({ navigation }) => {
    const screen = Dimensions.get("window");

    const { params = {} } = navigation.state;


    (params.refresh && params.refreshDetails) ? params.refreshDetails() : null;

    (params.tabOne && params.changeIndex) ? params.changeIndex('one') : null;

    (params.tabTwo && params.changeIndex) ? params.changeIndex('two') : null;



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
    // this.setState({ loading: true })

    const newSwaps = this.state.swaps.filter((item, arrIndex) =>
      arrIndex !== data.index
    );

    this.setState({ swaps: newSwaps }, () => {

      api.post('/items/withdrawOffer', data).then((response) => {

        if (response.data.status == 'success') {
          toast.show('Offer Withdrawn')

        } else {
          this.getAllSwaps()
          toast.show('Unable to withdraw offer')
        }

      }, error => {
        this.getAllSwaps()
        toast.show('Unable to withdraw offer')
      })
    })

  }



  onRefresh = () => {
    this.setState({
      swaps: [],
      pageSize: 11,
      lastSwapStamp: null,
      loading: true,
      loadedAll: false
    },()=>{
      this.getAllSwaps();
    })
  }

  refreshDetails = () => {
    if(!this.state.loading){
      this.setState({
        swaps: [],
        pageSize: 11,
        lastSwapStamp: null,
        loading: true,
        loadedAll: false
      },()=>{
        this.getAllSwaps();
      })
    }
  }

  changeIndex = (index) => {
    this.setState({ selectedIndex: (index == 'one') ? 0 : 1 })
  }

  renderItem = ({ item, index }) => {
    return (
      item.offeredby.uid == this.state.userData.uid?
      <SwapItem
        {...this.props}
        withdrawOffer={this.requestWithdrawConfirmation}
        refreshDetails={this.refreshDetails}
        onRefresh={this.onRefresh}
        userId={this.state.userData.uid}
        id={item.swapId}
        offered={item.offered}
        completed={item.completed}
        item={item.item}
        postedby={item.postedby}
        offerId={item.offerId}
        swapId={item.swapId}
        index={index}
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
          toggleModal={this.toggleModal}
          userId={this.state.userData.uid}
          onRefresh={this.onRefresh}
          swapped={item.swapped}
          rating={item.rating}
          id={item.swapId}
          offered={item.offered}
          completed={item.completed}
          item={item.item}
          postedby={item.postedby}
          offeredby={item.offeredby}
          offerId={item.offerId}
          swapId={item.swapId}
          index={index}
          offerItems={item.offerItems}
        />
        :
        null
    )
  }


  handleLoadMore = () => {
    if (this.state.loadedAll) {
      return;
    } else {
      this.setState(
        (prevState, nextProps) => ({
          pageSize: 10,
          loadingMore: true
        }),
        () => {
          this.getAllSwaps();
        }
      );
    }
  };

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.loadingMore) return null;
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
    // let swap = this.state.swaps[reviewObject.index]

    let newSwaps = [...this.state.swaps];
    newSwaps[reviewObject.index] = { ...newSwaps[reviewObject.index], rating: reviewObject.rating };

    this.setState({
      swaps: newSwaps
    }, () => {
      this.setState({
        rateableSwap: newSwaps[reviewObject.index]
      })
      this.toggleModal(newSwaps[reviewObject.index])

      let data = reviewObject
      data.uid = (data.postedby==this.state.userData.uid)?data.offeredby:data.postedby;

      api.post('/items/rateSwap', data).then((response) => {

        if (response.data.status == 'success') {
          toast.show('Thank you')
        }
      })

    })

  }

  reloadPage = () => {
    this.setState({
      swaps: [],
      pageSize: 11,
      lastSwapStamp: null,
      loading: true,
      loadedAll: false
    },()=>{
      this.getAllSwaps()
    })
  }

  render() {
    return (
      <View >

        <View style={{ backgroundColor: '#FFF', padding: 10 }}>
          <SegmentedControlTab
            values={["All Swaps", "Completed"]}
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
                  onEndReachedThreshold={0.6}
                  onEndReached={(!this.state.loadingMore) ? this.handleLoadMore.bind(this) : null}
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
                      onEndReachedThreshold={0.6}
                      onEndReached={(!this.state.loadingMore) ? this.handleLoadMore.bind(this) : null}
                      scrollEnabled={this.state.scrollEnabled}
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
