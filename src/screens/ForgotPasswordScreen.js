import React, { Fragment } from 'react';
import {
    ActivityIndicator,
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import forgotPasswordImg from '../assets/imgs/forgotPasswordImg.png'
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




const validationSchema = Yup.object().shape({
    email: Yup.string()
        .label('Email')
        .email('Enter a valid email')
        .required('Please enter a registered email')
})



export default class ForgotPasswordScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loading: false,
            isFocused: false
        }
    }

    handleEmailChange = email => {
        this.setState({ email })
    }



    handleSubmit = values => {
        this.setState({ loading: true })

        if (values.email.length > 0) {

            try {
                api.post('/users/forgotPassword', values).then((response) => {
                    if (response.data) {
                        alert('Check your email for a password reset link')
                        this.props.navigation.navigate('SignIn')
                    }
                }, err => {
                    toast.show('Error Signing In')
                    console.log(err);
                    this.setState({ loading: false })
                }
                )
            } catch (ex) {
                toast.show('Error Signing In')
                this.setState({ loading: false })
                alert(ex)
            }

        }
    }


    render() {
        return (
            <View style={{ height: '100%', alignItems: 'center', paddingVertical: 20 }}>
                <View style={{ height: 20 }}></View>


                <ScrollView
                    style={{ flex: 1, width: '85%' }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                >
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
                                <Fragment>
                                    <View>
                                        <View style={styles.container}>
                                            <Image source={forgotPasswordImg} />
                                            <Text style={styles.welcomeText}>Forgot Password?</Text>
                                            <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                                                <Text style={{ color: '#C4C4C4' }}>No problem!</Text>
                                                <Text style={{ color: '#C4C4C4', textAlign: 'center' }}>
                                                    Just enter your email address and we’ll send you a password reset link
                                                            </Text>
                                            </View>
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

                                        <FormButton
                                            //  onPress={this.login.bind(this)} 
                                            buttonType='outline'
                                            onPress={handleSubmit}
                                            title='Reset'
                                            buttonColor='#FF9D5C'
                                            disabled={!isValid}
                                            loading={this.state.loading}
                                        />

                                    </View>
                                </Fragment>
                            )}
                    </Formik>
                </ScrollView>
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
        flex: 0.7,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
}