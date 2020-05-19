import React, { Fragment } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import FormInput from '../../components/FormInput'
import FormButton from '../../components/FormButton'
import ErrorMessage from '../../components/ErrorMessage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageModal from 'react-native-image-modal';
import demoAvatar from '../../assets/imgs/demoAvatar.png'


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




export default class EditProfileScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            username: '',
            email: '',
            phoneNumber: '',
            password: '',
            loading: false,
            isFocused: false
        }
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

    handleSubmit = values => {
        if (values.email.length > 0 && values.password.length > 0) {
            setTimeout(() => {
                this.props.navigation.navigate('Main')
            }, 3000)
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: '100%', flex: 1 }}>
                    <View style={styles.coloredHeader}>
                        <View style={styles.avatarContainer}>
                            <ImageModal
                                swipeToDismiss={true}
                                resizeMode="contain"
                                source={demoAvatar}
                                style={styles.avatar}
                            />
                        </View> 
                        <TouchableOpacity  style={styles.editButton} onPress={()=>alert('done')}>
                                <View>
                                    <Icon name="pencil" color="#FF9D5C" size={30} style={styles.editIcon} />
                                </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: '100%', alignItems: 'center', paddingTop: 60 }}>

                        <SafeAreaView style={{ flex: 1, width: '85%' }}>
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
                                        <Fragment>
                                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                                                <View>
                                                    {/* input */}
                                                    <FormInput
                                                        name='fullName'
                                                        value={values.fullName}
                                                        onChangeText={handleChange('fullName')}
                                                        autoCapitalize='none'
                                                        keyboardType='text'
                                                        placeholder='Full Name'
                                                        onBlur={handleBlur('fullName')}
                                                    />
                                                    <ErrorMessage errorValue={touched.fullName && errors.fullName} />
                                                    <FormInput
                                                        name='username'
                                                        value={values.username}
                                                        onChangeText={handleChange('username')}
                                                        autoCapitalize='none'
                                                        placeholder='Username'
                                                        onBlur={handleBlur('username')}
                                                    />
                                                    <ErrorMessage errorValue={touched.username && errors.username} />
                                                    <FormInput
                                                        name='email'
                                                        value={values.email}
                                                        onChangeText={handleChange('email')}
                                                        autoCapitalize='none'
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
                                                        keyboardType='phone'
                                                        placeholder='Phone Number'
                                                        onBlur={handleBlur('phoneNumber')}
                                                    />
                                                    <ErrorMessage errorValue={touched.phoneNumber && errors.phoneNumber} />
                                                    <FormInput
                                                        name='password'
                                                        value={values.password}
                                                        onChangeText={handleChange('password')}
                                                        autoCapitalize='none'
                                                        secureTextEntry
                                                        placeholder='Password'
                                                        onBlur={handleBlur('password')}
                                                    />
                                                    <ErrorMessage errorValue={touched.password && errors.password} />

                                                    <FormButton
                                                        buttonType='outline'
                                                        onPress={handleSubmit}
                                                        title='Save'
                                                        buttonColor='#FF9D5C'
                                                        disabled={!isValid || isSubmitting}
                                                        loading={isSubmitting}
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
        bottom: -10
    },
    avatar: {
        alignSelf: 'center'
    },
    editIcon: {
        padding:3
    },
    editButton: {
        backgroundColor:'black',
        bottom :-20,
        zIndex:1,
        right:'33%',
        borderRadius:50,
        position:'absolute'
    }
}