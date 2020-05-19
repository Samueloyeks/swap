import { Component } from "react";
import RNFetchBlob from 'rn-fetch-blob'




class FormatImage extends Component {

    constructor(props) {
        super(props)
        this.imageToBlob = this.imageToBlob.bind(this)

    }


    imageToBlob = (uri, mime = 'application/octet-stream') => {
        //const mime = 'image/jpg';
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
      
        return new Promise ((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            let uploadBlob = null;
            // const imageRef = firebase.storage().ref('your_ref').child('child_ref');
            fs.readFile(uploadUri, 'base64')
            .then((data) => {
              return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then((blob) => {
              uploadBlob = blob;
              resolve(blob._ref)
              // imageRef.put(blob._ref, blob, { contentType: mime });
            })
            // .then(() => {
            //   imageRef.getDownloadURL().then(url => { 
            //    // do something
            //   });
            // }); 
        });
      };
      

    render() {
        return null
    }
}

const formatImage = new FormatImage()
export default formatImage;


