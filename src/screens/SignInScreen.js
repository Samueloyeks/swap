import React, { Fragment } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Button
} from 'react-native';
import * as firebase from 'react-native-firebase';
import loginImg from '../assets/imgs/loginImg.png'
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SocialBlock from '../components/SocialBlock'
import firebaseService from '../utils/firebase/FirebaseService';





const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(4, 'Password must have at least 4 characters ')
})



export default class SignInScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      isFocused: false,
      passwordShown:false
    }
  }


  handleEmailChange = email => {
    this.setState({ email })
  }

  handlePasswordChange = password => {
    this.setState({ password })
  }


  handleSubmit = async values => {
    this.setState({ loading: true })

    if (values.email.length > 0 && values.password.length > 0) {

      try {
        let fcmToken = await db.get('fcmToken');
        let deviceType = Platform.OS;

        values.fcmToken = fcmToken;
        values.deviceType = deviceType;
        api.post('/users/login', values).then((response) => {
          if (response.data) {
            var userData = {
              "email": response.data.data.email,
              "username": response.data.data.username,
              "fullName": response.data.data.fullName,
              "phoneNumber": response.data.data.phoneNumber,
              "uid": response.data.data.uid,
              "profilePicture": response.data.data.profilePicture
            }
            db.set('userData', userData).then(() => {
              this.setState({ loading: false })
              this.props.navigation.navigate('Main')
            })
          }
        }, err => {
          toast.show('Error Signing In')
          this.setState({ loading: false })
          console.log(err);
        }
        )
      } catch (ex) {
        toast.show('Error Signing In')
        this.setState({ loading: false })
        console.log(ex)
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
      // console.log(uData)

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

  togglePasswordVisibility(){
    this.setState({
      passwordShown:!this.state.passwordShown
    })
  }

  render() {
    return (
      <View style={{ backgroundColor: '#FFF', flex: 1, borderTopRightRadius: 35, height: '100%', alignItems: 'center' }}>
        <SafeAreaView style={{ flex: 1, width: '85%' }}>
          <Formik
            initialValues={{ email: '', password: '' }}
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
                        <Image source={loginImg} style={styles.loginImg} />
                        <Text style={styles.welcomeText}>Welcome!</Text>
                        <Text style={{ color: '#C4C4C4', padding: 5 }}>Log in to your swap account</Text>
                      </View>
                      {/* input */}
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


                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('ForgotPassword')}
                        style={{ alignSelf: 'flex-end' }}>
                        <Text style={{ color: '#FF9D5C' }}>Forgot Password?</Text>
                      </TouchableOpacity>

                      <FormButton
                        buttonType='outline'
                        onPress={handleSubmit}
                        title='Log In'
                        buttonColor='#FF9D5C'
                        disabled={!isValid}
                        loading={this.state.loading}
                      />

                      <View style={{ flexWrap: 'wrap', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ textAlignVertical: 'center', color: '#C4C4C4', paddingTop: 15 }}>or connect with</Text>
                      </View>

                      {/* social login */}
                      {/* <View style={{ flexWrap: 'wrap', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                        <TouchableOpacity >
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
                        <Text style={{ flexDirection: 'column', textAlignVertical: 'center' }}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')} style={{ display: 'flex' }}><Text style={{ color: '#FF9D5C' }}>Sign up</Text></TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 24
  },
  container: {
    width: '100%',
    flex: 0.7,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

}