import { Component } from "react";
import Toast from 'react-native-simple-toast';




class SimpleToast extends Component {

    constructor(props) {
        super(props)
        this.show = this.show.bind(this)

    }


    show(message){
        Toast.show(message);
    }

    render() {
        return null
    }
}

const toast = new SimpleToast()
export default toast

