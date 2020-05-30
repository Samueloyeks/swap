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


export default class ExploreScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      search: true,
      categories: [],
      activeCategories: {},
      activeCategoriesCount: 0,
      items: [],
      loading: false,
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
    this.updateCategoryFilters = this.updateCategoryFilters.bind(this);
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      updateSearch: this.updateSearch,
      searchFilterFunction: this.searchFilterFunction,
      searchString: this.searchString,
      setModalVisible: this.setModalVisible,
      modalVisible: this.state.modalVisible,
      filterByPrice: this.state.filterByPrice,
      filterByLocation: this.state.filterByLocation
    });
    await this.setUserData()
    this.getCategories();
    // await this.getItems();
    this.getItems();
  }



  getCategories = () => {
    try {
      api.post('/categories/getCategories').then((response) => {
        this.setState({
          categories: response.data.data
        })
      }, err => {
        toast.show('Error')
        console.log(err);
        this.setState({ loading: false })
      })
    } catch (ex) {
      toast.show('Error')
      console.log(err);
      this.setState({ loading: false })
    }
  }

  // getItems = () => {
  //   this.setState({ loading: true })
  //   api.get('/items/getItems').then((response) => {
  //     this.setState({
  //       items: response.data.data,
  //       loading: false
  //     })
  //     this.arrayholder = response.data.data
  //   })
  // }

  getItems = () => {
    this.setState({ loading: true })

    var data = {
      "uid": this.state.userData.uid,
      "categories": this.state.activeCategories,
      "filterByLocation": this.state.filterByLocation ? true : false,
      "filterByPrice": this.state.filterByPrice ? true : false,
      "location": this.state.location
    }

    api.post('/items/getItemsByFilters', data).then((response) => {
      this.setState({
        items: response.data.data,
        loading: false
      })
      this.arrayholder = response.data.data
    }, err => {
      toast.show('Error')
      console.log(err);
      this.setState({ loading: false })
    })

  }

  async applyFilters() {
    this.setModalVisible(!this.state.modalVisible);
    this.setState({ loading: true })

    if(this.state.filterByLocation){
      await this.setCoordinates()
    }

    var data = {
      "uid": this.state.userData.uid,
      "categories": this.state.activeCategories,
      "filterByLocation": this.state.filterByLocation ? true : false,
      "filterByPrice": this.state.filterByPrice ? true : false,
      "location": this.state.location
    }


    api.post('/items/getItemsByFilters', data).then((response) => {
      this.setState({
        items: response.data.data,
        loading: false
      })
      this.arrayholder = response.data.data
    }, err => {
      toast.show('Error')
      console.log(err);
      this.setState({ loading: false })
    })

  }



  async setCoordinates() {
    await tracking.getLocation().then(data => {
      this.setState({
        location: {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude
        }
      })
    })
  }

  async setUserData() {
    return await db.get('userData').then(data => {
      this.setState({
        userData: JSON.parse(data)
      })
    })
  }

  updateSearch = () => {
    this.setState(prevState => ({
      search: !prevState.search
    }));

    this.props.navigation.setParams({
      search: this.state.search,
    });
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
    const screen = Dimensions.get("window");

    const { params = {} } = navigation.state;
    return {

      headerStyle: {
        backgroundColor: '#FFF',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerBackTitleVisible: false,
      headerTitle: () => (
        params.search ?
          <View
            style={{
              flex: 1,
              backgroundColor: Platform.OS === 'ios' ? '#FFF' : '',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 15,
              height: StatusBar.currentHeight,
              width: screen.width - 10
            }}
          >
            <SearchBar
              round
              lightTheme
              platform={'default'}
              placeholder="Search"
              onChangeText={text => params.searchFilterFunction(text)}
              value={params.searchString}
              containerStyle={{
                flex: 1,
                backgroundColor: 'transparent',
                width: 130,
                borderBottomColor: 'transparent',
              }}
            />
            <TouchableOpacity onPress={() => params.updateSearch()}><Text>Cancel</Text></TouchableOpacity>
          </View> :
          <View style={styles.header}><Text style={{ fontSize: 20 }}>Explore</Text></View>
      ),
      headerRight: () => (
        params.search ? null :
          (<TouchableOpacity style={{ paddingRight: 5 }} onPress={() => params.setModalVisible(!params.modalVisible)}>
            <Icon
              name="filter"
              color={(params.filterByLocation || params.filterByPrice) ? '#FF9D5C' : '#000'}
              size={24}
            />
          </TouchableOpacity>)
      ),
      headerLeft: () => (
        params.search ? null :
          (<TouchableOpacity style={{ paddingLeft: 5 }} onPress={() => params.updateSearch()}>
            <Icon
              name="search"
              color='#000'
              size={24}
            />
          </TouchableOpacity>)
      ),
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
    this.getItems();
  }

  handleLoadMore = () => {
    if (!this.state.loading) {
      this.page = this.page + 1; // increase page by 1
      this.getItems(this.page); // method for API call 
    }
  };

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.loading) return null;
    return (
      <ActivityIndicator
        style={{ color: '#000' }}
      />
    );
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });

    this.props.navigation.setParams({
      modalVisible: visible
    })
  }

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

  updateCategoryFilters = (id) => {
    let newActiveCategories = { ...this.state.activeCategories }


    if (newActiveCategories[id]) {
      delete newActiveCategories[id];

      this.setState({
        activeCategories: newActiveCategories,
        activeCategoriesCount: this.state.activeCategoriesCount - 1
      }, () => {
        this.getItems()
      })
    } else {
      newActiveCategories[id] = true;

      this.setState({
        activeCategories: newActiveCategories,
        activeCategoriesCount: this.state.activeCategoriesCount + 1
      }, () => {
        this.getItems()
      })
    }

  }

  render() {
    return (
      <View style={styles.container}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}

        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Filter by:</Text>

              <CheckBox
                center
                title='Location'
                checkedIcon='dot-circle-o'
                checkedColor="#FF9D5C"
                uncheckedIcon='circle-o'
                containerStyle={styles.checkboxContainer}
                checked={this.state.filterByLocation}
                onIconPress={() => {
                  this.setState({ filterByLocation: !this.state.filterByLocation })
                  this.props.navigation.setParams({
                    filterByLocation: !this.state.filterByLocation
                  })
                }}
              />

              <CheckBox
                center
                title='Price'
                checkedIcon='dot-circle-o'
                checkedColor="#FF9D5C"
                uncheckedIcon='circle-o'
                containerStyle={styles.checkboxContainer}
                checked={this.state.filterByPrice}
                onIconPress={() => {
                  this.setState({ filterByPrice: !this.state.filterByPrice })
                  this.props.navigation.setParams({
                    filterByPrice: !this.state.filterByPrice
                  })
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
                    this.applyFilters()
                  }}>
                  <Text style={styles.textStyle}>Done</Text>
                </TouchableHighlight>

              </View>
            </View>
          </View>
        </Modal>

        <Filters
          filters={this.state.categories}
          activeFiltersCount={this.state.activeCategoriesCount}
          activeFiltersMap={this.state.activeCategories}
          updateCategoryFilters={this.updateCategoryFilters}
        />

        {
          !(this.state.items && !this.state.loading) ?
            <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
              <ActivityIndicator />
            </View>
            :
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
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh.bind(this)}
                  />
                }
                ListFooterComponent={this.renderFooter.bind(this)}
                onEndReachedThreshold={0.4}
              // onEndReached={this.handleLoadMore.bind(this)}
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