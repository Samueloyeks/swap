import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import SelectItem from '../../components/items/SelectItem'
import demoImage from '../../assets/imgs/demo.png'



export default class SelectItemsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: {
        "1": {
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
          likeCount:5
        },
        "2": {
          id: 2,
          title: 'Sony Sound System',
          postedOn: '15th November 2019',
          price: '$200',
          likes: 45,
          images: [demoImage, demoImage, demoImage, demoImage],
          swapped: false,
          description:
            'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
          preferences: ['New Watch', 'Black Snapback', 'A date'],
          categories: ['Men', 'Music'],
          numberAvailable: 3,
          likeCount:7
        },
        "3": {
          id: 3,
          title: 'Used Car',
          postedOn: '15th November 2019',
          price: '$20',
          likes: 40,
          images: [demoImage, demoImage, demoImage, demoImage],
          swapped: true,
          description:
            'Lorem ipsum dolor sit amet, tantas recusabo vim ea, tamquam fuisset ei vim. Sea in tota accusam, mea eu mentitum percipit. Ex nibh viris pro, duo eu natum ornatus periculis. At qui habeo feugiat percipit. Est labore omittam gloriatur ut, ex his idque equidem efficiantur, nisl sonet adipiscing an has.Et vim dicat adversarium, cu legere euismod suavitate vis, cibo fugit volumus ei eum. Ne diceret admodum sit. An sit integre prompta dissentiet, ut delectus contentiones vituperatoribus vis. An zril atomorum mel, ad usu aperiam virtute. Elit oportere gloriatur id nec.',
          preferences: ['New Watch', 'Black Snapback', 'A date'],
          categories: ['Accessories'],
          numberAvailable: 1,
          likeCount:2
        },
      }
    }
  
    this.markAsOffered = this.markAsOffered.bind(this);
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

  markAsOffered = id => {
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
      <SelectItem
        {...this.props}
        markAsOffered = {this.markAsOffered}
        images={item.images}
        title={item.title}
        price={item.price}
        timeAgo={item.timeAgo}
        id={item.id}
        description={item.description}
        preferences={item.preferences}
        categories={item.categories}
        numberAvailable={item.numberAvailable}
        swapped = {item.swapped}
        likeCount={item.likeCount}
        postedOn={item.postedOn}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: 'transparent',flexDirection:'row' }}>
          <SearchBar
            round
            lightTheme
            platform={'default'}
            placeholder="Search"
            containerStyle={{
              backgroundColor: '#FF9D5C',
              alignItems: "center",
              justifyContent: 'center',
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
              flex:0.8
            }}
            inputContainerStyle={{
              height: 30,
              alignSelf: 'center',
            }}
          />
           <View style={{flex:0.2,backgroundColor: '#FF9D5C',}}>
             <TouchableOpacity onPress={()=>this.props.navigation.navigate('ConfirmOfferScreen')}>
             <Text style={styles.headerButton}>Done</Text>
             </TouchableOpacity>
             </View>
        </View>

        <FlatList
          data={Object.values(this.state.items)}
          renderItem={this.renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 50 }}
        />

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
  headerButton:{
    // fontSize:15,
    alignSelf:'flex-end',
    padding:10,
    textAlignVertical:'center'
  }

});