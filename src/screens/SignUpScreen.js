import React, { Fragment } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Button,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  KeyboardAvoidingViewBase,
  Platform,
  ActivityIndicator
} from 'react-native';
import facebookImg from '../assets/imgs/facebookImg.png'
import googleImg from '../assets/imgs/googleImg.png'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import api from '../utils/api/ApiService'
import db from '../utils/db/Storage'
import toast from '../utils/SimpleToast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SocialBlock from '../components/SocialBlock'
import firebaseService from '../utils/firebase/FirebaseService';



const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .label('Full Name')
    .required(),
  username: Yup.string()
    .label('Username')
    .required(),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
    .label('Phone Number')
    .required()
    .min(11),
  password: Yup.string()
    .label('Password')
    .required()
    .min(4, 'Password must have at least 4 characters ')
})



export default class SignUpScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      loading: false,
      isFocused: false,
      usernameTaken: false,
      checkingAvailability:false,
      passwordShown:false
    }
  }

  handleSubmit =async values => {

    if(this.state.usernameTaken){
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

    if(this.state.checkingAvailability){
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
    if (values.email.length > 0 && values.password.length > 0) {

      try {
        let fcmToken = await db.get('fcmToken');
        let deviceType = Platform.OS;

        values.fcmToken = fcmToken;
        values.deviceType = deviceType;
        values.profilePicture = null
        api.post('/users/register', values).then((response) => {
          if (response.data) {
            var userData = {
              "email": response.data.data.email,
              "username": response.data.data.username,
              "fullName": response.data.data.fullName,
              "phoneNumber": response.data.data.phoneNumber,
              "uid": response.data.data.uid,
              "profilePicture": response.data.data.profilePicture,
            }
            db.set('userData', userData).then(() => {
              Alert.alert(
                "Important",
                "Please check your email to verify your account",
                [
                  {
                    text: "Ok",
                    style: "cancel"
                  },  
                ],
                { cancelable: false }
              );
              this.setState({ loading: false })
              this.props.navigation.navigate('Main')
            })
          }
        }, err => {
          this.setState({ loading: false })
          toast.show('Error Signing Up')
        }
        )
      } catch (ex) {
        this.setState({ loading: false })
        toast.show('Error Signing Up')
      }

    }
  }

  _handleFacebookSubmit = async () => {
    const { navigation } = this.props;

    this.setState({ loading: true });
    try {
      const uData = await firebaseService.facebookAuth()

      if (uData == false) {
        this.setState({ loading: false });
        toast.show('Error Signing Up')
        return;
      }

      var userData = {
        "email": uData.email,
        "username": uData.username,
        "fullName": uData.fullName,
        "phoneNumber": uData.phoneNumber,
        "uid": uData.uid,
        "profilePicture": uData.profilePicture
      }

      db.set('userData', userData).then(() => {
        this.setState({ loading: false })
        navigation.navigate('Main')
      })

    } catch (err) {
      this.setState({ loading: false });
      toast.show(err.message);
    }
  };

  _handleGoogleSubmit = async () => {
    const { navigation } = this.props;

    this.setState({ loading: true });
    try {
      const uData = await firebaseService.googleAuth()

      if (uData == false) {
        this.setState({ loading: false });
        toast.show('Error Signing Up')
        return;
      }

      var userData = {
        "email": uData.email,
        "username": uData.username,
        "fullName": uData.fullName,
        "phoneNumber": uData.phoneNumber,
        "uid": uData.uid,
        "profilePicture": uData.profilePicture
      }

      db.set('userData', userData).then(() => {
        this.setState({ loading: false })
        navigation.navigate('Main')
      })

    } catch (err) {
      this.setState({ loading: false });
      toast.show(err.message);
    }
  };

  _scrollToInput(reactNode) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

  checkingAvailability(username) {
    this.setState({
      username,
      usernameTaken: false,
      checkingAvailability:true
    });

    let data = {
      username: username,
      uid:null
    }

    api.post('/users/isUsernameTaken', data).then((response) => {

      if (response.data.status) {
        this.setState({ 
          usernameTaken: true,
          checkingAvailability:false
         })
      } else {
        this.setState({ 
          usernameTaken: false,
          checkingAvailability:false 
        })
      }

    })
  }

  togglePasswordVisibility(){
    this.setState({
      passwordShown:!this.state.passwordShown
    })
  }

  render() {
    return (
      <View style={{ backgroundColor: '#FFF', flex: 1, borderTopRightRadius: 35, height: '100%', alignItems: 'center' }}>
          <View style={{ height: 20 }}></View>
          <SafeAreaView
            style={{ flex: 1, width: '85%' }}>
            <Formik
              initialValues={{ fullName: '', username: '', email: '', phoneNumber: '', password: '' }}
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
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                  <View>
                    <KeyboardAvoidingView enabled>
                      <View style={styles.container}>
                        <Text style={styles.welcomeText}>Let's get started!</Text>
                        <Text style={{ color: '#C4C4C4' }}>Create an account and start swapping today!</Text>
                      </View>
                      {/* input */}
                      <FormInput
                        name='fullName'
                        value={values.fullName}
                        onChangeText={handleChange('fullName')}
                        autoCapitalize='none'
                        iconName='accessibility'
                        iconColor='#2C384A'
                        placeholder='Full Name'
                        onBlur={handleBlur('fullName')}
                      />
                      <ErrorMessage errorValue={touched.fullName && errors.fullName} />
                      <FormInput
                        name='username'
                        value={values.username = this.state.username}
                        onChangeText={(username) => this.checkingAvailability(username)}
                        autoCapitalize='none'
                        iconName='face'
                        iconColor='#2C384A'
                        placeholder='Username'
                        onBlur={handleBlur('username')}
                      />
                      {this.state.checkingAvailability ?
                        <ActivityIndicator/>:null}
                      {this.state.usernameTaken && !this.state.checkingAvailability ?
                        <ErrorMessage errorValue='Username is taken' />
                        :
                        null
                      }
                      <ErrorMessage errorValue={touched.username && errors.username} />
                      <FormInput
                        name='email'
                        value={values.email}
                        onChangeText={handleChange('email')}
                        autoCapitalize='none'
                        iconName='email'
                        iconColor='#2C384A'
                        keyboardType='email-address'
                        placeholder='Email'
                        onBlur={handleBlur('email')}
                      />
                      <ErrorMessage errorValue={touched.email && errors.email} />
                      <FormInput
                        name='phoneNumber'
                        value={values.phoneNumber}
                        onChangeText={handleChange('phoneNumber')}
                        autoCapitalize='none'
                        iconName='phone'
                        iconColor='#2C384A'
                        keyboardType='phone-pad'
                        placeholder='Phone Number'
                        onBlur={handleBlur('phoneNumber')}
                      />
                      <ErrorMessage errorValue={touched.phoneNumber && errors.phoneNumber} />
                      <FormInput
                        name='password'
                        value={values.password}
                        onChangeText={handleChange('password')}
                        autoCapitalize='none'
                        secureTextEntry={!this.state.passwordShown}
                        iconName='lock'
                        rightIconName={this.state.passwordShown?'md-eye':'md-eye-off'}
                        rightIconFunction={()=>this.togglePasswordVisibility()}
                        iconColor='#2C384A'
                        placeholder='Password'
                        onBlur={handleBlur('password')}
                      />
                      <ErrorMessage errorValue={touched.password && errors.password} />

                      <FormButton
                        buttonType='outline'
                        onPress={handleSubmit}
                        title='Sign Up'
                        buttonColor='#FF9D5C'
                        disabled={!isValid}
                        loading={this.state.loading}
                      />


                      {/* social signup */}
                      {/* <View style={{ flexWrap: 'wrap', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                        <TouchableOpacity onPress={this.handleTestSubmit}>
                          <View style={{ width: 40, height: 40 }}>
                            <Image source={facebookImg}></Image>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <View style={{ width: 40, height: 40 }}>
                            <Image source={googleImg}></Image>
                          </View>
                        </TouchableOpacity>
                      </View> */}
                                            <SocialBlock
                        handleFacebookSubmit={this._handleFacebookSubmit}
                        handleGoogleSubmit={this._handleGoogleSubmit}
                      >
                      </SocialBlock>

                      {/* signup page */}
                      <View style={{ flexWrap: 'wrap', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                        <Text style={{ flexDirection: 'column', textAlignVertical: 'center' }}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')} style={{ display: 'flex' }}><Text style={{ color: '#FF9D5C' }}>Log In</Text></TouchableOpacity>
                      </View>

                    </KeyboardAvoidingView>
                    </View>
                    </ScrollView>
                )}
            </Formik>
          </SafeAreaView>
        </View>
    )
  }
}

const styles = {
  welcomeText: {
    // paddingTop: 20,
    paddingBottom: 10,
    fontSize: 24
  },
  container: {
    width: '100%',
    // marginTop: 60,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}