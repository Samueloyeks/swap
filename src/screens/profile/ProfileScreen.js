import React, { Component } from 'react';
import { StyleSheet, View, Button, FlatList, Text, StatusBar, Platform, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import demoAvatar from '../../assets/imgs/demoAvatar.png'







export default class ProfileScreen extends React.Component {



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
        <View
          style={{
            flex: 1,
            // backgroundColor: Platform.OS === 'ios' ? '#FFF' : '',
            alignItems: 'center',
            flexDirection: 'column',
            paddingHorizontal: 15,
            height: StatusBar.currentHeight,
            width: screen.width - 10
          }}>
          <View style={styles.header}><Text style={{ fontSize: 20 }}>Profile</Text></View>
        </View>
      ),
    };
  };


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

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 60 }}>
          <Text>Sam2486</Text>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
          <TouchableOpacity style={styles.editButton} onPress={()=>this.props.navigation.navigate('EditProfileScreen')}>
            <Text style={{ textAlign: 'center', fontSize: 15, color: '#FF9D5C' }}>Edit</Text>
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

        <ScrollView >
          <TouchableOpacity>
            <View style={styles.item}>
              <Icon name="settings" size={35} color="#858585" style={{ marginHorizontal: 10 }} />
              <Text style={{ fontSize: 17, textAlignVertical: 'center', color: "#858585" }}>Settings</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.item}>
              <Icon name="headphones" size={35} color="#858585" style={{ marginHorizontal: 10 }} />
              <Text style={{ fontSize: 17, textAlignVertical: 'center', color: "#858585" }}>Support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.item}>
              <Icon name="logout" size={35} color="#858585" style={{ marginHorizontal: 10 }} />
              <Text style={{ fontSize: 17, textAlignVertical: 'center', color: "#858585" }}>Log Out</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.item}>
              <Icon name="delete" size={35} color="#FE3939" style={{ marginHorizontal: 10 }} />
              <Text style={{ fontSize: 17, textAlignVertical: 'center', color: "#FE3939" }}>Delete Account</Text>
            </View>
          </TouchableOpacity>

          <View style={{ height: 50 }}>

          </View>
        </ScrollView>
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
    bottom: -40
  },
  avatar: {
    alignSelf: 'center'
  },
  editButton: {
    borderWidth: 0.6,
    backgroundColor: "transparent",
    width: 95,
    borderRadius: 20,
    borderColor: "black",
    padding: 2,
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