import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup'
import { Formik } from 'formik';
import BouncyCheckbox from "react-native-bouncy-checkbox"

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .required("length is required")
    .min(4, "should have atleast 4 chars")
    .max(16, "can't have more than 16 chars")
})

function App(): React.JSX.Element {

  const [password, setPassword] = useState('')
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false)
  const [lowercase, setLowercase] = useState(false)
  const [uppercase, setUppercase] = useState(false)
  const [numbers, setNumbers] = useState(false)
  const [symbols, setSymbols] = useState(false)

  const generatePasswordString = (passwordLength: number) => {
    let characterList = ''
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*()_+';

    if (uppercase) {
      characterList += uppercaseChars;
    }
    if (lowercase) {
      characterList += lowercaseChars
    }
    if (numbers) {
      characterList += digitChars
    }
    if (symbols) {
      characterList += specialChars
    }

    const passwordResult = createPassword(characterList, passwordLength)

    setPassword(passwordResult)
    setIsPasswordGenerated(true)
  }

  const createPassword = (characters: String, passwordLength: number) => {
    let result = ''
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * (characters.length - 1))
      result += characters.charAt(characterIndex)
    }
    return result
  }

  const resetPasswordState = () => {
    setPassword('')
    setIsPasswordGenerated(false)
    setLowercase(true)
    setUppercase(false)
    setNumbers(false)
    setSymbols(false)
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            Password Generator
          </Text>
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={PasswordSchema}
            onSubmit={values => {
              generatePasswordString(+values.passwordLength)
            }}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset,
              /* and other goodies */
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>
                        {errors.passwordLength}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="Ex. 8"
                    keyboardType='numeric'
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include lowercase</Text>
                  <BouncyCheckbox
                    isChecked={lowercase}
                    onPress={() => setLowercase(!lowercase)}
                    fillColor="#29AB87"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Uppercase letters</Text>
                  <BouncyCheckbox
                    isChecked={uppercase}
                    onPress={() => setUppercase(!uppercase)}
                    fillColor="#FED85D"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Numbers</Text>
                  <BouncyCheckbox
                    isChecked={numbers}
                    onPress={() => setNumbers(!numbers)}
                    fillColor="#C9A0DC"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Symbols</Text>
                  <BouncyCheckbox
                    isChecked={symbols}
                    onPress={() => setSymbols(!symbols)}
                    fillColor="#FC80A5"
                  />
                </View>
                {isPasswordGenerated ? (
                  <View style={[styles.card, styles.cardElevated]}>
                    <Text style={[styles.subTitle,{letterSpacing: 5}]}> Result:-</Text>
                    <Text style={styles.description}>Long Press to copy</Text>
                    <Text selectable={true} style={styles.generatedPassword}>{password}</Text>
                  </View>
                ) : null}
                <View style={styles.formActions}>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={styles.primaryBtn}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.primaryBtnTxt}>Generate Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPasswordState()
                    }}
                  >
                    <Text style={styles.secondaryBtnTxt}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
    margin: 8,
    padding: 8,
    flex: 1,
  },
  title: {
    fontSize: 35,
    fontWeight: '600',
    marginBottom: 25,
    color: "black",
    textAlign:"center",
    backgroundColor:"rgba(177,177,177,0.1)",
    borderRadius:20,
    paddingVertical:20,
  },
  subTitle: {
    fontSize: 32,
    fontWeight: '400',
    marginBottom: 2,
    color: "black",
    borderBottomColor:"black",
    borderBottomWidth:0.5,

  },
  description: {
    color: '#758283',
       fontSize: 15,
    // color: "black",
    marginBottom: 8,
    textAlign:"center"
  },
  heading: {
    fontSize: 19,
    color: "black"
  },
  inputWrapper: {
    marginBottom: 25,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'row',
    color: "black"
  },
  inputColumn: {
    flexDirection: 'column',
  },
  inputStyle: {
    padding: 8,
    width: '30%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#16213e',
  },
  errorText: {
    fontSize: 12,
    color: '#ff0d10',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  primaryBtn: {
    flex: 1,
    padding: 20,
    paddingVertical:30,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#5DA3FA',
    alignItems: 'center',
    justifyContent: "center",
    marginBottom:30
  },
  primaryBtnTxt: {
    color: "black",
    fontWeight: "700",
    textAlign: 'center',
    fontSize:17
  },
  secondaryBtn: {
    flex: 1,
    padding: 20,
    paddingVertical:30,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#CAD5E2',
    alignItems: 'center',
    justifyContent: "center",
    marginBottom:30
  },
  secondaryBtnTxt: {
    color: "black",
    fontWeight: "700",
    textAlign: 'center',
    fontSize:17
  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    marginVertical:25,
    gap:8
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 27,
    textAlign: 'center',
    marginBottom: 12,
    color: 'black',
    fontWeight:"bold"
  },
});

export default App;
