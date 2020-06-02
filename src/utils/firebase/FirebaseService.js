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

let itemChatsRef
let chatToRef


class FirebaseService extends Component {

    constructor(props) {
        super(props)

        this.activateListeners = this.activateListeners.bind(this)
        this.deactivateListeners = this.deactivateListeners.bind(this)

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


    setRef = async (data) => {
        let uid = data.uid;
        let chatToId = data.chatToId;
        let itemId = data.itemId


        itemChatsRef = chatsRef
            .child(chatToId)
            .child(itemId)

            chatToRef = chatsRef
            .child(chatToId)
            .child(itemId)
            .child(uid);
        return;
    }

    updateMessages = callback => {
        chatToRef
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));
    }

    removeRef = () => {
        chatToRef.off()
    }

    parse = snapshot => {
        console.log(snapshot.val())
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

        // await chatRef.push(messageBody)
        await chatToRef.push(messageBody)
        await chatToRef.update({
            timestamp: firebase.database.ServerValue.TIMESTAMP
        })
        await chatToRef.once('value').then(function (snap) {
            timestamp = snap.val().timestamp * -1
            chatToRef.update({ timestamp })
        })
        // await itemChatsRef.update({
        //     timestamp:firebase.database.ServerValue.TIMESTAMP
        // })

    }

    isObject(val) {
        return (typeof val === 'object');
    }

    render() {
        return null
    }
}

const firebaseService = new FirebaseService()
export default firebaseService

