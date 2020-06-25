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
import { HeaderBackButton } from 'react-navigation-stack';
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



export default class EditItemScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
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
            imageData1: null,
            imageData2: null,
            imageData3: null,
            imageData4: null,
            tags: {
                tag: '',
                tagsArray: []
            },
            itemDetails: null

        }
    }

    static navigationOptions = ({ navigation }) => {

        return {
            title: ``,
            headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
            headerBackTitleVisible: false,
            headerStyle: {
                backgroundColor: '#FF9D5C',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerLeft: () => <HeaderBackButton onPress={() => {
                navigation.goBack(null);
            }
            } />,
        }
    }

    async componentDidMount() {
        const { state } = await this.props.navigation;
        let selectedCategories = state.params.itemDetails.categories;
        let selectedCategoryIndices = [];
        for (var key in selectedCategories) {
            let selectedCategory = selectedCategories[key]
            selectedCategoryIndices.push(selectedCategory.id)
        }
        // console.log(state.params.itemDetails.id)
        this.setState({
            id: state.params.itemDetails.id,
            title: state.params.itemDetails.title,
            selectedItems: selectedCategoryIndices,
            description: state.params.itemDetails.description,
            quantity: (state.params.itemDetails.numberAvailable) ? state.params.itemDetails.numberAvailable : 1,
            price: (state.params.itemDetails.price) ? state.params.itemDetails.price : null,
            tags: {
                tagsArray: (state.params.itemDetails.preferences) ? state.params.itemDetails.preferences : []
            },
            image1: state.params.itemDetails.images[0],
            image2: state.params.itemDetails.images[1],
            image3: state.params.itemDetails.images[2],
            image4: state.params.itemDetails.images[3],

            imgUrl1: state.params.itemDetails.images[0],
            imgUrl2: state.params.itemDetails.images[1],
            imgUrl3: state.params.itemDetails.images[2],
            imgUrl4: state.params.itemDetails.images[3],

        })
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
                { image: this.state.imageData1, imageUrl: this.state.image1 },
                { image: this.state.imageData2, imageUrl: this.state.image2 },
                { image: this.state.imageData3, imageUrl: this.state.image3 },
                { image: this.state.imageData4, imageUrl: this.state.image4 },
            ]
        }


        api.post('/services/multipleUploadEdit', encodedImages).then(response => {


            const item = {
                id: this.state.id,
                categories: this.state.selectedItems,
                images: response.data.data.urls,
                preferences: this.state.tags.tagsArray,
                ...values
            }

            api.post('/items/editItem', item).then((response) => {
                // console.log(response.data)
                if (response.status == 200) {

                    for (let i = 1; i <= 4; i++) {
                        if (this.state["imageData" + i]) {
                            let data = {
                                imageUrl: this.state["imgUrl"+i]
                            }
                            api.post('/services/deleteImage', data);
                        }
                    }

                    this.props.navigation.navigate("ItemsScreen", { refresh: true })
                    toast.show('Item Edited')
                } else {
                    toast.show('Error editing Item')
                }
            })

        })


    }

    handleChange = (value) => {
        console.log(value)
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
                        ["image" + [index]]: images[i].path,
                        ["imageData" + [index]]: images[i].data
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
                ["image" + [index]]: image.path,
                ["imageData" + [index]]: image.data
            })
        });
    }

    removeImage = (index) => {
        this.setState({
            ["image" + [index]]: null,
            ["imageData" + [index]]: null,
        })
    }

    updateTagState = (state) => {
        this.setState({
            tags: state
        })
    };

    showActionSheet = (imageIndex) => {
        this.setState({ imageIndex })
        this.ActionSheet.show()
    }

    getImageFrom(index) {
        let imageIndex = this.state.imageIndex
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
                                initialValues={{
                                    title: this.state.title,
                                    description: this.state.description,
                                    quantity: this.state.quantity,
                                    price: this.state.price
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
                                            {/* <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'> */}
                                            <View>
                                                {/* input */}
                                                <UploadFormInput
                                                    name='title'
                                                    value={values.title = this.state.title}
                                                    onChangeText={(title) => this.setState({ title })}
                                                    onp
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
                                                    selectedItems={this.state.selectedItems}
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
                                                    {() => this.multiSelect.getSelectedItemsExt(this.state.selectedItems)}
                                                </View>
                                                <UploadFormInput
                                                    name='description'
                                                    value={values.description = this.state.description}
                                                    onChangeText={(description) => this.setState({ description })}
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
                                                    value={values.quantity = (this.state.quantity) ? this.state.quantity.toString() : null}
                                                    onChangeText={(quantity) => this.setState({ quantity })}
                                                    autoCapitalize='none'
                                                    iconColor='#CD2900'
                                                    placeholder='Quantity'
                                                    onBlur={handleBlur('quantity')}
                                                />

                                                <UploadFormInput
                                                    name='price'
                                                    value={values.price = (this.state.price) ? this.state.price.toString() : null}
                                                    onChangeText={(price) => this.setState({ price })}
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
                                                                <TouchableOpacity onPress={() => this.showActionSheet(1)}>
                                                                    <Icon name="camera" size={20} />
                                                                </TouchableOpacity> :
                                                                <View style={styles.imgContainer}>
                                                                    <ImageModal
                                                                        style={{ width: 100, height: 100 }}
                                                                        swipeToDismiss={true}
                                                                        source={{ uri: this.state.image1 }}
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
                                                                        source={{ uri: this.state.image2 }}
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
                                                                        source={{ uri: this.state.image3 }}
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
                                                                        source={{ uri: this.state.image4 }}
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
                                                        tags={(this.state.tags) ? this.state.tags : []}
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
                                                    title='Submit'
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