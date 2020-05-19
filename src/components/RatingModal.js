import React, { Component } from 'react';
import { Button, Text, View, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { Rating, AirbnbRating } from 'react-native-ratings';


export default class RatingModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isModalVisible: false,
    };
  }


  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      rating: 0,
      review: ''
    });
  };

  ratingCompleted = (rating) => {
    this.setState({ rating })
  }


  render() {
    return (
      <Modal
        // style={{ margin: 50 }}
        isVisible={this.props.isVisible}
        animationIn='slideInLeft'
        animationOut="slideOutRight"
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => this.props.toggleModal(null)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        }
      >
        <View style={styles.modalContainer}>
          <View>
            <Text style={{ textAlign: 'center' }}>{this.props.swap ? `Rate ${this.props.swap.item.postedby} for this swap` : null}</Text>
          </View>
          <AirbnbRating
            selectedColor='#FF9D5C'
            showRating={false}
            ratingCount={5}
            onFinishRating={this.ratingCompleted}
            defaultRating={0}
            starContainerStyle={{ paddingVertical: 20, marginBottom: 30 }}
          />

          <View style={{ paddingHorizontal: 15 }}>
            <Text style={{ textAlign: 'center' }}>Leave a comment or complaint</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              onChangeText={(review) => this.setState({ review })}
              value={this.state.review}
              style={{ backgroundColor: '#D6D8E0', borderRadius: 15, marginVertical: 10, padding: 5 }}
            />
            <TouchableOpacity style={styles.button} onPress={() => this.props.submitRating({ id: this.props.swap.id, rating: this.state.rating, review: this.state.review })} ><Text style={styles.buttonText}>Submit</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    borderColor: 'black',
    borderWidth: 0.5,
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 35,
    height: 37,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 17,
    color: '#FF9D5C'
  },
})