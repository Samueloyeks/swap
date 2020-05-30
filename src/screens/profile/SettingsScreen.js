import React, { Component } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, RefreshControl, FlatList, SafeAreaView, ListView, Text, Image, TouchableOpacity, Button, Input, StatusBar, Platform, Dimensions, BackHandler, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import demoAvatar from '../../assets/imgs/demoAvatar.png'
import itemImage from '../../assets/imgs/item.png'
import TimeAgo from 'react-native-timeago';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'
import { ListItem } from 'react-native-elements'
import AuthDialog from '../../components/AuthDialog'
import PasswordDialog from '../../components/PasswordDialog'
import EmailDialog from '../../components/EmailDialog'









export default class SettingsScreen extends Component {


    constructor(props) {
        super(props);

        this.state = {
            userData: null,
            isRefreshing: false,
            uid: '',
            fullName: '',
            username: '',
            email: '',
            phoneNumber: '',
            password: '',
            profilePicture: null,
            loading: false,
            isFocused: false,
            dialogVisible: false,
            passwordDialogVisible: false,
            emailDialogVisible: false,
            items: [
                {
                    title: 'Update Email',
                    function: this.updateEmail,
                    icon: 'email',
                    style: styles.itemTitle
                },
                {
                    title: 'Update Password',
                    function: this.updatePassword,
                    icon: 'lock',
                    style: styles.itemTitle

                },
                {
                    title: 'Delete Account',
                    function: this.requestDeleteConfirmation,
                    icon: 'delete',
                    style: styles.itemTitleRed

                },
            ]
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.setUserData = this.setUserData.bind(this);

    }



    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }



    async componentDidMount() {
        const { state } = await this.props.navigation;

        await this.setUserData();
        // console.log(JSON.stringify(this.state.userData))
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#FF9D5C',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerBackTitleVisible: false,
            headerTitle: () => <Text style={{ fontSize: 20 }}>Settings</Text>
        };
    };

    async setUserData() {
        return await db.get('userData').then(data => {
            let userData = JSON.parse(data)


            // this.setState({
            //     userData: JSON.parse(data)
            // })
            this.setState({
                userData: userData,
                uid: userData.uid,
                fullName: userData.fullName,
                email: userData.email,
                username: userData.username,
                phoneNumber: userData.phoneNumber,
                profilePicture: userData.profilePicture
            })


        })
    }

    requestDeleteConfirmation = () => {
        Alert.alert(
            "Do you want to delete this account?",
            "This action cannot be undone",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: 'destructive',
                    onPress: () => this.setState({ dialogVisible: true })

                },

            ],
            { cancelable: false }
        );
    }

    updateEmail = () => {
        this.setState({ emailDialogVisible: true })
    }

    updatePassword = () => {
        this.setState({ passwordDialogVisible: true })
    }


    handleCancel = () => {
        this.setState({ dialogVisible: false })
    }

    handlePasswordCancel = () => {
        this.setState({ passwordDialogVisible: false })
    }

    handleEmailCancel = () => {
        this.setState({ emailDialogVisible: false })
    }

    submitCredentials = (password) => {

        // if (email == '' || password == '') {
        //     alert('Please complete form')
        //     return;
        // }

        // if (!this.ValidateEmail(email)) {
        //     alert('Please enter a valid email')
        //     return;
        // }

        if (password.length < 6) {
            alert('Password must be at least 6 characters')
            return;
        }

        this.setState({
            dialogVisible: false,
            loading: true
        })

        let email = this.state.email;
        let data = {
            uid: this.state.uid,
            email,
            password,
        }


        api.post('/users/deleteAccount', data).then((response) => {
            if (response.data.status == 'success') {
                this.setState({ loading: false });

                this.props.navigation.popToTop()
                this.props.navigation.navigate('SignIn');
            } else {
                let message = response.data.message
                Alert.alert(
                    "Error deleting account",
                    message,
                    [
                        {
                            text: "OK",
                            style: "cancel"
                        }
                    ],
                    { cancelable: false }
                );
                this.setState({
                    loading: false
                })
            }
        })

    }

    submitPasswords = (oldPassword, newPassword) => {

        if (newPassword == '' || oldPassword == '') {
            alert('Please complete form')
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters')
            return;
        }

        this.setState({
            passwordDialogVisible: false,
            loading: true
        })

        let email = this.state.email;
        let data = {
            email,
            oldPassword,
            newPassword
        }

        api.post('/users/updatePassword', data).then((response) => {
            if (response.data.status == 'success') {
                this.setState({ loading: false });
                toast.show("Password Updated")
            } else {
                Alert.alert(
                    "Error updating password",
                    "Make sure you submitted the correct password",
                    [
                        {
                            text: "OK",
                            style: "cancel"
                        }
                    ],
                    { cancelable: false }
                );
                this.setState({
                    loading: false
                })
            }
        })
    }

    submitEmail = (newEmail, password) => {

        if (newEmail == '' || password == '') {
            alert('Please complete form')
            return;
        }

        if (!this.ValidateEmail(newEmail)) {
            alert('Please enter a valid email')
            return;
        }

        this.setState({
            emailDialogVisible: false,
            loading: true
        })

        let oldEmail = this.state.email;
        let data = {
            uid: this.state.uid,
            oldEmail,
            newEmail,
            password
        }


        api.post('/users/updateEmail', data).then((response) => {
            if (response.data.status == 'success') {
                this.setState({ loading: false });
                toast.show("Email Updated<br/>Please verify new email")
            } else {
                let message = response.data.message
                Alert.alert(
                    "Error updating email",
                    message,
                    [
                        {
                            text: "OK",
                            style: "cancel"
                        }
                    ],
                    { cancelable: false }
                );
                this.setState({
                    loading: false
                })
            }
        })

    }

    ValidateEmail = (inputText) => {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (inputText.match(mailformat)) {
            return true;
        }
        else {
            return false;
        }
    }


    render() {
        return (
            <View>
                {
                    this.state.loading ?
                        <View style={{ padding: 20 }}>
                            <ActivityIndicator size="large" />
                        </View>
                        :
                        this.state.items.map((l, i) => (
                            <ListItem
                                key={i}
                                leftIcon={{ name: l.icon }}
                                title={l.title}
                                onPress={l.function}
                                titleStyle={l.style}
                                bottomDivider
                            />
                        ))
                }
                <AuthDialog
                    handleCancel={this.handleCancel}
                    submitCredentials={this.submitCredentials}
                    visible={this.state.dialogVisible}
                />
                <PasswordDialog
                    handleCancel={this.handlePasswordCancel}
                    submitCredentials={this.submitPasswords}
                    visible={this.state.passwordDialogVisible}
                />
                <EmailDialog
                    handleCancel={this.handleEmailCancel}
                    submitCredentials={this.submitEmail}
                    visible={this.state.emailDialogVisible}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemTitle: {
        fontSize: 15
    },
    itemTitleRed: {
        fontSize: 15,
        color: 'red'
    }
})
