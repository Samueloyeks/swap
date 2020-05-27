import React, { Component } from 'react';
import { StyleSheet, View, Button, FlatList, Text, StatusBar, Platform, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import demoAvatar from '../../assets/imgs/demoAvatar.png'
import ExploreItem from '../../components/items/ExploreItem'
import demoImage from '../../assets/imgs/demo.png'





export default class UserProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: {
        "1": {
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
        "2": {
          id: 2,
          title: 'Used Wig',
          postedby: 'kemi999',
          price: '$50',
          timeAgo: '1 hour',
          images: [demoImage, demoImage, demoImage, demoImage],
          liked: false,
          favorited: false,
          description:
            'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
          preferences: ['New Watch', 'Black Snapback', 'A date'],
          categories: ['Men', 'Fashion', 'Footwear'],
          numberAvailable: 2
        },
      }
    }

    this.like = this.like.bind(this);
    this.favorite = this.favorite.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const screen = Dimensions.get("window");

    return {
      // title: `${navigation.state.params.itemDetails.title}`,
      title: 'Seyi209',
      headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
      headerStyle: {
        backgroundColor: '#FF9D5C',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerBackTitleVisible: false,
    };
  };

  like = id => { 
    let item = this.state.items[id]
    const { liked, likeCount } = item

    const newItem = {
      ...item,
      liked: !liked,
      likeCount: liked ? likeCount - 1 : likeCount + 1
    }

    this.setState({
      items: {
        ...this.state.items,
        [id]: newItem
      }
    })
  }

  favorite = id => {
    let item = this.state.items[id]
    const { favorited } = item

    const newItem = {
      ...item,
      favorited: !favorited,
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
      <ExploreItem
        {...this.props}
        favorite={this.favorite}
        like={this.like}
        images={item.images}
        postedby={item.postedby}
        title={item.title}
        price={item.price}
        timeAgo={item.timeAgo}
        liked={item.liked}
        favorited={item.favorited}
        id={item.id}
        description={item.description}
        preferences={item.preferences}
        categories={item.categories}
        numberAvailable={item.numberAvailable}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.coloredHeader}>
          <View style={styles.avatarContainer}>
            <ImageModal
              swipeToDismiss={true}
              resizeMode="contain"
              source={demoAvatar}
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <Text>Seyi209</Text>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, flexDirection: 'row' }}>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={{ textAlign: 'center', fontSize: 15, color: '#FF9D5C' }}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportButton}>
            <Text style={{ textAlign: 'center', fontSize: 15, color: '#FF9D5C' }}>Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <View style={{ paddingHorizontal: 25, borderRightWidth: 1, borderRightColor: '#C4C4C4' }}>
            <Icon name="star" size={40} color="#FF9D5C" />
            <Text style={{ textAlign: 'center' }}>4</Text>
          </View>
          <View style={{ paddingHorizontal: 25 }}>
            <Icon name="swap-horizontal" size={40} color="#FF9D5C" />
            <Text style={{ textAlign: 'center' }}>57</Text>
          </View>
          <View style={{ paddingHorizontal: 25, borderLeftWidth: 1, borderLeftColor: '#C4C4C4' }}>
            <Icon name="heart" size={40} color="#FF9D5C" />
            <Text style={{ textAlign: 'center' }}>122</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}><Text style={{ fontSize: 20 }}>Items</Text></View>
        <View >

        <TouchableOpacity><Text style={{ textAlign: 'right', color: '#9F9F9F', paddingHorizontal: 20 }}>View All</Text></TouchableOpacity>

          <FlatList
            data={Object.values(this.state.items)}
            renderItem={this.renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
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
    // bottom: -40
  },
  avatar: {
    alignSelf: 'center'
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
  }
})