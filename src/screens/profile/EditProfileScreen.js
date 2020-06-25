import React, { Fragment } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import FormInput from '../../components/FormInput'
import FormButton from '../../components/FormButton'
import ErrorMessage from '../../components/ErrorMessage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import demoAvatar from '../../assets/imgs/demoAvatar.png'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'




const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
    fullName: Yup.string()
        .label('Full Name')
        .required(),
    username: Yup.string()
        .label('Username')
        .required(),
    // email: Yup.string()
    //     .label('Email')
    //     .email('Enter a valid email')
    //     .required('Please enter a registered email'),
    phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
        .label('Phone Number')
        .required()
        .min(11),
    // password: Yup.string()
    //     .label('Password')
    //     .required()
    //     .min(4, 'Password must have at least 4 characters ')
})




export default class EditProfileScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            uid: '',
            fullName: '',
            username: '',
            email: '',
            phoneNumber: '',
            password: '',
            usernameTaken: false,
            profilePicture: null,
            profilePictureData: null,
            imgUrl: null,
            loading: false,
            isFocused: false,
            checkingAvailability: false
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

        // console.log(state.params.userData)
        let userData = await state.params.userData
        this.setState({
            userData: userData,
            uid: userData.uid,
            fullName: userData.fullName,
            username: userData.username,
            phoneNumber: userData.phoneNumber,
            profilePicture: userData.profilePicture == undefined ? null : userData.profilePicture,
            imgUrl: userData.profilePicture == undefined ? null : userData.profilePicture
        })
        // await this.setUserData();
    }

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
                username: userData.username,
                phoneNumber: userData.phoneNumber,
                profilePicture: userData.profilePicture == undefined ? null : userData.profilePicture
            })


        })
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
            headerTitle: () => null
        };
    };

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    getImageFrom(index) {
        // let imageIndex = this.state.imageIndex
        if (index === 0) {
            this.selectCameraImage()
        }
        if (index === 1) {
            this.selectGalleryImages()
        }
        if (index === 2) {
            // this.selectGalleryImages()
            this.removeImage()
        }
    }

    removeImage = () => {
        this.setState({
            profilePicture: null,
            profilePictureData: null
        })
    }

    selectGalleryImages = (index) => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            multiple: false,
            title: 'Select a Picture',
            includeBase64: true,
            writeTempFile: true,
            avoidEmptySpaceAroundImage: true,
            loadingLabelText: 'Loading Images...',
            showsSelectedCount: true
        }).then(image => {
            this.setState({
                profilePicture: image.path,
                profilePictureData: image.data
            })
        });
    }

    selectCameraImage = (index) => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
            writeTempFile: true,
            avoidEmptySpaceAroundImage: true,
            loadingLabelText: 'Loading Images...',
            showsSelectedCount: true
        }).then(image => {
            this.setState({
                profilePicture: image.path,
                profilePictureData: image.data
            })
        });
    }

    handleSubmit = values => {

        if (this.state.usernameTaken) {
            Alert.alert(
                "Chnage Username",
                "The username you provided is not available",
                [
                    {
                        text: "Ok",
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            );
            return;
        }

        if (this.state.checkingAvailability) {
            Alert.alert(
                " ",
                `Please wait while we check if ${this.state.username} is available`,
                [
                    {
                        text: "Ok",
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            );
            return;
        }

        this.setState({ loading: true })

        try {
            values.profilePicture = {
                image: this.state.profilePictureData,
                imageUrl: this.state.profilePicture
            }
            values.uid = this.state.uid;

            api.post('/users/update', values).then((response) => {
                if (response.data.status == 'success') {

                    if (this.state.profilePictureData) {
                        let data = {
                            imageUrl: this.state.imgUrl
                        }
                        api.post('/services/deleteImage', data);
                    }

                    this.setState({ loading: false })
                    this.props.navigation.goBack(null);
                    this.props.navigation.state.params.onGoBack();

                }
            }, err => {
                toast.show('Error Updating Details')
                console.log(err);
                this.setState({ loading: false })
            }
            )
        } catch (ex) {
            toast.show('Error Updating Details')
            this.setState({ loading: false })
            alert(ex)
        }
    }


    checkAvailability(username) {
        this.setState({
            username,
            usernameTaken: false,
            checkingAvailability: true
        });

        let data = {
            username: username,
            uid: this.state.userData.uid
        }

        api.post('/users/isUsernameTaken', data).then((response) => {

            if (response.data.status) {
                this.setState({
                    usernameTaken: true,
                    checkingAvailability: false
                })
            } else {
                this.setState({
                    usernameTaken: false,
                    checkingAvailability: false
                })
            }

        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: '100%', flex: 1 }}>
                    <View style={styles.coloredHeader}>
                        <View style={styles.avatarContainer}>
                            <ImageModal
                                swipeToDismiss={true}
                                resizeMode='contain'
                                source={this.state.profilePicture ? ({ uri: this.state.profilePicture }) : demoAvatar}
                                style={styles.avatar}
                            />
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={() => this.showActionSheet()}>
                            <View>
                                <Icon name="pencil" color="#FF9D5C" size={30} style={styles.editIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: '100%', alignItems: 'center', paddingTop: 60 }}>

                        <SafeAreaView style={{ flex: 1, width: '85%' }}>
                            <Formik
                                initialValues={{
                                    fullName: this.state.fullName,
                                    username: this.state.username,
                                    // email: '', 
                                    phoneNumber: this.state.phoneNumber,
                                    //  password: '' 
                                }}
                                onSubmit={values => { this.handleSubmit(values) }}
                                validationSchema={validationSchema}
                            >
                                {({ handleChange,
                                    values,
                                    handleSubmit,
                                    errors,
                                    isValid,
                                    isSubmitting,
                                    touched,
                                    handleBlur
                                }) => (
                                        <Fragment>
                                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                                                <View>
                                                    {/* input */}
                                                    <FormInput
                                                        name='fullName'
                                                        value={values.fullName = this.state.fullName}
                                                        onChangeText={(fullName) => this.setState({ fullName: fullName })}
                                                        autoCapitalize='none'
                                                        placeholder='Full Name'
                                                        onBlur={handleBlur('fullName')}
                                                    />
                                                    <ErrorMessage errorValue={touched.fullName && errors.fullName} />
                                                    <FormInput
                                                        name='username'
                                                        value={values.username = this.state.username}
                                                        onChangeText={(username) => this.checkAvailability(username)}
                                                        // onChangeText={(username) => this.setState({ username })}
                                                        autoCapitalize='none'
                                                        placeholder='Username'
                                                        onBlur={handleBlur('username')}
                                                    />
                                                    {this.state.checkingAvailability ?
                                                        <ActivityIndicator /> : null}
                                                    {this.state.usernameTaken && !this.state.checkingAvailability ?
                                                        <ErrorMessage errorValue='Username is taken' />
                                                        :
                                                        null
                                                    }
                                                    <ErrorMessage errorValue={touched.username && errors.username} />
                                                    {/* <FormInput
                                                        name='email'
                                                        value={values.email}
                                                        onChangeText={handleChange('email')}
                                                        autoCapitalize='none'
                                                        keyboardType='email-address'
                                                        placeholder='Email'
                                                        onBlur={handleBlur('email')}
                                                    />
                                                    <ErrorMessage errorValue={touched.email && errors.email} /> */}
                                                    <FormInput
                                                        name='phoneNumber'
                                                        value={values.phoneNumber = this.state.phoneNumber}
                                                        onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                                        autoCapitalize='none'
                                                        keyboardType='phone-pad'
                                                        placeholder='Phone Number'
                                                        onBlur={handleBlur('phoneNumber')}
                                                    />
                                                    <ErrorMessage errorValue={touched.phoneNumber && errors.phoneNumber} />
                                                    {/* <FormInput
                                                        name='password'
                                                        value={values.password}
                                                        onChangeText={handleChange('password')}
                                                        autoCapitalize='none'
                                                        secureTextEntry
                                                        placeholder='Password'
                                                        onBlur={handleBlur('password')}
                                                    />
                                                    <ErrorMessage errorValue={touched.password && errors.password} /> */}

                                                    <FormButton
                                                        buttonType='outline'
                                                        onPress={handleSubmit}
                                                        title='Save'
                                                        buttonColor='#FF9D5C'
                                                        disabled={!isValid || this.state.loading}
                                                        loading={this.state.loading}
                                                    />

                                                    <View style={{ height: 180 }}>

                                                    </View>
                                                </View>
                                            </ScrollView>
                                        </Fragment>
                                    )}
                            </Formik>
                        </SafeAreaView>
                    </View>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Select Image From'}
                    options={['Camera', 'Gallery', 'Remove Image', 'cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => this.getImageFrom(index)}
                />
            </View>
        )
    }
}

const styles = {
    coloredHeader: {
        backgroundColor: '#FF9D5C',
        alignItems: 'center',
        height: 100,
    },
    avatarContainer: {
        overflow: 'hidden',
        borderRadius: 500,
        justifyContent: 'center',
        alignItems: 'center',
        height: 130,
        width: 130,
        bottom: -10,
        backgroundColor: 'grey'
    },
    avatar: {
        // alignSelf: 'center',
        height: 130,
        width: 130
    },
    editIcon: {
        padding: 3
    },
    editButton: {
        backgroundColor: 'black',
        // bottom: -10,
        zIndex: 3,
        right: '33%',
        borderRadius: 50,
        position: 'absolute'
    }
}