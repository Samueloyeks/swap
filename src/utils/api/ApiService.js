import { Component } from "react";
import { Linking } from 'react-native';
import base64 from 'react-native-base64'
import axios from 'axios';
import { API_USERNAME, API_PASSWORD, FIREBASE_KEY } from 'react-native-dotenv'



var firebaseKey = FIREBASE_KEY;

// var baseURL = 'http://127.0.0.1:3000';
// var baseURL =  'http://192.168.56.1:3000';



var baseURL = 'https://api-swap.herokuapp.com'


const authHeader = 'Basic ' + base64.encode(`${API_USERNAME}:${API_PASSWORD}`);
const defaultHeader = {
    'Authorization': authHeader,
    "Content-Type": "application/x-www-form-urlencoded",
    'Accept': 'application/json'
}

const notificationDataAndroid = {
    "to": "",
    // "notification": {
    //     "title": "",
    //     "body": "",
    //     "icon": "ic_stat_ic_notification",
    //     "show_in_foreground": true
    // },
    "data": {
        "body": "",
        "title": "",
        "content_available": true,
        "priority": "high",
        "icon": "ic_stat_ic_notification",
        "show_in_foreground": true
    }
};
const notificationDataIOS = {
    "to": "",
    // "notification": {
    //     "title": "",
    //     "body": "",
    //     "icon": "ic_stat_ic_notification",
    //     "show_in_foreground": true
    // },
    "data": {
        "body": "",
        "title": "",
        "content_available": true,
        "priority": "high",
        "icon": "ic_stat_ic_notification",
        "show_in_foreground": true
    }
};
const fcmHeader = {
    "Content-Type": "application/json",
    "Authorization": `key=${firebaseKey}`
}


class Api extends Component {

    constructor(props) {
        super(props)
        this.post = this.post.bind(this)
        this.get = this.get.bind(this)
    }


    // baseURL:string = 'http://127.0.0.1:3000/'
    // baseURL:string = 'http://localhost:8080/'; 


    async post(targetFunction, data) {
        const url = baseURL + targetFunction;

        return await axios.post(url, data, {
            headers: defaultHeader,
        })
    }



    async get(targetFunction) {
        const url = baseURL + targetFunction;

        return await axios.get(url, {
            headers: defaultHeader
        })
    }

    async postNotification(data) {
        const url = `https://fcm.googleapis.com/fcm/send`;

        if (data.deviceType) {
            if (data.deviceType == 'android') {
                // notificationDataAndroid.notification.title = data.title;
                // notificationDataAndroid.notification.body = data.body;
                notificationDataAndroid.data.title = data.title;
                notificationDataAndroid.data.body = data.body;
                notificationDataAndroid.to = data.to;

                return await axios.post(
                    url,
                    notificationDataAndroid,
                    {
                        headers: fcmHeader
                    }
                ).catch(error => console.log(error))

            } else {
                notificationDataIOS.data.title = data.title;
                notificationDataIOS.data.body = data.body;
                notificationDataIOS.to = data.to;

                return await axios.post(
                    url,
                    notificationDataIOS,
                    {
                        headers: fcmHeader
                    }
                ).catch(error => console.log(error))

            }
        } else {
            // notificationDataAndroid.notification.title = data.title;
            // notificationDataAndroid.notification.body = data.body;
            notificationDataAndroid.data.title = data.title;
            notificationDataAndroid.data.body = data.body;
            notificationDataAndroid.to = data.to;

            return await axios.post(
                url,
                notificationDataAndroid,
                {
                    headers: fcmHeader
                }
            ).catch(error => console.log(error))

        }

    }

    openURL = () => {
        Linking.openURL('http://swap.net').catch((err) => console.error('An error occurred', err));
    }

    render() {
        return null
    }
}

const api = new Api()
export default api

