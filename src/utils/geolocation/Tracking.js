import { Component } from "react";
import Geolocation from '@react-native-community/geolocation';
import db from '../../utils/db/Storage'




class Tracking extends Component { 

    constructor(props) {
        super(props)
        this.getLocation = this.getLocation.bind(this)
    }



    getLocation() {
        return new Promise(async (resolve, reject) => {
            await Geolocation.getCurrentPosition(
                (data) => resolve(data),
                (err) => reject(err))
        })
    }

    render() {
        return null
    }
}

const tracking = new Tracking()
export default tracking

