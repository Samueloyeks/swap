import React from 'react';
import { StyleSheet, View, Text, RefreshControl, ActivityIndicator, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import MyItem from '../../components/items/MyItem'
import demoImage from '../../assets/imgs/demo.png'
import db from '../../utils/db/Storage'
import api from '../../utils/api/ApiService'



export default class ItemsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      search: true,
      items: [],
      loading: false,
      isRefreshing: false,
      error: null,
      searchString: '',
    }
    this.arrayholder = []

    this.markAsSwapped = this.markAsSwapped.bind(this);

  }

  async componentDidMount() {
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
    this.setState({ loading: true })
    var data = {
      "uid": this.state.userData.uid,
    }

    api.post('/items/getItemsByUid', data).then((response) => {
      this.setState({
        items: response.data.data,
        loading: false
      })
      this.arrayholder = response.data.data
    })
  }

  searchFilterFunction = text => {
    this.setState({
      searchString: text,
      loading: true
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

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  onRefresh() {
    this.getItemsByUid();
  }

  handleLoadMore = () => {
    if (!this.state.loading) {
      this.page = this.page + 1; // increase page by 1
      this.getItemsByUid(this.page); // method for API call 
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


  refreshDetails = (data) => { 
    this.getItemsByUid()
  }

  deleteItem = (index, id) => {

    const newItems = this.state.items.filter((item, arrIndex) =>
    arrIndex !== index
    );
    this.setState({ items: newItems },()=>{
      var data = {
        "itemId": id
      }
  
      api.post('/items/deleteItem', data)
    });

  }

  

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
          <View style={styles.header}><Text style={{ fontSize: 20 }}>My Items</Text></View>
        </View>
      ),
    };
  };

  markAsSwapped = id => {
    let item = this.state.items[id]
    const { swapped } = item

    const newItem = {
      ...item,
      swapped: !swapped,
    }

    this.setState({
      items: {
        ...this.state.items,
        [id]: newItem
      }
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <MyItem
        {...this.props}
        markAsSwapped={this.markAsSwapped}
        refreshDetails={this.refreshDetails}
        deleteItem={this.deleteItem}
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

  render() {
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: 'transparent' }}>
          <SearchBar
            round
            lightTheme
            platform={'default'}
            placeholder="Search"
            onChangeText={text => this.searchFilterFunction(text)}
            value={this.state.searchString}
            containerStyle={{
              backgroundColor: '#FFF',
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
    justifyContent: 'center',
    flex: 1
  },
  bottomSpace: {
    marginBottom: 50
  }

});