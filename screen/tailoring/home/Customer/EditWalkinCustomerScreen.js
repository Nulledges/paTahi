import React, {useReducer, useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import * as customerActions from '../../../../store/actions/customer';
import Card from '../../../../Components/UI/Card';
import ErrorText from '../../../../Components/UI/CustomText/ErrorText';
import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import CustomInputWithLabel from '../../../../Components/UI/Inputs/CustomInputWithLabel';
const ADD_CUSTOMER = 'ADD_CUSTOMER';
const MEASUREMENT = 'MEASUREMENT';
const ADD_MEASUREMENT = 'ADD_MEASUREMENT';
const DELETE_MEASUREMENT = 'DELETE_MEASUREMENT';
const customerReducer = (state, action) => {
  switch (action.type) {
    case ADD_CUSTOMER:
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
    default:
      returnstate;
  }
};
const dynamicReducer = (state, action) => {
  switch (action.type) {
    case MEASUREMENT:
      const updatedValues = {
        ...state.dynamicInputValues,
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
        dynamicFormIsValid: updatedFormIsValid,
        dynamicInputValues: updatedValues,
        dynamicInputValidities: updatedValidities,
      };
    case ADD_MEASUREMENT:
      const {newSubcategory} = action.payload;
      return {
        ...state,
        dynamicInputValues: {
          ...state.dynamicInputValues,
          [newSubcategory]: '',
        },
        dynamicInputValidities: {
          ...state.dynamicInputValidities,
          [newSubcategory]: false,
        },
        dynamicFormIsValid: false,
      };
    case DELETE_MEASUREMENT:
      const {subCategoryToDelete} = action.payload;
      const {[subCategoryToDelete]: deletedMeasurement, ...rest} =
        state.dynamicInputValues;
      const {[subCategoryToDelete]: deletedValidity, ...restValidities} =
        state.dynamicInputValidities;

      return {
        ...state,
        dynamicInputValues: rest,
        dynamicInputValidities: restValidities,
      };

    default:
      returnstate;
  }
};
const EditWalkinCustomerScreen = props => {
  const dispatch = useDispatch();
  const storeId = props.route.params.storeId;
  const customerId = props.route.params.customerId;
  const specificCustomer = props.route.params.specificCustomer;
  const [inputError, setInputError] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState('');

  const [inputState, dispatchInputState] = useReducer(customerReducer, {
    inputValues: {
      name: specificCustomer.customerName,
      phone: specificCustomer.phoneNumber,
    },
    inputValidities: {name: true, phone: true},
    formIsValid: true,
  });
  const [dynamicInputState, dispatchDynamicInputState] = useReducer(
    dynamicReducer,
    {
      dynamicInputValues: specificCustomer.measurement,
      dynamicInputValidities: specificCustomer.measurementValidities,
      dynamicFormIsValid: true,
    },
  );
  const addSubcategory = () => {
    if (
      newSubcategory &&
      !(newSubcategory in dynamicInputState.dynamicInputValues)
    ) {
      dispatchDynamicInputState({
        type: ADD_MEASUREMENT,
        payload: {newSubcategory},
      });
      setNewSubcategory('');
    }
  };
  const deleteSubcategory = subCategoryToDelete => {
    dispatchDynamicInputState({
      type: DELETE_MEASUREMENT,
      payload: {subCategoryToDelete},
    });
  };

  const measurementHandler = async () => {
    Keyboard.dismiss();

    if (!inputState.formIsValid) {
      setInputError(true);
      return;
    } else {
      dispatch(
        customerActions.updateCustomer(
          inputState.inputValues.name,
          inputState.inputValues.phone,
          storeId,
          customerId,
        ),
      );
      props.navigation.goBack();
    }
  };
  const inputChangeHandler = useCallback(
    (id, measurementValue, measurementValidity) => {
      dispatchInputState({
        type: ADD_CUSTOMER,
        value: measurementValue,
        isValid: measurementValidity,
        input: id,
      });
    },
    [dispatchInputState],
  );
  const dynamicInputChangeHandler = useCallback(
    (id, measurementValue, measurementValidity) => {
      dispatchDynamicInputState({
        type: MEASUREMENT,
        value: measurementValue,
        isValid: measurementValidity,
        input: id,
      });
    },
    [dispatchDynamicInputState],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          width: '100%',
          height: '90%',
          marginBottom: '19%',
        }}
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: '2%',
        }}>
        <Card style={styles.CardContainer}>
          <Text style={styles.textStyle}>Customer Information</Text>

          <CustomInputWithLabel
            //props send to customInput
            initialValue={specificCustomer.customerName}
            initiallyValid={true}
            required
            isError={inputError}
            labelText={'name'}
            placeHolder={`Enter your name`}
            errorText={`Invalid name`}
            //props to add on custom input
            id={'name'}
            onInputChange={inputChangeHandler}
            returnKeyType="done"
          />

          <CustomInputWithLabel
            //props send to customInput
            initialValue={specificCustomer.phoneNumber}
            initiallyValid={true}
            required
            phoneNumbers
            isError={inputError}
            labelText={'phone number'}
            placeHolder={`Enter phone number`}
            errorText={`Invalid phone number`}
            //props to add on custom input
            id={'phone'}
            onInputChange={inputChangeHandler}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </Card>
        {/*   <Card style={styles.CardContainer}>
          <Text style={styles.textStyle}>Measurements detail</Text>
          <TextInput
            placeholderTextColor={'#545454'}
            style={{
              padding: 10,
              marginBottom: 5,
              borderBottomWidth: 1,
              height: 50,
              fontSize: 14,
              backgroundColor: '#E8E8E8',
              color: 'black',
            }}
            placeholder="Enter measurements"
            value={newSubcategory}
            onChangeText={text => setNewSubcategory(text)}
          />

          <MainButton
            style={styles.addMeasurementButton}
            label="Add measurement"
            onPress={addSubcategory}
          />
          <Text style={styles.textStyle}>Measurements needed</Text>

          {Object.keys(dynamicInputState.dynamicInputValues).map(key => {
            return (
              <CustomInputWithLabel
                //props send to customInput
                initialValue={dynamicInputState.dynamicInputValues[key]}
                initiallyValid={true}
                required
                onlyNumbers
                deleteIcon
                trashOnPress={() => {
                  deleteSubcategory(key);
                }}
                isError={inputError}
                labelText={key}
                placeHolder={`Enter ${key} measurement`}
                errorText={`Invalid ${key} measurement`}
                //props to add on custom input
                id={key}
                key={key}
                onInputChange={dynamicInputChangeHandler}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            );
          })}
          {inputError == true &&
            Object.keys(dynamicInputState.dynamicInputValues).length === 0 && (
              <ErrorText
                style={styles.errorText}
                errorText="Add at least 1 measurement"
              />
            )}
        </Card> */}
      </ScrollView>
      <ScrollView
        style={styles.buttonContainer}
        contentContainerStyle={{
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexGrow: 1,
        }}>
        <MainButton
          style={styles.saveButton}
          label="Update"
          onPress={measurementHandler}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
  },
  CardContainer: {
    borderRadius: 10,
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  textStyle: {
    color: 'black',
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    fontWeight: 'bold',
    borderBottomWidth: 1,
  },
  errorText: {
    height: 30,
  },
  buttonContainer: {
    width: '100%',
    height: '10%',
    bottom: 0,
    position: 'absolute',
  },
  saveButton: {
    width: '95%',
    backgroundColor: 'black',
    margin: 5,
    borderRadius: 10,
  },
});
export default EditWalkinCustomerScreen;
