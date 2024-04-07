import React, {useReducer, useEffect} from 'react';

import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ErrorText from '../CustomText/ErrorText';
import HelperText from '../CustomText/HelperText';
import LabelText from '../CustomText/LabelText';
//So that no spelling will be wrong below.
const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};
const CustomInputWithLabel = props => {
  //useReducer needs reducer which is inputReducer then it needs Initialvalue
  /*   let initialValue = '';
  let touched = false;
  let initiallyValid = false;
  if (props.initialValue == '0') {
    console.log('asd');
    initialValue = '0';
    touched = true;
  }
  if (props.initiallyValid == true) {
    initiallyValid = true;
  } */

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue,
    isValid: props.initiallyValid,
  });
  const {id, onInputChange} = props;
  useEffect(() => {
    onInputChange(id, inputState.value, inputState.isValid);
  }, [id, onInputChange, inputState]);

  const textChangeHandler = text => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let isValid = true;

    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.required && text == '') {
      isValid = false;
    }
    if (props.mail && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if (props.maxLength != null && text.length > props.maxLength) {
      isValid = false;
    }
    if (props.notSame != null && props.notSame !== text) {
      isValid = false;
    }
    if (props.onlyNumbers) {
      text = text.replace(/[^0-9.]/g, ''); // Remove non-digits, excluding dots
      text = text.replace(/^0+(?=[1-9])/, ''); // Remove leading zeros
      text = text.replace(/^\.+/, ''); // Remove dot if it's the first character
      text = text.replace(/\.+/g, '.'); // Remove consecutive dots

      // Ensure there's at most one decimal point in the entire string
      const decimalCount = (text.match(/\./g) || []).length;
      if (decimalCount > 1) {
        text = text.replace(/\./g, '');
      }

      // Remove consecutive instances of "00"
      text = text.replace(/00+/g, '0');
      if (text === '') {
        console.log('ERROR');
        isValid = false;
      }
    }
    if (props.numberForStocks) {
      text = text.replace(/[^\d]/g, ''); // Remove non-digits, including dots
      text = text.replace(/^0+(?=[1-9])/, ''); // Remove leading zeros
      text = text.replace(/^\.+/, ''); // Remove dot if it's the first character
      text = text.replace(/\.+/g, ''); // Remove consecutive dots
      text = text.replace(/00+/g, '0'); // Remove consecutive instances of "00"
      if (text === '') {
        isValid = false;
      }
    }
    if (props.phoneNumbers && /^09\d{9}$/.test(text) != true) {
      isValid = false;
    } 
    dispatch({type: INPUT_CHANGE, value: text, isValid: isValid});
  };

  const lostFocusHandler = () => {
    dispatch({type: INPUT_BLUR});
  };
  return (
    <View style={styles.viewBorders}>
      {props.deleteIcon && (
        <View style={styles.labelContainer}>
          <LabelText style={styles.labelText} labelText={props.labelText} />
          <TouchableOpacity onPress={props.trashOnPress}>
            <Ionicon name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
      {!props.deleteIcon && (
        <LabelText style={styles.labelText} labelText={props.labelText} />
      )}

      <TextInput
        placeholderTextColor={'#545454'}
        style={styles.textInput}
        {...props}
        placeholder={props.placeHolder}
        value={inputState.value}
        onChangeText={textChangeHandler}
        ref={props.forwardRef}
      />
      {!inputState.isValid && props.isError && (
        <ErrorText errorText={props.errorText} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewBorders: {
    width: '100%',
    color: 'black',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    textTransform: 'uppercase',
    color: 'black',
    fontSize: 15,
  },

  textInput: {
    padding: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 14,
    backgroundColor: '#E8E8E8',
    color: 'black',
  },
});

export default CustomInputWithLabel;
