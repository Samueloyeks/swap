import React from 'react'
import { Button } from 'react-native-elements'

const FormButton = ({ title, buttonType, buttonColor, ...rest }) => (
  <Button
    {...rest}
    type={buttonType}
    title={title}
    titleStyle={{ color: buttonColor, fontSize: 17 }}
    buttonStyle={styles.button}
    loadingProps={{ color: '#FF9D5C' }}
  />
)


const styles = {
  button: {
    width:'100%',
    backgroundColor: '#000000',
    borderRadius: 35,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
}



export default FormButton