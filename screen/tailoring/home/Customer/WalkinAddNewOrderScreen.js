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
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Card from '../../../../Components/UI/Card';
import ErrorText from '../../../../Components/UI/CustomText/ErrorText';
import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import CustomInputWithLabel from '../../../../Components/UI/Inputs/CustomInputWithLabel';
import TwoLabelButton from '../../../../Components/UI/CustomButton/TwoLabelButton';
import * as categoryActions from '../../../../store/actions/category';
import * as customerActions from '../../../../store/actions/customer';
import {instanceId} from 'firebase-admin';
import * as orderActions from '../../../../store/actions/order';
const ADD_CUSTOMER = 'ADD_CUSTOMER';
const MEASUREMENT = 'MEASUREMENT';
const ADD_MEASUREMENT = 'ADD_MEASUREMENT';
const DELETE_MEASUREMENT = 'DELETE_MEASUREMENT';
const EXISTING_MEASUREMENT = 'EXISTING_MEASUREMENT';
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
        ...state.dynamicInputValidities,
        [action.input]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        dynamicFormIsValid: updatedFormIsValid,
        dynamicInputValues: updatedValues,
        dynamicInputValidities: updatedValidities,
      };

    case ADD_MEASUREMENT:
      const { newMeasurement } = action.payload;
      return {
        ...state,
        dynamicInputValues: {
          ...state.dynamicInputValues,
          [newMeasurement]: "",
        },
        dynamicInputValidities: {
          ...state.dynamicInputValidities,
          [newMeasurement]: false,
        },
        dynamicFormIsValid: false,
      };

    case DELETE_MEASUREMENT:
      const { subCategoryToDelete } = action.payload;
      const { [subCategoryToDelete]: deletedMeasurement, ...rest } =
        state.dynamicInputValues;
      const { [subCategoryToDelete]: deletedValidity, ...restValidities } =
        state.dynamicInputValidities;

      return {
        ...state,
        dynamicInputValues: rest,
        dynamicInputValidities: restValidities,
      };
    case EXISTING_MEASUREMENT:
      const existingMeasurement = action.payload;
      const InputValues = {};
      const InputValidities = {};
      if (Array.isArray(existingMeasurement)) {
        existingMeasurement.forEach((item) => {
          InputValues[item] = "";
          InputValidities[item] = false;
        });
      }

      return {
        ...state,
        dynamicInputValues: InputValues,
        dynamicInputValidities: InputValidities,
        dynamicFormIsValid: false,
      };
    default:
      return state;
  }
};
const WalkinAddNewOrderScreen = props => {
  const dispatch = useDispatch();

  const storeId = props.route.params.storeId;
  const categoryList = useSelector(state => state.category.categoryList);
  const myStore = useSelector(state => state.store.myStore);
  const [inputError, setInputError] = useState(false);

  const [isMeasurementModalVisible, setIsMeasurementModalVisible] =
    useState(false);
  const [newMeasurement, setNewMeasurement] = useState('');
  const [modalInputError, setModalInputError] = useState(false);
  const [categoryState, setCategoryState] = useState();
  const [inputState, dispatchInputState] = useReducer(customerReducer, {
    inputValues: {price: '', description: ''},
    inputValidities: {price: false, description: false},
    formIsValid: false,
  });
  const [dynamicInputState, dispatchDynamicInputState] = useReducer(
    dynamicReducer,
    {
      dynamicInputValues: {},
      dynamicInputValidities: {},
      dynamicFormIsValid: false,
    },
  );

  useEffect(() => {
    try {
      const unsubcribe = dispatch(categoryActions.fetchCategory(storeId));
      return unsubcribe;
    } catch (error) {
      console.log('Error at MyMeasurementBookScreen: ' + error);
    }
  }, []);

  //category
  useEffect(() => {
    if (props.route.params?.category != undefined) {
      setCategoryState(props.route.params?.category);
      const measurement = props.route.params?.measurement;
      dispatchDynamicInputState({
        type: EXISTING_MEASUREMENT,
        payload: measurement,
      });
    }
  }, [props.route.params?.category]);

  const addNewMeasurement = () => {
    if (
      newMeasurement &&
      !(newMeasurement in dynamicInputState.dynamicInputValues)
    ) {
      dispatchDynamicInputState({
        type: ADD_MEASUREMENT,
        payload: {newMeasurement},
      });
      setNewMeasurement('');
      setIsMeasurementModalVisible(false);
      setModalInputError(false);
    } else {
      setModalInputError(true);
    }
  };
  const deleteSubcategory = subCategoryToDelete => {
    dispatchDynamicInputState({
      type: DELETE_MEASUREMENT,
      payload: {subCategoryToDelete},
    });
  };

  const addHandler = async () => {
    Keyboard.dismiss();
    if (
      !inputState.formIsValid ||
      !dynamicInputState.dynamicFormIsValid ||
      Object.keys(dynamicInputState.dynamicInputValues).length === 0
    ) {
      setInputError(true);
    } else {
      const name = props.route.params?.name;
      const phone = props.route.params?.phoneNumber;
      const orderItem = [
        {
          id: 1,
          isRated: false,
          productCategory: categoryState,
          productDescription: inputState.inputValues.description,
          productId: 1,
          productPrice: inputState.inputValues.price,
          productPrimaryImage: 'default.png',
          productTitle: 'Custom ' + categoryState,
          quantity: 1,
          storeId: myStore.storeId,
          photos: '',
          measurements: dynamicInputState.dynamicInputValues,
        },
      ];

      dispatch(
        orderActions.createWalkinOrder(
          orderItem,
          inputState.inputValues.price,
          myStore.storeId,
          myStore.storeName,
          name,
          phone,
        ),
      );
      props.navigation.goBack();
      /*   
      
      dispatch(
        customerActions.addCustomer(
           dynamicInputState.dynamicInputValues,
          dynamicInputState.dynamicInputValidities, 
          name,
          phone,
          storeId,
        ),
      );
       */
    }
  };

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
          <TwoLabelButton
            firstLabel="Name"
            secondLabel={props.route.params?.name}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Phone Number"
            secondLabel={props.route.params?.phoneNumber}
            onPress={() => {}}
          />
        </Card>
        <Card style={styles.CardContainer}>
          <CustomInputWithLabel
            //props send to customInput
            initialValue=""
            initiallyValid={false}
            required
            onlyNumbers
            isError={inputError}
            labelText={'price'}
            placeHolder={`Enter price`}
            errorText={`Invalid price`}
            //props to add on custom input
            id={'price'}
            onInputChange={inputChangeHandler}
            keyboardType="number-pad"
            returnKeyType="done"
          />
          <CustomInputWithLabel
            //props send to customInput
            initialValue=""
            initiallyValid={false}
            required
            isError={inputError}
            labelText={'Description'}
            placeHolder={`Enter description`}
            errorText={`Invalid description`}
            //props to add on custom input
            id={'description'}
            onInputChange={inputChangeHandler}
            keyboardType="default"
            returnKeyType="done"
          />
        </Card>
        {!props.route.params?.category && (
          <Card style={styles.CardContainer}>
            <TwoLabelButton
              firstLabel="Category"
              secondLabel={`${
                props.route.params?.category ? props.route.params?.category : ''
              } >`}
              onPress={() => {
                props.navigation.navigate('SELECT CUSTOMER CATEGORY', {
                  name: props.route.params?.name,
                  phoneNumber: props.route.params?.phoneNumber,
                  storeId: storeId,
                });
              }}
            />

            {!categoryState && inputError && (
              <ErrorText
                style={{marginTop: 5}}
                errorText="Please select a category"
              />
            )}
          </Card>
        )}

        {categoryState && (
          <Card style={styles.CardContainer}>
            <TwoLabelButton
              firstLabel="Category"
              secondLabel={`${
                props.route.params?.category ? props.route.params?.category : ''
              } >`}
              onPress={() => {
                props.navigation.navigate('SELECT CUSTOMER CATEGORY', {
                  name: props.route.params?.name,
                  phoneNumber: props.route.params?.phoneNumber,
                  storeId: storeId,
                });
              }}
            />
            {!categoryState && inputError && (
              <ErrorText
                style={{marginTop: 5}}
                errorText="Please select a category"
              />
            )}
            {/* 
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
            /> */}

            <Text style={styles.textStyle}>Measurements needed</Text>
            <MainButton
              style={{
                width: '45%',
                height: 40,
                margin: 1,
                borderRadius: 10,
                alignSelf: 'flex-end',
              }}
              label={'+ADD MEASUREMENT'}
              onPress={() => {
                setIsMeasurementModalVisible(true);
              }}
            />
            {Object.keys(dynamicInputState.dynamicInputValues).map(key => {
              return (
                <CustomInputWithLabel
                  //props send to customInput
                  initialValue=""
                  initiallyValid={false}
                  required
                  onlyNumbers
                  deleteIcon
                  trashOnPress={() => {
                    deleteSubcategory(key);
                  }}
                  isError={inputError}
                  labelText={key}
                  placeHolder={`Enter ${key} measurement(inches)`}
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
              Object.keys(dynamicInputState.dynamicInputValues).length ===
                0 && (
                <ErrorText
                  style={styles.errorText}
                  errorText="Add at least 1 measurement"
                />
              )}
          </Card>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <MainButton
          style={styles.saveButton}
          label="Add"
          onPress={addHandler}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMeasurementModalVisible}
        onRequestClose={() => {
          setIsMeasurementModalVisible(false);
          setNewMeasurement('');

          setModalInputError(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsMeasurementModalVisible(false);
            setNewMeasurement('');

            setModalInputError(false);
          }}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.buttonModalContainer}>
                  <View style={styles.buttonMargin}>
                    <Text
                      style={{
                        color: 'black',
                        textTransform: 'uppercase',
                        marginBottom: 5,
                      }}>
                      Add new measurement
                    </Text>
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
                      placeholder="Enter measurement name"
                      value={newMeasurement}
                      onChangeText={text => setNewMeasurement(text)}
                    />

                    {modalInputError && !newMeasurement && (
                      <ErrorText errorText="Enter a measurement" />
                    )}

                    <MainButton
                      style={styles.modalAddButton}
                      label={'ADD'}
                      onPress={addNewMeasurement}
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexGrow: 1,
  },
  saveButton: {
    width: '95%',
    backgroundColor: 'black',
    margin: 5,
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonModalContainer: {
    width: '95%',
  },
  buttonMargin: {
    marginBottom: 5,
  },
  modalAddButton: {
    alignSelf: 'center',
    width: '100%',
    margin: 5,
    borderRadius: 10,
  },
});
export default WalkinAddNewOrderScreen;
