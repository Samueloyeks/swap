import React from 'react'
import { Input } from 'react-native-elements'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';


const FormInput = ({
  iconName,
  iconColor,
  returnKeyType,
  keyboardType,
  name,
  placeholder,
  value, 
  numberOfLines,
  containerStyle=styles.input,
  ...rest
}) => (
    <View style={styles.inputContainer}>
      <Input
        {...rest}
        leftIcon={<Icon name={iconName} size={10} color={iconColor} />}
        leftIconContainerStyle={styles.iconStyle}
        placeholderTextColor='grey'
        name={name}
        placeholder={placeholder}
        containerStyle={containerStyle}
        value={value}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        multiline={true}
        numberOfLines={numberOfLines?numberOfLines:null}
        keyboardType={keyboardType}
      />
    </View>
  )

const styles = StyleSheet.create({
  inputContainer: {
    margin: 1
  },
  iconStyle: {
    marginRight: 10
  },
  input: {
    borderStyle: 'solid',
    overflow: 'hidden',
    // paddingTop: 3,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 25,
    height: 42,
    backgroundColor:'#FFF',
  },
})

export default FormInput