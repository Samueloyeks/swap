import { Component } from "react";
import { EventRegister } from 'react-native-event-listeners'
import firebase from '../../../Firebase'





class FirebaseService extends Component {

    constructor(props) {
        super(props)

        this.activateListeners = this.activateListeners.bind(this)
    }

    activateListeners = (data) => {

        let userRef = firebase
            .database()
            .ref('/userProfiles')
            .child(data.uid);

        let likesRef = userRef
            .child('likes')

        let swapsCompletedRef = userRef
            .child('swapsCompleted')
        
        let ratingRef = userRef
            .child('rating')

        likesRef.on('value', function (snap) {

            let likes = snap.val();
            // console.log(likes)
            EventRegister.emit('likes', likes)

        })

        swapsCompletedRef.on('value', function (snap) {

            let swapsCompleted = snap.val();
            // console.log(likes)
            EventRegister.emit('swapsCompleted', swapsCompleted)

        })

        ratingRef.on('value', function (snap) {

            let rating = snap.val();
            // console.log(likes)
            EventRegister.emit('rating', rating)

        })
    }





    render() {
        return null
    }
}

const firebaseService = new FirebaseService()
export default firebaseService

