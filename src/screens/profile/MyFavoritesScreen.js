import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableHighlight, Modal, RefreshControl, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { SearchBar, CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import ExploreItem from '../../components/items/ExploreItem'
import demoImage from '../../assets/imgs/demo.png';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'
import tracking from '../../utils/geolocation/Tracking'


export default class MyFavoritesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      search: true,
      categories: [],
      activeCategories: {},
      activeCategoriesCount: 0,
      items: [],
      pageSize: 11,
      lastItemStamp: null,
      loading: false,
      loadingMore: false,
      loadedAll: false,
      isRefreshing: false,
      error: null,
      searchString: '',
      filterByLocation: false,
      filterByPrice: false,
      location: {
        latitude: null,
        longitude: null
      },
      modalVisible: false,
    }

    this.arrayholder = []

    this.like = this.like.bind(this);
    this.favorite = this.favorite.bind(this);
  }

  async componentDidMount() {
    // this.props.navigation.setParams({
    //   updateSearch: this.updateSearch,
    //   searchFilterFunction: this.searchFilterFunction,
    //   searchString: this.searchString,
    //   setModalVisible: this.setModalVisible,
    //   modalVisible: this.state.modalVisible,
    //   filterByPrice: this.state.filterByPrice,
    //   filterByLocation: this.state.filterByLocation
    // });
    this.setState({ loading: true })
    await this.setUserData()
    this.getItems();
  }




  getItems = () => {
    // this.setState({ loading: true })
    const { pageSize } = this.state;

    var data = {
      "uid": this.state.userData.uid,
      "pageSize": pageSize,
      "lastItemStamp": this.state.lastItemStamp
    }

    api.post('/items/getFavoriteItems', data).then((response) => {
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
      this.arrayholder = this.state.items
    }, err => {
      toast.show('Error')
      console.log(err);
      this.setState({ loading: false })
    })

  }



  async setUserData() {
    return await db.get('userData').then(data => {
      this.setState({
        userData: JSON.parse(data)
      })
    })
  }


  searchFilterFunction = text => {
    this.setState({
      searchString: text,
      loading: true
    })

    this.props.navigation.setParams({
      searchString: text
    })

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.title.toUpperCase()}   
        ${item.postedby.username.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      items: newData,
      loading: false
    });

  };


  static navigationOptions = ({ navigation }) => {
    return {
        headerStyle: {
            backgroundColor: '#FF9D5C',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
        },
        headerBackTitleVisible: false,
        headerTitle: () => <Text style={{ fontSize: 20 }}>My Favorites</Text>
    };
};


  like = (index, id) => {

    let newItems = [...this.state.items];

    newItems[index] = { ...newItems[index], liked: !newItems[index].liked };

    var likeData = {
      "uid": this.state.userData.uid,
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

  }

  refreshDetails = (data) => {
    let newItems = [...this.state.items];

    newItems[data.index] = data;

    this.setState({
      items: newItems
    })
  }

  favorite = (index, id) => {

    let newItems = [...this.state.items];

    newItems[index] = { ...newItems[index], favorited: !newItems[index].favorited };

    var favoriteData = {
      "uid": this.state.userData.uid,
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

  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  onRefresh=()=> {
    this.setState({
      items: [],
      pageSize: 11,
      lastItemStamp: null,
      loading: true,
      loadedAll: false
    },()=>{
      this.getItems();
    })
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


  renderItem = ({ item, index }) => {
    return (
      <ExploreItem
        {...this.props}
        favorite={this.favorite}
        like={this.like}
        refreshDetails={this.refreshDetails}
        onRefresh={this.onRefresh}
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
        distance = {item.distance}
      />
    )
  }

 

  reloadPage=()=>{
    this.setState({
      items: [],
      pageSize: 11,
      lastItemStamp: null,
      loading: true,
      loadedAll: false
    },()=>{
      this.getItems()
    })
  }

  render() {
    return (
      <View style={styles.container}>
                  <View style={{ backgroundColor: '#FF9D5C' }}>
          <SearchBar
            round
            lightTheme
            platform={'default'}
            placeholder="Search"
            onChangeText={text => this.searchFilterFunction(text)}
            value={this.state.searchString}
            containerStyle={{
              backgroundColor: '#FF9D5C',
              alignItems: "center",
              justifyContent: 'center',
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent'
            }}
            inputContainerStyle={{
              height: 30,
              alignSelf: 'center'
            }}
          />
        </View>
        {
          !(this.state.items && !this.state.loading) ?
            <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
              <ActivityIndicator />
            </View>
            :
            this.isEmpty(this.state.items) ?
            <View>
                <Text style={{ textAlign: 'center', fontSize: 13, color: 'lightgrey', margin: 20 }}>
                No Items to Display
              </Text>
              <TouchableOpacity onPress={()=>this.reloadPage()}>
              <Icon style={{textAlign:'center'}} name="rotate-right" size={20}/>
              </TouchableOpacity>
            </View>
              :
              <FlatList
                data={this.state.items}
                renderItem={this.renderItem}
                keyExtractor={item => item.id}
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
        }

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
    justifyContent: 'center'
  },
  bottomSpace: {
    paddingBottom: 50
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
  checkboxContainer:{
    backgroundColor: 'transparent',
     borderWidth: 0,
     padding:0,
     alignSelf:'flex-start'
  }

});