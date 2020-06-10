import React from 'react';
import { StyleSheet, View, Text, Image, RefreshControl, ActivityIndicator, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import SelectItem from '../../components/items/SelectItem'
import demoImage from '../../assets/imgs/demo.png'
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'



export default class SelectItemsScreen extends React.Component {

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
      offerItems: {},
      item: null
    }

    this.arrayholder = []


    this.markAsOffered = this.markAsOffered.bind(this);
  }


  async componentDidMount() {
    const { state } = await this.props.navigation;
    this.setState({
      item: state.params.item,
    })

    this.setState({ loading: true })
    await this.setUserData();
    this.getItemsByUid();
  }

  async setUserData() {
    return await db.get('userData').then(data => {
      this.setState({
        userData: JSON.parse(data)
      })
    })
  }

  getItemsByUid = () => {
    // this.setState({ loading: true })
    const { pageSize } = this.state;

    var data = {
      "uid": this.state.userData.uid,
      "pageSize": pageSize,
      "lastItemStamp": this.state.lastItemStamp
    }

    api.post('/items/getItemsByUid', data).then((response) => {
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

  searchFilterFunction = text => {
    this.setState({
      searchString: text,
      loading: true
    })

    // let data = {searchString:text}

    // api.post('/items/getItemsBySearch',data).then((response)=>{
    //   console.log(data)
    //   console.log(response.data.data)
    //   this.setState({ 
    //     items: response.data.data,
    //     loading:false
    //   });  
    // })

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.title.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      items: newData,
      loading: false
    });
  };

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  onRefresh() {
    this.setState({
      items: [],
      pageSize: 11,
      lastItemStamp: null,
      loading: true,
      loadedAll: false
    })
    this.getItemsByUid();
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
          this.getItemsByUid();
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


  refreshDetails = (data) => {
    let newItems = [...this.state.items];

    newItems[data.index] = data;

    this.setState({
      items: newItems
    })
  }


  static navigationOptions = ({ navigation }) => {
    const screen = Dimensions.get("window");

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
          <View style={styles.header}><Text style={{ fontSize: 20 }}>Select Item(s) to offer</Text></View>
        </View>
      ),
    };
  };

  markAsOffered = (index, id) => {

    let newOfferItems = { ...this.state.offerItems }


    if (newOfferItems[id]) {
      delete newOfferItems[id];

      this.setState({
        offerItems: newOfferItems,
      })
    } else {
      newOfferItems[id] = true;

      this.setState({
        offerItems: newOfferItems,
      })
    }

  }

  navigateToConfirm() {
    if (this.isEmpty(this.state.offerItems)) {
      toast.show('Please select at least 1 item')
    } else {
      let offerItems = [];
      for (let i = 0; i < this.state.items.length; i++) {
        if (this.state.offerItems[this.state.items[i].id]) {
          offerItems.push(this.state.items[i])
        }
      }

      this.props.navigation.navigate('ConfirmOfferScreen', { offerItems: offerItems, item: this.state.item })
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <SelectItem
        {...this.props}
        markAsOffered={this.markAsOffered}
        offerItems={this.state.offerItems}
        refreshDetails={this.refreshDetails}
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
        swapped={item.swapped}
        likes={item.likes}
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
    })
    this.getItemsByUid()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: 'transparent', flexDirection: 'row' }}>
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
              borderTopColor: 'transparent',
              flex: 0.8
            }}
            inputContainerStyle={{
              height: 30,
              alignSelf: 'center',
            }}
          />
          <View style={{ flex: 0.2, backgroundColor: '#FF9D5C', }}>
            <TouchableOpacity onPress={() => this.navigateToConfirm()}>
              <Text style={styles.headerButton}>Done</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    flex: 1,

  },
  bottomSpace: {
    marginBottom: 50
  },
  headerButton: {
    // fontSize:15,
    alignSelf: 'flex-end',
    padding: 10,
    textAlignVertical: 'center'
  }

});