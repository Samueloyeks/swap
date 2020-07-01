import React from 'react'
import { Input } from 'react-native-elements'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';



const FormInput = ({
  iconName, 
  rightIconName,
  rightIconFunction,
  iconColor,
  returnKeyType,
  keyboardType,
  name,
  placeholder,
  value, 
  ...rest
}) => (
    <View style={styles.inputContainer}>
      <Input
        {...rest}
        leftIcon={<Icon name={iconName} size={20} color={iconColor} />}
        rightIcon={rightIconName?<Icon2 onPress={()=>rightIconFunction()} name={rightIconName} size={20} color={iconColor}/>:null}
        leftIconContainerStyle={styles.iconStyle}
        placeholderTextColor='grey'
        name={name}
        placeholder={placeholder}
        containerStyle={styles.input}
        value={value}
        inputContainerStyle={{ borderBottomWidth: 0 }}
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
  },
})

export default FormInput