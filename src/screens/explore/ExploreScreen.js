import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, RefreshControl, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import ExploreItem from '../../components/items/ExploreItem'
import demoImage from '../../assets/imgs/demo.png';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'



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
      error:null,
      searchString:''
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
      searchString : this.searchString
    });
    await this.getCategories();
    await this.getItems();
    await this.setUserData();
  }



  getCategories = () => {
    api.get('/categories/getCategories').then((response) => {
      this.setState({
        categories: response.data.data
      })
    })
  }

  getItems = () => {
    this.setState({ loading: true })
    api.get('/items/getItems').then((response) => {
      this.setState({
        items: response.data.data,
        loading: false
      })
      this.arrayholder = response.data.data
    })
  }

  getItemsByCategory = () => {
    this.setState({ loading: true })
    api.post('/items/getItemsByCategory', this.state.activeCategories).then((response) => {
      this.setState({
        items: response.data.data,
        loading: false
      })
    })
  }

  setUserData() {
    db.get('userData').then(data => {
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
      searchString:text,
      loading:true
    }) 

    this.props.navigation.setParams({
      searchString:text
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
      const itemData = `${item.title.toUpperCase()}   
      ${item.postedby.username.toUpperCase()}`;
      
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });
    
    this.setState({ 
      items: newData,
      loading:false
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
              // autoCorrect={false}
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
          (<TouchableOpacity style={{ paddingRight: 5 }} onPress={() => alert('Right Menu Clicked')}>
            <Icon
              name="filter"
              color='#000'
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

  refreshDetails=(data)=>{
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

  onRefresh() {
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

  renderItem = ({ item, index }) => {
    return (
      <ExploreItem
        {...this.props}
        favorite={this.favorite}
        like={this.like}
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
        (this.isEmpty(this.state.activeCategories)) ?
          this.getItems() :
          this.getItemsByCategory()
      })
    } else {
      newActiveCategories[id] = true;

      this.setState({
        activeCategories: newActiveCategories,
        activeCategoriesCount: this.state.activeCategoriesCount + 1
      }, () => {
        (this.isEmpty(this.state.activeCategories)) ?
          this.getItems() :
          this.getItemsByCategory()
      })
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Filters
          filters={this.state.categories}
          activeFiltersCount={this.state.activeCategoriesCount}
          activeFiltersMap={this.state.activeCategories}
          updateCategoryFilters={this.updateCategoryFilters}
        />

        {
          (this.state.items && !this.state.loading) ?
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
            :
            <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
              <ActivityIndicator />
            </View>
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
  }

});