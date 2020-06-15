import React, { Fragment } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native';
import UploadFormInput from '../../components/UploadFormInput'
import FormButton from '../../components/FormButton'
import ErrorMessage from '../../components/ErrorMessage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MultiSelect from 'react-native-multiple-select';
import ImagePicker from 'react-native-image-crop-picker';
import ImageModal from 'react-native-image-modal';
import TagInput from 'react-native-tags-input';
import api from '../../utils/api/ApiService'
import db from '../../utils/db/Storage'
import toast from '../../utils/SimpleToast'
import ActionSheet from 'react-native-actionsheet'
import tracking from '../../utils/geolocation/Tracking'
import { EventRegister } from 'react-native-event-listeners'








const validationSchema = Yup.object().shape({
    title: Yup.string()
        .label('Title')
        .required(),
    description: Yup.string()
        .label('Description')
        .required(),
    quantity: Yup.number()
        .integer()
        .label('Quantity')
})



export default class UploadScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            title: '',
            description: '',
            quantity: '',
            price: '',
            loading: false,
            isFocused: false,
            selectedItems: [],
            categories: [],
            imageIndex: 1,
            selected: null,
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            tags: {
                tag: '',
                tagsArray: []
            },
        }
    }

    componentDidMount() {
        this.getCategories();
        this.setUserData();
    }

    getCategories = () => {
        api.get('/categories/getCategories').then((response) => {
            this.setState({
                categories: response.data.data
            })
        })
    }

    setUserData() {
        db.get('userData').then(data => {
            this.setState({
                userData: JSON.parse(data)
            })
        })
    }



    handleSubmit = values => {
        this.setState({ loading: true });

        if (!this.state.image1 ||
            !this.state.image2 ||
            !this.state.image3 ||
            !this.state.image4) {
            toast.show('You must add up to 4 images')
            this.setState({ loading: false })
            return;
        }

        if (this.state.selectedItems.length == 0) {
            toast.show('You must select at least 1 category')
            this.setState({ loading: false })
            return;
        }

        const encodedImages = {
            images: [
                { image: this.state.image1.data },
                { image: this.state.image2.data },
                { image: this.state.image3.data },
                { image: this.state.image4.data },
            ]
        }

        EventRegister.emit('uploading', true)

        try{
            api.post('/services/multipleUpload', encodedImages).then(response => {

                if(response.status == 200){
                    tracking.getLocation().then(data => {
    
                        let location = {
                            longitude:data.coords.longitude,
                            latitude:data.coords.latitude
                        }
                      
                        const item = {
                            categories: this.state.selectedItems,
                            images: response.data.data.urls,
                            preferences: this.state.tags.tagsArray,
                            postedby: this.state.userData.uid,
                            location:location,
                            ...values
                        } 
            
                        api.post('/items/uploadItem', item).then((response) => {
                            if (response.status == 200) {
                                EventRegister.emit('uploading', false)
                                toast.show('Item Uploaded');
                            }else{
                                EventRegister.emit('uploading', false)
                                toast.show('Error uploading Item');      
                            }
                        }) 
        
                    })
                }else{
                    EventRegister.emit('uploading', false)
                    toast.show('Error uploading Item');   
                }
            })
        }catch(ex){
            console.log(ex)
            EventRegister.emit('uploading', false)
            toast.show('Error uploading Item'); 
        }
        this.props.navigation.navigate('Explore')

    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };

    selectGalleryImages = (index) => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            multiple: true,
            title: 'Select a Picture',
            maxFiles: 4,
            includeBase64: true,
            writeTempFile: true,
            avoidEmptySpaceAroundImage: true,
            loadingLabelText: 'Loading Images...',
            showsSelectedCount: true
        }).then(images => {
            var i = 0;
            while (i < images.length && index <= 4) {
                if (!this.state["image" + [index]]) {
                    this.setState({
                        ["image" + [index]]: images[i]
                    })
                    i++
                }
                index++;
            }
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
                ["image" + [index]]: image 
            })
        });
    }

    removeImage = (index) => {
        this.setState({
            ["image" + [index]]: null
        })
    }

    updateTagState = (state) => {
        this.setState({
            tags: state
        })
    };

    showActionSheet = (imageIndex) => {
        this.setState({ imageIndex },()=>{
            this.ActionSheet.show()
        })
    }

    getImageFrom(index) {
        let imageIndex = this.state.imageIndex;

        if (index === 0) {
            this.selectCameraImage(imageIndex)
        }
        if (index === 1) {
            this.selectGalleryImages(imageIndex)
        }
    }

    render() {
        const { selectedItems } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: '100%', flex: 1 }}>

                    <View style={{ height: '100%', alignItems: 'center' }}>

                        <ScrollView style={{ flex: 1, width: '85%' }} showsVerticalScrollIndicator={false}>
                            <Formik
                                initialValues={{ title: '', description: '', quantity: '', price: '' }}
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
                                            {/* <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'> */}
                                            <View>
                                                {/* input */}
                                                <UploadFormInput
                                                    name='title'
                                                    value={values.title}
                                                    onChangeText={handleChange('title')}
                                                    autoCapitalize='none'
                                                    iconName='asterisk'
                                                    iconColor='#CD2900'
                                                    placeholder='Title'
                                                    onBlur={handleBlur('title')}
                                                />
                                                <ErrorMessage errorValue={touched.title && errors.title} />

                                                <View style={{ flexDirection: 'row', marginHorizontal: 25 }}>
                                                    <Icon name="asterisk" color="#CD2900" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                                                    <Text style={{ fontSize: 17, padding: 10 }}>Categories</Text>
                                                </View>

                                                <MultiSelect
                                                    items={this.state.categories}
                                                    uniqueKey="id"
                                                    ref={(component) => { this.multiSelect = component }}
                                                    onSelectedItemsChange={this.onSelectedItemsChange}
                                                    selectedItems={selectedItems}
                                                    selectText="Select Categories"
                                                    searchInputPlaceholderText="Search Categories..."
                                                    onChangeInput={(text) => console.log(text)}
                                                    tagRemoveIconColor="#CD2900"
                                                    tagBorderColor="#CCC"
                                                    tagTextColor="#FF9D5C"
                                                    selectedItemTextColor="#FF9D5C"
                                                    selectedItemIconColor="#FF9D5C"
                                                    itemTextColor="#FF9D5C"
                                                    displayKey="category"
                                                    searchInputStyle={{ color: 'black' }}
                                                    submitButtonColor="#FF9D5C"
                                                    submitButtonText="Done"
                                                    styleInputGroup={{ backgroundColor: 'transparent', paddingRight: 20 }}
                                                    styleItemsContainer={{ backgroundColor: 'transparent' }}
                                                    styleMainWrapper={styles.categoryMainWrapper}
                                                    styleTextDropdown={{ paddingLeft: 50, fontSize: 17, color: '#C4C4C4' }}
                                                    styleDropdownMenu={{ backgroundColor: 'transparent' }}
                                                    styleTextDropdownSelected={{ paddingLeft: 50 }}
                                                />
                                                <View>
                                                    {() => this.multiSelect.getSelectedItemsExt(selectedItems)}
                                                </View>
                                                <UploadFormInput
                                                    name='description'
                                                    value={values.description}
                                                    onChangeText={handleChange('description')}
                                                    autoCapitalize='none'
                                                    iconName='asterisk'
                                                    iconColor='#CD2900'
                                                    placeholder='Description'
                                                    onBlur={handleBlur('description')}
                                                    containerStyle={styles.description}
                                                />
                                                <ErrorMessage errorValue={touched.description && errors.description} />
                                                <UploadFormInput
                                                    name='quantity'
                                                    value={values.quantity}
                                                    onChangeText={handleChange('quantity')}
                                                    autoCapitalize='none'
                                                    iconColor='#CD2900'
                                                    placeholder='Quantity'
                                                    onBlur={handleBlur('quantity')}
                                                />

                                                <UploadFormInput
                                                    name='price'
                                                    value={values.price}
                                                    onChangeText={handleChange('price')}
                                                    autoCapitalize='none'
                                                    iconColor='#CD2900'
                                                    placeholder='Price'
                                                    onBlur={handleBlur('price')}
                                                    style={{ marginBottom: 20 }}
                                                />
                                                <View style={{ flexDirection: 'row', marginHorizontal: 25 }}>
                                                    <Icon name="asterisk" color="#CD2900" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                                                    <Text style={{ fontSize: 17, padding: 10 }}>Attach Images</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                                    <View style={styles.imgContainer}>
                                                        {
                                                            (!this.state.image1) ?
                                                                <TouchableOpacity onPress={() =>this.showActionSheet(1)}>
                                                                    <Icon name="camera" size={20} />
                                                                </TouchableOpacity> :
                                                                <View style={styles.imgContainer}>
                                                                    <ImageModal
                                                                        style={{ width: 100, height: 100 }}
                                                                        swipeToDismiss={true}
                                                                        source={{ uri: this.state.image1.path }}
                                                                    />
                                                                    <TouchableOpacity style={styles.removeImage} onPress={() => this.removeImage(1)}>
                                                                        <MIcon name="cancel" color="#FE3939" size={30} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                        }

                                                    </View>
                                                    <View style={styles.imgContainer}>
                                                        {
                                                            (!this.state.image2) ?
                                                                <TouchableOpacity onPress={() => this.showActionSheet(2)}>
                                                                    <Icon name="camera" size={20} />
                                                                </TouchableOpacity> :
                                                                <View style={styles.imgContainer}>
                                                                    <ImageModal
                                                                        style={{ width: 100, height: 100 }}
                                                                        swipeToDismiss={true}
                                                                        source={{ uri: this.state.image2.path }}
                                                                    />
                                                                    <TouchableOpacity style={styles.removeImage} onPress={() => this.removeImage(2)}>
                                                                        <MIcon name="cancel" color="#FE3939" size={30} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                        }
                                                    </View>
                                                    <View style={styles.imgContainer}>
                                                        {
                                                            (!this.state.image3) ?
                                                                <TouchableOpacity onPress={() => this.showActionSheet(3)}>
                                                                    <Icon name="camera" size={20} />
                                                                </TouchableOpacity> :
                                                                <View style={styles.imgContainer}>
                                                                    <ImageModal
                                                                        style={{ width: 100, height: 100 }}
                                                                        swipeToDismiss={true}
                                                                        source={{ uri: this.state.image3.path }}
                                                                    />
                                                                    <TouchableOpacity style={styles.removeImage} onPress={() => this.removeImage(3)}>
                                                                        <MIcon name="cancel" color="#FE3939" size={30} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                        }
                                                    </View>
                                                    <View style={styles.imgContainer}>
                                                        {
                                                            (!this.state.image4) ?
                                                                <TouchableOpacity onPress={() => this.showActionSheet(4)}>
                                                                    <Icon name="camera" size={20} />
                                                                </TouchableOpacity> :
                                                                <View style={styles.imgContainer}>
                                                                    <ImageModal
                                                                        style={{ width: 100, height: 100 }}
                                                                        swipeToDismiss={true}
                                                                        source={{ uri: this.state.image4.path }}
                                                                    />
                                                                    <TouchableOpacity style={styles.removeImage} onPress={() => this.removeImage(4)}>
                                                                        <MIcon name="cancel" color="#FE3939" size={30} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                        }
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginHorizontal: 25 }}>
                                                    <Text style={{ fontSize: 17, padding: 10 }}>Prefer to Exchange</Text>
                                                </View>

                                                <View style={styles.container}>
                                                    <TagInput
                                                        updateState={this.updateTagState}
                                                        tags={this.state.tags}
                                                        containerStyle={{ width: (Dimensions.get('window').width - 40) }}
                                                        inputContainerStyle={styles.defaultInput}
                                                        inputStyle={{ color: this.state.tagsText }}
                                                        onFocus={() => this.setState({ tagsColor: '#fff', tagsText: "black" })}
                                                        onBlur={() => this.setState({ tagsColor: 'black', tagsText: '#fff' })}
                                                        autoCorrect={false}
                                                        tagStyle={styles.tag}
                                                        tagTextStyle={styles.tagText}
                                                    />
                                                </View>
                                                <FormButton
                                                    buttonType='outline'
                                                    onPress={handleSubmit}
                                                    title='Upload'
                                                    buttonColor='#FF9D5C'
                                                    disabled={!isValid || this.state.loading}
                                                    loading={this.state.loading}
                                                />

                                                <View style={{ height: 200 }}>

                                                </View>
                                            </View>
                                            {/* </ScrollView> */}
                                        </Fragment>
                                    )}
                            </Formik>
                        </ScrollView>
                    </View>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Select Image From'}
                    options={['Camera', 'Gallery', 'cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => this.getImageFrom(index)}
                />
            </View>
        )
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "transparent",
    },
    textInput: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginTop: 8,
        borderRadius: 5,
        padding: 3,
    },
    categoryMainWrapper: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 25,
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 25,
        overflow: 'hidden',
    },
    description: {
        borderStyle: 'solid',
        overflow: 'hidden',
        paddingTop: 3,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 25,
        backgroundColor: '#FFF',
        height: 100,
    },
    imgContainer: {
        width: 70,
        height: 70,
        borderColor: 'lightgrey',
        borderWidth: 0.5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        overflow: 'hidden'
    },
    removeImage: {
        top: 0,
        right: 0,
        position: 'absolute',
        zIndex: 3,
    },
    tag: {
        backgroundColor: 'transparent',
        borderColor: 'lightgrey',
        borderWidth: 0.5,
    },
    tagText: {
        color: '#FF9D5C'
    },
    defaultInput: {
        borderStyle: 'solid',
        overflow: 'hidden',
        paddingTop: 3,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 25,
        height: 45,
        backgroundColor: '#FFF',
        padding: 10
    }
}