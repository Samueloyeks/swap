import { Component } from "react";
import { EventRegister } from 'react-native-event-listeners'
import firebase from '../../../Firebase'

let userRef
let likesRef
let swapsCompletedRef
let ratingRef
let chatsRef = firebase
    .database()
    .ref('/chats')

let usersRef = firebase
    .database()
    .ref('/userProfiles')

let orderedItemChatsRef
let itemChatsRef
let chatToRef
let chatRef
let myId
let currentItemId


class FirebaseService extends Component {

    constructor(props) {
        super(props)

        this.activateListeners = this.activateListeners.bind(this)
        this.deactivateListeners = this.deactivateListeners.bind(this)
        this.activateChatsListener = this.activateChatsListener.bind(this)
        this.deactivateChatsListener = this.deactivateChatsListener.bind(this)
    }

    activateListeners = (data) => {

        userRef = firebase
            .database()
            .ref('/userProfiles')
            .child(data.uid);

        likesRef = userRef
            .child('likes')

        swapsCompletedRef = userRef
            .child('swapsCompleted')

        ratingRef = userRef
            .child('rating')

        likesRef.on('value', function (snap) {

            let likes = snap.val();
            EventRegister.emit('likes', likes)

        })

        swapsCompletedRef.on('value', function (snap) {

            let swapsCompleted = snap.val();
            EventRegister.emit('swapsCompleted', swapsCompleted)

        })

        ratingRef.on('value', function (snap) {

            let rating = snap.val();
            EventRegister.emit('rating', rating)

        })

    }

    deactivateListeners = () => {


        likesRef.off('value')

        swapsCompletedRef.off('value')

        ratingRef.off('value')

    }


    setChatRef = async (data) => {
        let uid = data.uid;
        let chatToId = data.chatToId;
        let itemId = data.itemId


        chatToRef = chatsRef
            .child(chatToId)
            .child(itemId)
            .child(uid);

        chatRef = chatsRef
            .child(uid)
            .child(itemId)
            .child(chatToId);

        chatRef.once('value').then(snapshot=>{
            if(snapshot.exists()){
                chatRef.update({
                    [uid]: true,
                })
            }
        })

        chatToRef.once('value').then(snapshot=>{
            if(snapshot.exists()){
                 chatToRef.update({
                    [uid]: true,
                })
            }
        })

    
        return;
    }

    updateMessages = callback => {
        chatToRef
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));
    }

    removeChatRef = () => {
        chatToRef.off()
    }

    parse = snapshot => {
        if (this.isObject(snapshot.val())) {
            const { timestamp: numberStamp, text, user } = snapshot.val();
            const { key: _id } = snapshot;
            const createdAt = new Date(numberStamp);
            const message = { _id, createdAt, text, user };
            return message;
        } else {
            return null
        }
    };

    appendMessage = async (messageBody) => {
        messageBody.timestamp = firebase.database.ServerValue.TIMESTAMP

        var myId = messageBody.myId;
        var chatToId = messageBody.chatToId

        await chatToRef.push(messageBody)
        await chatRef.push(messageBody)

        await chatToRef.update({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            [myId]: true,
            [chatToId]: false
        })
        await chatToRef.once('value').then(function (snap) {
            timestamp = snap.val().timestamp * -1
            chatToRef.update({ timestamp })
        })

        await chatRef.update({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            [myId]: true,
            [chatToId]: false
        })
        await chatRef.once('value').then(function (snap) {
            timestamp = snap.val().timestamp * -1
            chatRef.update({ timestamp })
        })

    }

    isObject(val) {
        return (typeof val === 'object');
    }

    // ===================================================================================== 

    setItemChatsRef = async (data) => {
        let uid = data.uid;
        let itemId = data.itemId

        myId = uid;
        currentItemId = itemId

        orderedItemChatsRef = chatsRef
            .child(uid)
            .child(itemId)
            .orderByChild('timestamp');

        itemChatsRef = chatsRef
            .child(uid)
            .child(itemId)

        return;
    }

    activateChatsListener = () => {
        return new Promise(resolve => {
            orderedItemChatsRef.on('value', async () => {
                let messages = await this.returnChatsList()
                EventRegister.emit('chatsList', messages)
                resolve()
            })
        })
    }

    deactivateChatsListener() {
        orderedItemChatsRef.off()
    }

    returnChatsList = async () => {
        let chatsList = [];
        let senderRefs = [];

        orderedItemChatsRef.once("value", function (snapshot) {
            
            snapshot.forEach(function (child) {
                senderRefs.push(child.key);
            }.bind(this));

        })
        console.log(senderRefs)


        await Promise.all(senderRefs.map(async senderRef => {

            let userDetailsSnap = await usersRef.child(senderRef).once('value');
            let userDetails = await userDetailsSnap.val();

            let senderUsername = userDetails.username;
            let senderId = userDetails.uid;
            let senderProfilePicture = userDetails.profilePicture;

            let userMessagesSnap = await itemChatsRef.child(senderRef).once('value')
            let userMessages = await userMessagesSnap.val();

            let keys = Object.keys(userMessages)
            let lastMessage = userMessages[keys[keys.length - 4]].text
            let lastMessageTimestamp = userMessages[keys[keys.length - 4]].timestamp
            let lastMessageTime = new Date(lastMessageTimestamp).toISOString();
            let opened = userMessages[myId]


            let chatsListObj = {
                senderUsername,
                senderId,
                senderProfilePicture,
                lastMessage,
                lastMessageTime,
                opened
            }

            chatsList.push(chatsListObj)

        }))


        return chatsList;
    }


    render() {
        return null
    }
}

const firebaseService = new FirebaseService()
export default firebaseService

