import { Component } from "react";
import AsyncStorage from '@react-native-community/async-storage';



class Storage extends Component {

    constructor(props) {
        super(props)
        this.set = this.set.bind(this)
        this.get = this.get.bind(this)

    }


    selectedPhoto;
    base64Image = null;


    async set(targetName, data) {

        await AsyncStorage.setItem(targetName, JSON.stringify(data));
        return;

    }

    async get(targetName) {

        const data = await AsyncStorage.getItem(targetName);
        return data;

    }

    async delete(targetName){

        await AsyncStorage.removeItem(targetName)
        return;
    }

    render() {
        return null
    }
}

const db = new Storage()
export default db

