import { Component } from "react";
import { Linking } from 'react-native';
import base64 from 'react-native-base64'
import axios from 'axios';


var firebaseKey = 'AAAAmKcn0K0:APA91bGGzpZOQax9RJLkjXf8fSTzNCV1KZfeQSTQQcMI8m0z0kOgkpsSe6PkVT3UVBk-JBmS3yx3kafxip1_oJM8XPuzGpjP1rMWnMUbDt67F2EKRBY_wvDXvkEIb7fsA3f5XySB7YCp';
var baseURL = 'http://127.0.0.1:3000';
// var baseURL =  'http://192.168.56.1:3000';
// var baseURL = 'http://localhost:8000';

// var baseURL = 'http://127.0.0.1:3000';
// var baseURL = 'https://localhost:3000';



var apiUsername = "am9objpzbWl0aA==";
var apiPassword = "JiZAQEFBMTE6NjcmOCMh";
const authHeader = 'Basic ' + base64.encode(`${apiUsername}:${apiPassword}`);
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
    "notification": {
        "title": "",
        "body": "",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon",
        "android_channel_id": "reminders"
    },
    "to": "",
    "priority": "high",
    "restricted_package_name": ""
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
                this.notificationDataIOS.notification.title = data.title;
                this.notificationDataIOS.notification.body = data.body;
                this.notificationDataIOS.to = data.to;

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

