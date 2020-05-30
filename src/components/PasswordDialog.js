import React, { Component } from 'react'
import { View } from 'react-native';
import Dialog from "react-native-dialog";


export default class PasswordDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: ''
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
                    <Dialog.Input secureTextEntry placeholder="Old Password" onChangeText={(oldPassword) => this.setState({ oldPassword })} />
                    <Dialog.Input secureTextEntry placeholder="New Password" onChangeText={(newPassword) => this.setState({ newPassword })} />
                    <Dialog.Button label="Cancel" onPress={this.props.handleCancel} />
                    <Dialog.Button label="ok"
                        onPress={() =>
                            this.props.submitCredentials(this.state.oldPassword, this.state.newPassword)
                        } />
                </Dialog.Container>
            </View>
        )
    }
}
