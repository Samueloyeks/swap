import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableHighlight, Modal, RefreshControl, Button, Input, StatusBar, Platform, Dimensions, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { SearchBar, CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Filters from '../../components/Filters';
import ChatItem from '../../components/items/ChatItem'
import demoImage from '../../assets/imgs/demo.png';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'
import tracking from '../../utils/geolocation/Tracking'
import firebaseService from '../../utils/firebase/FirebaseService';
import { EventRegister } from 'react-native-event-listeners'



export default class MyItemChatsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            uid: null,
            itemDetails: null,
            loading: false,
            chatsList: []
        }
    }

    async componentDidMount() {
        this.setState({ loading: true })

        const { state } = await this.props.navigation;

        let itemDetails = await state.params.itemDetails;

        this.setState({
            itemDetails: itemDetails
        })

        await this.setUserData()

        let data = {
            uid: this.state.userData.uid,
            itemId: this.state.itemDetails.id
        }

        await firebaseService.setItemChatsRef(data);


        firebaseService.activateChatsListener();

        this.chatsListener = EventRegister.addEventListener('chatsList', (chatsList) => {
            this.setState({
                chatsList
            })
          })

        this.setState({loading:false})

    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.chatsListener);
        firebaseService.deactivateChatsListener()   
    }

    async setUserData() {
        await db.get('userData').then(data => {
            let userData = JSON.parse(data)
            this.setState({
                userData: userData,
                uid: userData.uid,
            })
            return
        })
    }


    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: `${navigation.state.params.itemDetails.title}`,
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


    deleteChat = (senderId) => {
        console.log(senderId)
    }


    renderItem = ({ item, index }) => {
        return (
            <ChatItem
                {...this.props}
                deleteChat={this.deleteChat}
                username={item.senderUsername}
                id={item.senderId}
                profilePicture={item.senderProfilePicture}
                lastMessage={item.lastMessage}
                lastMessageTime={item.lastMessageTime}
                opened={item.opened}
                itemDetails={this.state.itemDetails}
            />
        )
    }



    render() {
        return (
            <View style={styles.container}>
                {
                    !(this.state.chatsList && !this.state.loading) ?
                        <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                            <ActivityIndicator />
                        </View>
                        :
                        this.isEmpty(this.state.chatsList) ?
                            <View>
                                <Text style={{ textAlign: 'center', fontSize: 13, color: 'lightgrey', margin: 20 }}>
                                    No Chats to Display
                                </Text>
                            </View>
                            :
                            <FlatList
                                data={this.state.chatsList}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.senderId}
                                contentContainerStyle={{ paddingBottom: 50 }}
                                extraData={this.state}
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
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        alignSelf: 'flex-start'
    }

});