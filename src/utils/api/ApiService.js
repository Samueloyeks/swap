import { Component } from "react";
import { Linking } from 'react-native';
import base64 from 'react-native-base64'
import axios from 'axios';



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

    openURL = () => {
        Linking.openURL('http://swap.net').catch((err) => console.error('An error occurred', err));
    }

    render() {
        return null
    }
}

const api = new Api()
export default api

