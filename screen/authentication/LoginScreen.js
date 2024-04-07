import React, {useReducer, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {useDispatch} from 'react-redux';

import Card from '../../Components/UI/Card';
import CustomInputWithLabel from '../../Components/UI/Inputs/CustomInputWithLabel';
import MainButton from '../../Components/UI/CustomButton/MainButton';
//from Store---Redux
import * as authenticationActions from '../../store/actions/authentication';

//To avoid Spelling Mistakesf
const UPDATE_LOGIN = 'UPDATE_LOGIN';
//for useReducer
const loginReducer = (state, action) => {
  if (action.type === UPDATE_LOGIN) {
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

const LoginScreen = props => {
  const dispatch = useDispatch();

  const [inputError, setInputError] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef(null);

  const [inputState, dispatchInputState] = useReducer(loginReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const authenticationHandler = async () => {
    Keyboard.dismiss();
    if (!inputState.formIsValid) {
      setInputError(true);
      return;
    } else {
      setIsLoading(true);
      setTimeout(() => {
        dispatch(
          authenticationActions.loginWithEmailandPassword(
            inputState.inputValues.email,
            inputState.inputValues.password,
          ),
        );
        setIsLoading(false);
      }, 850);
    }
  };
  const inputChangeHandler = useCallback(
    (id, loginValue, loginValidity) => {
      dispatchInputState({
        type: UPDATE_LOGIN,
        value: loginValue,
        isValid: loginValidity,
        input: id,
      });
    },
    [dispatchInputState],
  );

  return (
    <View style={styles.container}>
      <Card style={styles.CardContainer}>
        <CustomInputWithLabel
          //props send to customInput
          initialValue=""
          initiallyValid={false}
          required
          mail
          isError={inputError}
          labelText="EMAIL ADDRESS*"
          placeHolder="Enter your email"
          errorText="Invalid email"
          //props to add on custom input
          id="email"
          onInputChange={inputChangeHandler}
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current.focus()}
          returnKeyType="next"
        />
        <CustomInputWithLabel
          //props from customInput
          initialValue=""
          initiallyValid={false}
          required
          isError={inputError}
          labelText="PASSWORD*"
          placeHolder="Enter your password"
          errorText="Invalid password"
          //props to add on custom input
          id="password"
          forwardRef={passwordRef}
          onSubmitEditing={authenticationHandler}
          onInputChange={inputChangeHandler}
          secureTextEntry={true}
          returnKeyType="done"
        />
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('FORGOT PASSWORD');
            }}>
            <Text style={styles.textStyle}>FORGOT PASSWORD?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.registrationContainer}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('USER REGISTRATION');
            }}>
            <Text style={styles.textStyle}>USER REGISTRATION</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('TAILOR REGISTRATION');
            }}>
            <Text style={styles.textStyle}>TAILOR REGISTRATION</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {isLoading == true ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <MainButton
              style={styles.saveButton}
              label="LOG IN"
              onPress={authenticationHandler}
            />
          )}
        </View>
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
    height: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '2%',
    backgroundColor: '#E8E8E8',
  },
  CardContainer: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
  },
  itemContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  inputStyle: {
    width: '100%',
    marginBottom: 10,
  },
  forgotPasswordContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  registrationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textStyle: {
    marginVertical: 10,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
  },
  saveButton: {
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
  },
});
export default LoginScreen;
{
  /*    <Card style={styles.itemContainer}>

        <CustomInputWithLabel
          //props send to customInput
          initialValue=""
          initiallyValid={false}
          required
          mail
          isError={inputError}
          labelText="EMAIL ADDRESS*"
          placeHolder="Enter your email"
          errorText="Invalid email!"
          //props to add on custom input
          id="email"
          onInputChange={inputChangeHandler}
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current.focus()}
          returnKeyType="next"
        />

        <CustomInputWithLabel
          //props from customInput
          initialValue=""
          initiallyValid={false}
          required
          isError={inputError}
          labelText="PASSWORD*"
          placeHolder="Enter your password"
          errorText="Invalid password"
          //props to add on custom input
          id="password"
          forwardRef={passwordRef}
          onSubmitEditing={authenticationHandler}
          onInputChange={inputChangeHandler}
          secureTextEntry={true}
          returnKeyType="done"
        />

        <View style={styles.textContainer}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('FORGOT PASSWORD');
            }}>
            <Text style={styles.textStyle}>FORGOT PASSWORD?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          {isLoading == true ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <MainButton
              style={styles.saveButton}
              label="LOG IN"
              onPress={authenticationHandler}
            />
          )}
        </View>
      </Card> */
}
{
  /*  <Card style={styles.itemContainer}>
        <MainButton
          style={styles.saveButton}
          label="SIGN UP"
          onPress={() => {
            props.navigation.navigate('SIGN UP');
          }}
        />
      </Card> */
}
