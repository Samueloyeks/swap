import React, { Component } from 'react';
import ImageModal from 'react-native-image-modal';
import itemImage from '../assets/imgs/item.png'



export default class ImageSlide extends Component {
  render() {
    return (
      <ImageModal
        swipeToDismiss={true}
        resizeMode="contain"
        imageBackgroundColor="lightgrey"
        style={{
          width: 112,
          height: 112
        }}
        source={
          this.props.image ? ({ uri: this.props.image }) : itemImage
        }
      />
    )
  }
}

