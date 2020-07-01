
import React, { Component } from 'react';
import { StyleSheet, View, Modal, TouchableHighlight, Alert, ActivityIndicator, RefreshControl, FlatList, SafeAreaView, ListView, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, BackHandler, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeaderBackButton } from 'react-navigation-stack';
import { SearchBar, CheckBox } from 'react-native-elements'
import ImageModal from 'react-native-image-modal';
import demoAvatar from '../../assets/imgs/demoAvatar.png'
import UserItem from '../../components/items/UserItem'
import demoImage from '../../assets/imgs/demo.png'
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'
import { EventRegister } from 'react-native-event-listeners'
import { Linking } from 'react-native'



let allReports = [
  { id: 1, report: 'False Advertisement' },
  { id: 2, report: 'Fraud' },
  { id: 3, report: 'Violence or Theft' },
  { id: 4, report: 'Others' }
]



export default class UserProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      uid: '',
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      profilePicture: null,
      isFocused: false,
      likes: 0,
      rating: 0,
      explorePageIndex: null,
      swapsCompleted: 0,
      modalVisible: false,
      reports: {},
      items: [],
      pageSize: 11,
      lastItemStamp: null,
      loading: false,
      loadingMore: false,
      loadedAll: false,
      isRefreshing: false,
      error: null,
    }

    this.like = this.like.bind(this);
    this.favorite = this.favorite.bind(this);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.setUserData = this.setUserData.bind(this);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    this.props.navigation.state.params.onGoBack();
    return true;
  }


  async componentDidMount() {
    const { state } = await this.props.navigation;

    // console.log(state.params.userData)
    let userId = await state.params.userId
    let explorePageIndex = await state.params.explorePageIndex
    this.setState({ explorePageIndex })

    await this.setUserData(userId);


    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  async setUserData(userId) {
    this.setState({ loading: true })

    let data = {
      uid: userId
    }

    api.post('/users/fetchUserById', data).then((response) => {
      if (response.data.status == "success") {

        // console.log(response.data.data);

        this.setState({
          loading: false,
          userData: response.data.data,
          uid: response.data.data.uid,
          fullName: response.data.data.fullName,
          username: response.data.data.username,
          phoneNumber: response.data.data.phoneNumber,
          email: response.data.data.email,
          profilePicture: (response.data.data.profilePicture == undefined ? null : response.data.data.profilePicture),
          likes: response.data.data.likes,
          swapsCompleted: response.data.data.swapsCompleted,
          rating: response.data.data.rating
        }, () => {
          this.getItems();
        })

      } else {
        toast.show('Error getting user')
      }
    })
  }

  getItems = async () => {
    await db.get('userData').then(data => {
      const { pageSize } = this.state;
      let userData = JSON.parse(data)
      let uid = userData.uid

      var data = {
        "uid": uid,
        "posterId": this.state.uid,
        "pageSize": pageSize,
        "lastItemStamp": this.state.lastItemStamp
      }

      api.post('/items/getUserItemsByUid', data).then((response) => {
        let items = response.data.data;

        if (!response.data.variable) {
          this.setState({
            items: [...this.state.items, ...items],
            loading: false,
            loadingMore: false,
            loadedAll: true,
            lastItemStamp: null
          })
          return;
        }

        let lastItemStamp

        if (response.data.variable) {
          lastItemStamp = response.data.variable
        }


        this.setState({
          items: [...this.state.items, ...items],
          loading: false,
          loadingMore: false,
          lastItemStamp: lastItemStamp
        })
      }, err => {
        toast.show('Error getting items')
        console.log(err);
      })
    })

  }



  static navigationOptions = ({ navigation }) => {
    const screen = Dimensions.get("window");

    return {
      title: `${navigation.state.params.username}`,
      headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
      headerStyle: {
        backgroundColor: '#FF9D5C',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerBackTitleVisible: false,
      headerLeft: () => <HeaderBackButton onPress={() => {
        navigation.goBack(null);
        navigation.state.params.onGoBack();
      }
      } />,
    };
  };


  requestCallConfirmation = () => {
    if (!this.state.phoneNumber) {
      alert(`${this.state.username} does not have a contact number`);
      return;
    }
    Alert.alert(
      `Call ${this.state.username}?`,
      "Are you sure you want make this call?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => this.callNumber(this.state.phoneNumber)

        },

      ],
      { cancelable: false }
    );
  }

  callNumber = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    }
    else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  updateReportFilters = (id) => {
    let newReports = { ...this.state.reports }


    if (newReports[id]) {
      delete newReports[id];

      this.setState({
        reports: newReports,
      })

    } else {
      newReports[id] = true;

      this.setState({
        reports: newReports,
      })
    }

  }

  async reportUser() {
    this.setModalVisible(!this.state.modalVisible);
    // this.setState({ loading: true })

    let reports = []

    allReports.map(report => {
      if (this.state.reports[report.id]) {
        reports.push(report)
      }
    })

    await db.get('userData').then(data => {
      let userData = JSON.parse(data)
      let reportedby = userData.uid


      var data = {
        "offender": this.state.uid,
        "reports": reports,
        "reportedby": reportedby
      }

      api.post('/users/reportUser', data).then((response) => {

        if (response.data.status == "success") {
          toast.show('Report submitted')
        } else {
          toast.show('Error submitting report')
        }

        this.setState({
          reports: {}
        })
      })
    })


  }

  like = async (index, id) => {

    let newItems = [...this.state.items];

    newItems[index] = { ...newItems[index], liked: !newItems[index].liked };

    await db.get('userData').then(data => {
      let userData = JSON.parse(data)
      let likerId = userData.uid

      var likeData = {
        "uid": likerId,
        "itemId": id
      }

      this.setState({
        items: newItems
      }, () => {

        if (this.state.items[index].liked) {
          api.post('/items/likeItem', likeData)
        } else {
          api.post('/items/unlikeItem', likeData)
        }
      })
    })


  }

  refreshDetails = (data) => {
    let newItems = [...this.state.items];

    newItems[data.index] = data;

    this.setState({
      items: newItems
    })
  }

  favorite = async (index, id) => {

    let newItems = [...this.state.items];

    newItems[index] = { ...newItems[index], favorited: !newItems[index].favorited };

    await db.get('userData').then(data => {
      let userData = JSON.parse(data)
      let favoriterId = userData.uid

      var favoriteData = {
        "uid": favoriterId,
        "itemId": id
      }

      this.setState({
        items: newItems
      }, () => {

        if (this.state.items[index].favorited) {
          api.post('/items/favoriteItem', favoriteData)
        } else {
          api.post('/items/unfavoriteItem', favoriteData)
        }
      })
    })

  }

  renderItem = ({ item, index }) => {
    return (
      <UserItem
        {...this.props}
        favorite={this.favorite}
        like={this.like}
        refreshDetails={this.refreshDetails}
        images={item.images}
        postedby={item.postedby}
        userId={this.state.userData.uid}
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
        distance={item.distance}
      />
    )
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
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
          this.getItems();
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

  render() {
    return (
      this.state.loading ?
        <View style={{ padding: 20 }}>
          <ActivityIndicator size="large" />
        </View>
        :
        <View style={{ flex: 1 }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}

          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Reprt for:</Text>

                <CheckBox
                  center
                  title='False Advertisement'
                  checkedIcon='dot-circle-o'
                  checkedColor="#FF9D5C"
                  uncheckedIcon='circle-o'
                  containerStyle={styles.checkboxContainer}
                  checked={this.state.reports[1]}
                  onIconPress={() => {
                    this.updateReportFilters(1)
                  }}
                />

                <CheckBox
                  center
                  title='Fraud'
                  checkedIcon='dot-circle-o'
                  checkedColor="#FF9D5C"
                  uncheckedIcon='circle-o'
                  containerStyle={styles.checkboxContainer}
                  checked={this.state.reports[2]}
                  onIconPress={() => {
                    this.updateReportFilters(2)
                  }}
                />

                <CheckBox
                  center
                  title='Violence or Theft'
                  checkedIcon='dot-circle-o'
                  checkedColor="#FF9D5C"
                  uncheckedIcon='circle-o'
                  containerStyle={styles.checkboxContainer}
                  checked={this.state.reports[3]}
                  onIconPress={() => {
                    this.updateReportFilters(3)
                  }}
                />

                <CheckBox
                  center
                  title='Others'
                  checkedIcon='dot-circle-o'
                  checkedColor="#FF9D5C"
                  uncheckedIcon='circle-o'
                  containerStyle={styles.checkboxContainer}
                  checked={this.state.reports[4]}
                  onIconPress={() => {
                    this.updateReportFilters(4)
                  }}
                />


                <View style={{ flexDirection: 'row' }}>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#000000" }}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#000000" }}
                    onPress={() => {
                      this.reportUser()
                    }}>
                    <Text style={styles.textStyle}>Report</Text>
                  </TouchableHighlight>

                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.coloredHeader}>
            <View style={styles.avatarContainer}>
              <ImageModal
                swipeToDismiss={true}
                resizeMode='cover'
                source={this.state.profilePicture ? ({ uri: this.state.profilePicture }) : demoAvatar}
                style={styles.avatar}
              />
            </View> 
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Text>{this.state.username}</Text>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, flexDirection: 'row' }}>
            <TouchableOpacity style={styles.contactButton} onPress={() => this.requestCallConfirmation()}>
              <Text style={{ textAlign: 'center', fontSize: 15, color: '#FF9D5C' }}>Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reportButton} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <Text style={{ textAlign: 'center', fontSize: 15, color: '#FF9D5C' }}>Report</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <View style={{ paddingHorizontal: 25, borderRightWidth: 1, borderRightColor: '#C4C4C4' }}>
              <Icon name="star" size={40} color="#FF9D5C" />
              <Text style={{ textAlign: 'center' }}>{this.state.rating}</Text>
            </View>
            <View style={{ paddingHorizontal: 25 }}>
              <Icon name="swap-horizontal" size={40} color="#FF9D5C" />
              <Text style={{ textAlign: 'center' }}>{this.state.swapsCompleted}</Text>
            </View>
            <View style={{ paddingHorizontal: 25, borderLeftWidth: 1, borderLeftColor: '#C4C4C4' }}>
              <Icon name="heart" size={40} color="#FF9D5C" />
              <Text style={{ textAlign: 'center' }}>{this.state.likes}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20 }}><Text style={{ fontSize: 20 }}>Items</Text></View>
          <View >

            {
              this.isEmpty(this.state.items) ?
                <Text style={{ textAlign: 'center', fontSize: 13, color: 'lightgrey', margin: 20 }}>
                  No Items to Display
                      </Text>
                :
                <FlatList
                  data={this.state.items}
                  renderItem={this.renderItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={{ paddingBottom: 50 }}
                  extraData={this.state}
                  ListFooterComponent={this.renderFooter.bind(this)}
                  onEndReachedThreshold={0.6}
                  onEndReached={(!this.state.loadingMore) ? this.handleLoadMore.bind(this) : null}
                />
            }
                        <View style={{ height: 50 }}>

</View>
          </View>


        </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  coloredHeader: {
    backgroundColor: '#FF9D5C',
    alignItems: 'center',
  },
  avatarContainer: {
    overflow: 'hidden',
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
    height: 130,
    width: 130,
    backgroundColor: 'grey',
  },
  avatar: {
    height: 130,
    width: 130,
  },
  contactButton: {
    borderWidth: 0.6,
    backgroundColor: "transparent",
    width: 95,
    borderRadius: 20,
    borderColor: "black",
    padding: 2,
    marginHorizontal: 5
  },
  reportButton: {
    borderWidth: 0.6,
    backgroundColor: "#363636",
    width: 95,
    borderRadius: 20,
    borderColor: "black",
    padding: 2,
    marginHorizontal: 5
  },
  iconContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
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
  openButton: {
    backgroundColor: "#000000",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10
  },
  textStyle: {
    color: "#FF9D5C",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    alignSelf: 'flex-start'
  }
})