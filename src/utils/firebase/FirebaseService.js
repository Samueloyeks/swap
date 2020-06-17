import { Component } from "react";
import { Platform, Alert } from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
// import firebase from '../../../Firebase'
import * as firebase from 'react-native-firebase';
import api from '../api/ApiService'
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import db from '../db/Storage'
import toast from '../../utils/SimpleToast'
import keys from '../Keys'



const firebaseAuth = firebase.auth();
const { FacebookAuthProvider, GoogleAuthProvider } = firebase.auth;
import { GoogleSignin } from '@react-native-community/google-signin';

export const GOOGLE_CONFIGURATION = {
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    offlineAccess: true,
    hostedDomain: '',
    loginHint: '',
    forceConsentPrompt: true,
    accountName: '',
    iosClientId: keys.IOS_CLIENT_ID,
    webClientId: keys.GOOGLE_WEB_CLIENT_ID,
};


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

        chatRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                chatRef.update({
                    [uid]: true,
                })
            }
        })

        chatToRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                chatToRef.update({
                    [uid]: true,
                })
            }
        })


        return;
    }

    markAsSeen = (data) => {
        let uid = data.uid;

        chatRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                chatRef.update({
                    [uid]: true,
                })
            }
        })

        chatToRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                chatToRef.update({
                    [uid]: true,
                })
            }
        })
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
        var fcmToken = messageBody.fcmToken
        var deviceType = messageBody.deviceType

        delete messageBody['fcmToken']
        delete messageBody['deviceType']

        await chatToRef.push(messageBody)
        await chatRef.push(messageBody)

        await chatToRef.update({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            [myId]: true,
            [chatToId]: false,
            lastMessage: messageBody.text,
            lastMessageTimestamp: messageBody.timestamp
        })
        await chatToRef.once('value').then(function (snap) {
            timestamp = snap.val().timestamp * -1
            chatToRef.update({ timestamp })
        })

        await chatRef.update({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            [myId]: true,
            [chatToId]: false,
            lastMessage: messageBody.text,
            lastMessageTimestamp: messageBody.timestamp
        })
        await chatRef.once('value').then(function (snap) {
            timestamp = snap.val().timestamp * -1
            chatRef.update({ timestamp })
        })

        var notificiationData = {
            title: messageBody.user.name,
            body: messageBody.text,
            to: fcmToken,
            deviceType: deviceType,
        };

        api.postNotification(notificiationData).then((response) => {

        });
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

        await orderedItemChatsRef.once("value", function (snapshot) {

            snapshot.forEach(function (child) {
                senderRefs.push(child.key);
            }.bind(this));

        })


        await Promise.all(senderRefs.map(async senderRef => {

            let userDetailsSnap = await usersRef.child(senderRef).once('value');
            let userDetails = await userDetailsSnap.val();

            let senderUsername = userDetails.username;
            let senderId = userDetails.uid;
            let senderProfilePicture = userDetails.profilePicture;

            let userMessagesSnap = await itemChatsRef.child(senderRef).once('value')
            let userMessages = await userMessagesSnap.val();

            // let keys = Object.keys(userMessages)
            // keys = keys.filter(key => 
            //     key !== myId
            //      && key !== 'timestamp'
            //       && key !==senderRef
            //       && key !== 'lastMessage'
            //       && key !=='lastMessageTimestamp' 
            // )

            let lastMessage = userMessages['lastMessage']
            let lastMessageTimestamp = userMessages['lastMessageTimestamp']

            // let lastMessage = userMessages[keys[keys.length - 1]].text 
            // let lastMessageTimestamp = userMessages[keys[keys.length - 1]].timestamp
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

    //=============================================================================================
    //SOCIAL AUTH

    facebookAuth = async () => {
        return new Promise(async (resolve, reject) => {

            try {
                const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
                if (result.isCancelled) {
                    return;
                }

                const { accessToken } = await AccessToken.getCurrentAccessToken();
                const credential = FacebookAuthProvider.credential(accessToken);
                const data = await firebaseAuth.signInWithCredential(credential);
                let uData

                if (data.additionalUserInfo.isNewUser) {
                    uData = await this.facebookSignup(data)
                    Alert.alert(
                        "Important",
                        "Please update your phone number and check your email to verify your account",
                        [
                            {
                                text: "Ok",
                                style: "cancel"
                            },
                        ],
                        { cancelable: false }
                    );
                } else {
                    uData = await this.socialLogin(data)
                }

                resolve(uData)

            } catch (err) {
                resolve(false);
            }

        })
    };

    facebookSignup = async (data) => {
        return new Promise(async (resolve, reject) => {

            let rateTable = [
                { rating: 5, count: 0 },
                { rating: 4, count: 0 },
                { rating: 3, count: 0 },
                { rating: 2, count: 0 },
                { rating: 1, count: 0 },
            ]

            let firstName = data.additionalUserInfo.profile.first_name;
            let lastName = data.additionalUserInfo.profile.last_name
            let fullName = firstName + ' ' + lastName
            let email = data.additionalUserInfo.profile.email;
            let phoneNumber = data.user.phoneNumber;
            let profilePicture =
                (data.additionalUserInfo.profile.picture.data.url) ? data.additionalUserInfo.profile.picture.data.url : null
            let username = await this.generateUsername(firstName, lastName)
            let uid = data.user.uid
            let lastSeen = Date(firebaseAuth.currentUser.metadata.lastSignInTime)
            let dateCreated = Date(firebaseAuth.currentUser.metadata.creationTime)
            let verified = firebaseAuth.currentUser.emailVerified

            let uData = {
                fullName,
                username,
                email,
                phoneNumber,
                profilePicture,
                uid,
                lastSeen,
                dateCreated,
                verified
            }

            let fcmToken = await db.get('fcmToken');
            let deviceType = Platform.OS;
            let itemsRefKey = firebase.database().ref(`/usersItemsRefs`).push().key;
            let likesRefKey = firebase.database().ref(`/usersLikesRefs`).push().key;
            let favoritesRefKey = firebase.database().ref(`/usersFavoritesRefs`).push().key;
            let swapsRefKey = firebase.database().ref(`/usersSwapsRefs`).push().key;

            uData.fcmToken = fcmToken;
            uData.deviceType = deviceType;
            uData.usernameLower = await username.toLowerCase()
            uData.likes = 0
            uData.rating = 0
            uData.rateTable = rateTable
            uData.swapsCompleted = 0
            uData.reports = 0
            uData.status = 'active';
            uData.itemsRefKey = itemsRefKey
            uData.likesRefKey = likesRefKey
            uData.favoritesRefKey = favoritesRefKey
            uData.swapsRefKey = swapsRefKey

            // console.log(uData)
            try {
                await firebase.database().ref(`/userProfiles/${uid}`).set(uData).then(async () => {
                    await firebaseAuth.currentUser.sendEmailVerification();

                    resolve(uData)

                }, err => {
                    toast.show('Error Signing Up')
                    console.log(err);
                    resolve(false)
                })
            } catch (ex) {
                toast.show('Error Signing Up')
                console.log(ex)
                resolve(false)
            }

        })
    }

    googleAuth = async () => {
        return new Promise(async (resolve, reject) => {

            try {
                GoogleSignin.configure(GOOGLE_CONFIGURATION);
                const { idToken, accessToken } = await GoogleSignin.signIn();
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                const data = await firebaseAuth.signInWithCredential(credential);

                let uData

                if (data.additionalUserInfo.isNewUser) {
                    uData = await this.googleSignup(data)
                    Alert.alert(
                        "Important",
                        "Please update your phone number and check your email to verify your account",
                        [
                            {
                                text: "Ok",
                                style: "cancel"
                            },
                        ],
                        { cancelable: false }
                    );
                } else {
                    uData = await this.socialLogin(data)
                }

                resolve(uData)

            } catch (err) {
                console.log(err)
                resolve(false);
            }

        })
    }

    googleSignup = async (data) => {
        return new Promise(async (resolve, reject) => {

            let rateTable = [
                { rating: 5, count: 0 },
                { rating: 4, count: 0 },
                { rating: 3, count: 0 },
                { rating: 2, count: 0 },
                { rating: 1, count: 0 },
            ]


            let firstName = data.additionalUserInfo.profile.given_name;
            let lastName = data.additionalUserInfo.profile.family_name;
            let fullName = firstName + ' ' + lastName
            let email = data.additionalUserInfo.profile.email;
            let phoneNumber = data.user.phoneNumber;
            let profilePicture =
                (data.additionalUserInfo.profile.picture) ? data.additionalUserInfo.profile.picture : null
            let username = await this.generateUsername(firstName, lastName)
            let uid = data.user.uid
            let lastSeen = Date(firebaseAuth.currentUser.metadata.lastSignInTime)
            let dateCreated = Date(firebaseAuth.currentUser.metadata.creationTime)
            let verified = firebaseAuth.currentUser.emailVerified

            let uData = {
                fullName,
                username,
                email,
                phoneNumber,
                profilePicture,
                uid,
                lastSeen,
                dateCreated,
                verified
            }

            let fcmToken = await db.get('fcmToken');
            let deviceType = Platform.OS;
            let itemsRefKey = firebase.database().ref(`/usersItemsRefs`).push().key;
            let likesRefKey = firebase.database().ref(`/usersLikesRefs`).push().key;
            let favoritesRefKey = firebase.database().ref(`/usersFavoritesRefs`).push().key;
            let swapsRefKey = firebase.database().ref(`/usersSwapsRefs`).push().key;

            uData.fcmToken = fcmToken;
            uData.deviceType = deviceType;
            uData.usernameLower = await username.toLowerCase()
            uData.likes = 0
            uData.rating = 0
            uData.rateTable = rateTable
            uData.swapsCompleted = 0
            uData.reports = 0
            uData.status = 'active';
            uData.itemsRefKey = itemsRefKey
            uData.likesRefKey = likesRefKey
            uData.favoritesRefKey = favoritesRefKey
            uData.swapsRefKey = swapsRefKey

            // console.log(uData)
            try {
                await firebase.database().ref(`/userProfiles/${uid}`).set(uData).then(async () => {
                    await firebaseAuth.currentUser.sendEmailVerification();

                    resolve(uData)

                }, err => {
                    toast.show('Error Signing Up')
                    console.log(err);
                    resolve(false)
                })
            } catch (ex) {
                toast.show('Error Signing Up')
                console.log(ex)
                resolve(false)
            }

        })
    }

    socialLogin = async (data) => {
        return new Promise(async (resolve, reject) => {

            let uid = data.user.uid
            let lastSeen = Date(firebaseAuth.currentUser.metadata.lastSignInTime)
            let verified = firebaseAuth.currentUser.emailVerified

            let fcmToken = await db.get('fcmToken');
            let deviceType = Platform.OS;

            try {
                await firebase.database().ref(`/userProfiles/` + uid).once('value').then(async (snapshot) => {
                    let uData = snapshot.val();

                    await firebase.database().ref(`/userProfiles/` + uid).update({
                        fcmToken,
                        deviceType,
                        lastSeen,
                        verified
                    })

                    if (uData.verified) {
                        resolve(uData);
                    } else {
                        resolve(false);
                    }

                    //Email sent
                }, err => {
                    toast.show('Error Signing In')
                    console.log(err);
                    resolve(false)
                });

            } catch (ex) {
                toast.show('Error Signing In')
                console.log(ex)
                resolve(false)
            }

        })
    }


    generateUsername = async (firstName, lastName) => {
        let alias = (firstName.substring(0, 1) + lastName).toLowerCase()
        var num = Math.floor(1000 + Math.random() * 9000);

        let username = alias + num;
        if (this.isUsernameTaken(username)) {
            return this.generateUsername(username)
        } else {
            return username;
        }

    }

    isUsernameTaken(username) {

        let data = {
            username: username,
            uid: null
        }

        api.post('/users/isUsernameTaken', data).then((response) => {
            if (response.data.status) {
                return true;
            } else {
                return false;
            }

        })
    }

    render() {
        return null
    }
}

const firebaseService = new FirebaseService()
export default firebaseService

