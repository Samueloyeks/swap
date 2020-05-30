import React, { Component } from 'react';
import { StyleSheet, View, Button, FlatList, Text, StatusBar, Platform, Dimensions, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import ImageSlide from '../../components/ImageSlide'
import SegmentedControlTab from "react-native-segmented-control-tab";
import demoImage from '../../assets/imgs/demo.png'
import demoImage2 from '../../assets/imgs/demo2.png'
import SwapItem from '../../components/items/SwapItem';
import CompletedSwapItem from '../../components/items/CompletedSwapItem';
import RatingModal from '../../components/RatingModal'




 


export default class SwapsScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isImageViewVisible: true,
      selectedIndex: 0,
      isModalVisible: false,
      rateableSwap: null,
      swaps: {
        "1": {
          id: 1,
          timeAgo: "2 days",
          offered: '24th November 2019',
          status: "pending",
          rating: null,
          completed: true,
          swapDate: '12th January 2020',
          review: '',
          item: {
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
            numberAvailable: 2
          },
          offerItems: [{
            id: 1,
            title: 'New Nike Shirt',
            postedOn: '15th November 2019',
            price: '$20',
            likes: 20,
            images: [demoImage, demoImage, demoImage, demoImage],
            swapped: false,
            description:
              'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
            preferences: ['New Watch', 'Black Snapback', 'A date'],
            categories: ['Men', 'Fashion', 'Footwear'],
            numberAvailable: 2,
            likeCount: 5
          }, {
            id: 1,
            title: 'New Nike Shoes',
            postedOn: '15th November 2019',
            price: '$20',
            likes: 20,
            images: [demoImage2, demoImage, demoImage, demoImage],
            swapped: false,
            description:
              'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
            preferences: ['New Watch', 'Black Snapback', 'A date'],
            categories: ['Men', 'Fashion', 'Footwear'],
            numberAvailable: 2,
            likeCount: 5
          }]

        },
        "2": {
          id: 2,
          timeAgo: "5 days",
          offered: '24th November 2019',
          status: "pending",
          rating: null,
          completed: false,
          swapDate: null,
          review: '',
          item: {
            id: 1,
            title: 'New Nike Shoes',
            postedby: 'seyi248',
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
          },
          offerItems: [{
            id: 1,
            title: 'New Nike Shoes',
            postedOn: '15th November 2019',
            price: '$20',
            likes: 20,
            images: [demoImage, demoImage, demoImage, demoImage],
            swapped: false,
            description:
              'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
            preferences: ['New Watch', 'Black Snapback', 'A date'],
            categories: ['Men', 'Fashion', 'Footwear'],
            numberAvailable: 2,
            likeCount: 5
          }]

        },
      }
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
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  };

  static navigationOptions = ({ navigation }) => {
    const screen = Dimensions.get("window");

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

  renderItem = ({ item, index }) => {
    return (
      !item.completed ?
        <SwapItem
          {...this.props}
          markAsCompleted={this.markAsCompleted}
          timeAgo={item.timeAgo}
          id={item.id}
          offered={item.offered}
          swapDate={item.swapDate}
          completed={item.completed}
          item={item.item}
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
        {(this.state.selectedIndex == 0) ? (
          <FlatList
            data={Object.values(this.state.swaps)}
            renderItem={this.renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        ) : (
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
                data={Object.values(this.state.swaps)}
                renderItem={this.renderCompletedItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 50 }}
              />
            </View>
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
