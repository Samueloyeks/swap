import React, { Component } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, ListView, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, BackHandler, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeaderBackButton } from 'react-navigation-stack';
import ImageModal from 'react-native-image-modal';
import ImageSlide from '../../components/ImageSlide'
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'







export default class ExploreItemDetailsScreen extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      itemDetails: {},
      isImageViewVisible: true,
      userData:null
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
    const screen = Dimensions.get("window");

    const { params = {} } = navigation.state;
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
    // console.log(JSON.stringify(this.state.itemDetails))
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  setUserData() {
    db.get('userData').then(data => {
      this.setState({
        userData: JSON.parse(data)
      })
    })
  }

  like = () => {
    let details = this.state.itemDetails
    const { liked, likeCount } = details

    var likeData = {
      "uid": this.state.userData.uid,
      "itemId": this.state.itemDetails.id
    }

    const newDetails = {
      ...details,
      liked: !liked,
      likeCount: liked ? likeCount - 1 : likeCount + 1
    }

    this.setState({
      itemDetails: newDetails
    }, () => {

      this.props.navigation.setParams({
        itemDetails: this.state.itemDetails,
      });

      if (this.state.itemDetails.liked) {
        api.post('/items/likeItem', likeData)
      } else {
        api.post('/items/unlikeItem', likeData)
      }
    })
  }

  favorite = () => {
    let details = this.state.itemDetails
    const { favorited } = details

    var favoriteData = {
      "uid": this.state.userData.uid,
      "itemId": this.state.itemDetails.id
    }

    const newDetails = {
      ...details,
      favorited: !favorited,
    }

    this.setState({
      itemDetails: newDetails
    }, () => {

      this.props.navigation.setParams({
        itemDetails: this.state.itemDetails,
      });

      if (this.state.itemDetails.favorited) {
        api.post('/items/favoriteItem', favoriteData)
      } else {
        api.post('/items/unfavoriteItem', favoriteData)
      }
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                this.state.itemDetails.postedby ?
                  <View style={styles.stackedView}>
                    <View ><Text style={{ fontSize: 12 }}>Posted By</Text></View>
                    <View >
                      <TouchableOpacity>
                        <Text style={{ fontSize: 12, color: '#FF9D5C', paddingLeft: 5 }}>
                          {this.state.itemDetails.postedby.username}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View> : null
              }

              <TimeAgo time={this.state.itemDetails.posted} interval={20000} style={{ fontSize: 10, color: '#808080' }} />


              <View style={styles.stackedViewPadded}>
                <View style={{ flex: 0.33 }}>
                  <Icon
                    key={this.state.itemDetails.id}
                    name="heart-circle"
                    size={15}
                    color={this.state.itemDetails.liked ? '#FF9D5C' : '#D6D8E0'}
                    onPress={() => this.like()} />
                </View>
                <View style={{ flex: 0.33 }}>
                  <Icon
                    key={this.state.itemDetails.id}
                    name="star"
                    size={15}
                    color={this.state.itemDetails.favorited ? '#FFC107' : '#D6D8E0'}
                    onPress={() => this.favorite()} />
                </View>
                <View style={{ flex: 0.33 }}>
                  <TouchableOpacity>
                    <Icon
                      key={this.state.itemDetails.id}
                      name="message"
                      size={20}
                      color={'#FFC107'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {
                !(this.state.itemDetails.posted && this.state.userData) ?
                  null
                  :
                  !(this.state.itemDetails.postedby.uid == this.state.userData.uid) ?
                    <View style={styles.stackedView}>
                      <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('SelectItemsScreen')}>
                        <Text style={styles.buttonText}>Make Offer</Text>
                      </TouchableOpacity>
                    </View> :
                    null
              }
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

          <Text style={{ fontSize: 14, color: '#545F71', marginVertical: 10 }}>Number Available: {this.state.itemDetails.numberAvailable}</Text>


          {
            this.state.itemDetails.images ?
              <View>
                <Text style={{ fontSize: 14, color: '#545F71' }}>More Images:</Text>
                <View style={{ flex: 1, flexDirection: 'row' }}>

                  <FlatList
                    horizontal={true}
                    data={this.state.itemDetails.images.slice(1)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                      <View style={{ color: 'red', width: 112, margin: 10, borderRadius: 5, overflow: 'hidden' }}>
                        <ImageSlide
                          image={item} />
                      </View>}
                  />

                </View>
              </View> : null
          }

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
          <View style={{ height: 50 }}>

          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  stackedView: {
    flex: 0.25,
    flexDirection: 'row'
  },
  stackedViewPadded: {
    flex: 0.25,
    paddingTop: 7,
    paddingBottom: 7,
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
