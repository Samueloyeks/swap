import React, { Component } from 'react'
import { View ,StyleSheet} from 'react-native';
import Dialog from "react-native-dialog";


export default class EmailDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newEmail: '',
            password: ''
        }
    }
    render() {
        return (
            <View>
                <Dialog.Container visible={this.props.visible}> 
                    {/* <Dialog.Title>Verify Account</Dialog.Title> */}
                    {/* <Dialog.Description>
                  Do you want to delete this account? You cannot undo this action.
                </Dialog.Description> */}
                    <Dialog.Input placeholderTextColor={'gray'} style={styles.inputStyle} autoCapitalize="none" keyboardType="email-address" placeholder="New Email" onChangeText={(newEmail) => this.setState({ newEmail })} />
                    <Dialog.Input placeholderTextColor={'gray'} style={styles.inputStyle} secureTextEntry placeholder="Password" onChangeText={(password) => this.setState({ password })} />
                    <Dialog.Button label="Cancel" onPress={this.props.handleCancel} />
                    <Dialog.Button label="Submit"
                        onPress={() =>
                            this.props.submitCredentials(this.state.newEmail, this.state.password)
                        } />
                </Dialog.Container>
            </View>
        )
    }
} 


const styles = StyleSheet.create({
    inputStyle:{
        color:'black'
    }
  
  });
