import React, {useReducer, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';

import Card from '../../Components/UI/Card';
import CustomInputWithLabel from '../../Components/UI/Inputs/CustomInputWithLabel';
import MainButton from '../../Components/UI/CustomButton/MainButton';
import * as authenticationActions from '../../store/actions/authentication';

const UPDATE_SIGNUP = 'UPDATE_SIGNUP';
const signupReducer = (state, action) => {
  if (action.type === UPDATE_SIGNUP) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const SignupScreen = props => {
  const dispatch = useDispatch();

  const [inputError, setInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [inputState, dispatchInputState] = useReducer(signupReducer, {
    inputValues: {
      email: '',
      password: '',
      fullname: '',
      username: '',
      phone: '',
    },
    inputValidities: {
      email: false,
      password: false,
      fullname: false,
      username: false,
      phone: false,
    },
    formIsValid: false,
  });
  const authenticationHandler = () => {
    Keyboard.dismiss();
    if (!inputState.formIsValid) {
      setInputError(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        authenticationActions.signupWithEmailandPassword(
          inputState.inputValues.email,
          inputState.inputValues.password,
          inputState.inputValues.fullname,
          inputState.inputValues.username,
          inputState.inputValues.phone,
        ),
      );
      setIsLoading(false);
    }, 850);
  };
  const inputChangeHandler = useCallback(
    (id, signupValue, signupValidity) => {
      dispatchInputState({
        type: UPDATE_SIGNUP,
        value: signupValue,
        isValid: signupValidity,
        input: id,
      });
    },
    [dispatchInputState],
  );
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: '2%',
          marginTop: '1.5%',
        }}
        style={{
          width: '100%',
          height: '90%',
          marginBottom: '19%',
        }}>
        <Card style={styles.CardContainer}>
          <CustomInputWithLabel
            //props send to customInput
            initialValue=""
            initiallyValid={false}
            required
            isError={inputError}
            labelText="FULLNAME*"
            placeHolder="Enter your fullname"
            errorText="Invalid name."
            //props to add on custom input
            id="fullname"
            onInputChange={inputChangeHandler}
            blurOnSubmit={false}
            onSubmitEditing={() => usernameRef.current.focus()}
            returnKeyType="next"
          />

          <CustomInputWithLabel
            //props send to customInput
            initialValue=""
            initiallyValid={false}
            required
            isError={inputError}
            labelText="USERNAME*"
            placeHolder="Enter your username"
            errorText="Invalid username!"
            //props to add on custom input
            id="username"
            forwardRef={usernameRef}
            blurOnSubmit={false}
            onSubmitEditing={() => emailRef.current.focus()}
            onInputChange={inputChangeHandler}
            returnKeyType="next"
          />

          <CustomInputWithLabel
            initialValue=""
            textLength={0}
            required
            phoneNumbers
            isError={inputError}
            labelText="Phone Number*"
            placeHolder="Enter Phone Number"
            errorText="Please enter Phone Number"
            maxLength={11}
            isMultiLine={false}
            //props to add on custom input
            id="phone"
            keyboardType="number-pad"
            onInputChange={inputChangeHandler}
            returnKeyType="done"
          />

          <CustomInputWithLabel
            //props send to customInput
            initialValue=""
            initiallyValid={false}
            required
            mail
            isError={inputError}
            labelText="EMAIL*"
            placeHolder="Enter your email"
            errorText="Invalid email!"
            //props to add on custom input
            id="email"
            forwardRef={emailRef}
            blurOnSubmit={false}
            onSubmitEditing={() => passwordRef.current.focus()}
            onInputChange={inputChangeHandler}
            returnKeyType="next"
          />

          <CustomInputWithLabel
            //props from customInput
            initialValue=""
            initiallyValid={false}
            required
            minLength={6}
            maxLength={26}
            isError={inputError}
            labelText="PASSWORD*"
            placeHolder="Enter your password"
            errorText="Password must be 6 characters or longer."
            //props to add on custom input
            id="password"
            forwardRef={passwordRef}
            onSubmitEditing={authenticationHandler}
            onInputChange={inputChangeHandler}
            secureTextEntry={true}
            returnKeyType="done"
          />
        </Card>
      </ScrollView>
      <View style={styles.buttonContainer}>
        {isLoading == true ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <MainButton
            style={styles.saveButton}
            label="REGISTER"
            onPress={authenticationHandler}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    backgroundColor: 'black',
    margin: 5,
    borderRadius: 10,
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  CardContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },

  buttonContainer: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '10%',
    bottom: 0,
    position: 'absolute',
  },
  saveButton: {
    width: '90%',
    backgroundColor: 'black',
    marginTop: 5,
    borderRadius: 10,
  },
});
export default SignupScreen;
