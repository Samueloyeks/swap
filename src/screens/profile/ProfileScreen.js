
import React, { Component } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, RefreshControl, FlatList, SafeAreaView, ListView, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, BackHandler, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import demoAvatar from '../../assets/imgs/demoAvatar.png'
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'
import firebaseService from '../../utils/firebase/FirebaseService'
import { EventRegister } from 'react-native-event-listeners'
import { HeaderBackButton } from 'react-navigation-stack';











export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userData: null,
      isRefreshing: false,
      uid: '',
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      profilePicture: null,
      loading: false,
      isFocused: false,
      likes: 0,
      rating: 0,
      swapsCompleted: 0
    }

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.setUserData = this.setUserData.bind(this);

  }


  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }


  async componentDidMount() {
    const { state } = await this.props.navigation;

    await this.setUserData();

    this.likesListener = EventRegister.addEventListener('likes', (likes) => {
      this.setState({
        likes: likes,
      })
    })

    this.swapsListener = EventRegister.addEventListener('swapsCompleted', (swapsCompleted) => {
      this.setState({
        swapsCompleted: swapsCompleted,
      })
    })

    this.ratingListener = EventRegister.addEventListener('rating', (rating) => {
      this.setState({
        rating: rating,
      })
    })

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.likesListener)
    EventRegister.removeEventListener(this.swapsListener)
    EventRegister.removeEventListener(this.ratingListener)

}

  async setUserData() {
    this.setState({ loading: true })

    await db.get('userData').then(udata => {
      let userData = JSON.parse(udata)
      let uid = userData.uid

      let data = {
        uid: uid
      }

      api.post('/users/fetchUserById', data).then((response) => {
        if (response.data.status == "success") {

          var userData = {
            "email": response.data.data.email,
            "username": response.data.data.username,
            "fullName": response.data.data.fullName,
            "phoneNumber": response.data.data.phoneNumber,
            "uid": response.data.data.uid,
            "profilePicture": (response.data.data.profilePicture == undefined ? null : response.data.data.profilePicture)
          }


          db.set('userData', userData).then(() => {
            this.setState({
              loading: false,
              userData: response.data.data,
              uid: response.data.data.uid,
              fullName: response.data.data.fullName,
              username: response.data.data.username,
              phoneNumber: response.data.data.phoneNumber,
              email: response.data.data.email,
              profilePicture: (response.data.data.profilePicture == undefined ? null : response.data.data.profilePicture)
            }, () => {
              this.activateListeners()
            })
          })

        } else {

          toast.show('Error')
          this.setState({
            loading: false,
            userData: userData,
            uid: userData.uid,
            fullName: userData.fullName,
            username: userData.username,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            profilePicture: userData.profilePicture
          })

        }
      })

    })
  }

  async activateListeners() {

    let data = {
      uid: this.state.uid
    }

    firebaseService.activateListeners(data);

  }

  async deactivateListeners(){

    firebaseService.deactivateListeners();

  }




  requestLogoutConfirmation = () => {
    Alert.alert(
      "Log out?",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => this.logOut()

        },

      ],
      { cancelable: false }
    );
  }



  logOut() {
    this.setState({ loading: true })
    db.delete('userData').then(() => {
      this.setState({ loading: false }) 

      EventRegister.removeEventListener(this.likesListener)
      EventRegister.removeEventListener(this.swapsListener)
      EventRegister.removeEventListener(this.ratingListener)
      EventRegister.removeAllListeners()
      this.deactivateListeners();

      db.delete('userData')
      this.props.navigation.popToTop()
      // this.props.navigation.reset()
      this.props.navigation.navigate('SignIn');
    })
  }


  render() {
    return (
      this.state.loading ?
        <View style={{ padding: 20 }}>
          <ActivityIndicator size="large" />
        </View>
        :
        <View style={{ flex: 1 }}>
          <View style={styles.coloredHeader}>
            <View style={styles.avatarContainer}>
              <ImageModal
                swipeToDismiss={true}
                resizeMode="contain"
                source={this.state.profilePicture ? ({ uri: this.state.profilePicture }) : demoAvatar}
                style={styles.avatar}
              />
            </View>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
            <Text style={{fontSize:20}}>{this.state.username}</Text>
            {this.state.phoneNumber?<Text><Icon name="phone" />{this.state.phoneNumber}</Text>:null}
            <Text><Icon name="email" />{this.state.email}</Text>

          </View>


          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
            <TouchableOpacity style={styles.editButton} onPress={() => this.props.navigation.navigate('EditProfileScreen', { userData: this.state.userData, onGoBack: this.setUserData })}>
              <Text style={{ textAlign: 'center', fontSize: 15, color: '#FF9D5C' }}>Edit</Text>
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
              <Text style={{ textAlign: 'center' }}>{this.state.likes ? this.state.likes : 0}</Text>
            </View>
          </View>

          <ScrollView >

          <TouchableOpacity onPress={() => this.props.navigation.navigate('MyFavoritesScreen')}>
              <View style={styles.item}>
                <Icon name="star" size={30} color="#000" style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 17, marginTop: 8, color: "#858585" }}>My Favorites</Text>
              </View>
            </TouchableOpacity>


          <TouchableOpacity onPress={() => api.openURL()}>
              <View style={styles.item}>
                <Icon name="headphones" size={30} color="#000" style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 17, marginTop: 8, color: "#858585" }}>Support</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingsScreen')}>
              <View style={styles.item}>
                <Icon name="settings" size={30} color="#000" style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 17, marginTop: 8, color: "#858585" }}>Settings</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={this.requestLogoutConfirmation}>
              <View style={styles.item}>
                <Icon name="logout" size={30} color="#000" style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 17, marginTop: 8, color: "#858585" }}>Log Out</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={this.requestDeleteConfirmation}>
              <View style={styles.item}>
                <Icon name="delete" size={30} color="#FE3939" style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 17, marginTop: 8, color: "#FE3939" }}>Delete Account</Text>
              </View>
            </TouchableOpacity> */}

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
    height: 130,
    width: 130,
    bottom: -40,
    backgroundColor: 'grey',

  },
  avatar: {
    height: 130,
    width: 130,
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
    shadowColor: 'lightgrey',
    shadowOffset: { width: 0.2, height: 0.2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 2
  }
})