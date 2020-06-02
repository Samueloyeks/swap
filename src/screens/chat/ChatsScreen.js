import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  PermissionsAndroid,
  TouchableOpacity
} from 'react-native';
// import { Header, NavigationActions } from 'react-navigation'
// import {AudioRecorder, AudioUtils} from 'react-native-audio'
// import RNFS from 'react-native-fs'
// import Sound from 'react-native-sound'
import { ChatScreen } from 'react-native-easy-chat-ui'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GiftedChat, Bubble, } from 'react-native-gifted-chat'
import db from '../../utils/db/Storage'
import demoAvatar from '../../assets/imgs/demoAvatar.png'
import firebaseService from '../../utils/firebase/FirebaseService';






export default class ChatsScreen extends React.Component {

  state = {
    userData: null,
    uid: null,
    username: null,
    posterData: null,
    itemDetails: null,
    profilePicture: null,
    messages: [],
  }


  async componentDidMount() {
    const { state } = await this.props.navigation;

    let posterData = await state.params.itemDetails.postedby
    let itemDetails = await state.params.itemDetails;

    this.setState({
      posterData: posterData,
      itemDetails: itemDetails
    })

    await this.setUserData()

    let data = {
      uid: this.state.userData.uid,
      chatToId: this.state.posterData.uid,
      itemId: this.state.itemDetails.id
    }

    await firebaseService.setRef(data);

    firebaseService.updateMessages(message => {
      if (message) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        })
        )
      }
    }

    );



    this.setState({
      messages: [
        {
          _id: 1,
          text:
            <Text
              style={styles.itemTitle}
              onPress={() => this.props.navigation.navigate('ExploreItemDetailsScreen', { itemDetails: state.params.itemDetails, onGoBack: () => { return } })}
            >
              {state.params.itemDetails.title}
            </Text>,
          createdAt: new Date(),
          image: state.params.itemDetails.images[0],
          user: {
            _id: state.params.itemDetails.postedby.uid,
            name: state.params.itemDetails.postedby.username,
            avatar: state.params.itemDetails.postedby.profilePicture,
          },
        },
      ],
    })

  }


  componentWillUnmount() {
    firebaseService.removeRef()
  }

  async setUserData() {
    await db.get('userData').then(data => {
      let userData = JSON.parse(data)
      this.setState({
        userData: userData,
        uid: userData.uid,
        username: userData.username,
        profilePicture: userData.profilePicture
      })
      return
    })
  }

  onSend(message = []) {
    let messageBody = message[0]
    firebaseService.appendMessage(messageBody)
  }


  static navigationOptions = ({ navigation }) => {
    return {
      title:
        <Text
          onPress={() => navigation.navigate('ExploreItemDetailsScreen', { itemDetails: navigation.state.params.itemDetails, onGoBack: () => { return } })}
        >{navigation.state.params.itemDetails.title}</Text>,
      headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: '#FF9D5C',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    }
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: '#FFF',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#000',
          },
          right: {
            backgroundColor: "#FF9D5C",
          },
        }}
      />
    );
  }


  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={message => this.onSend(message)}
        renderBubble={(props) => this.renderBubble(props)}
        user={{
          _id: this.state.uid,
          name: this.state.username,
          avatar: (this.state.profilePicture !== undefined) ? this.state.profilePicture : null
        }}
      />
    )
  }
}


const styles = StyleSheet.create({

  itemTitle: {
    color: '#FF9D5C'
  }
})