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
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as orderActions from '../../store/actions/order';
import Card from '../../Components/UI/Card';
import CustomInputWithLabel from '../../Components/UI/Inputs/CustomInputWithLabel';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';
import LabelText from '../../Components/UI/CustomText/LabelText';
import MainButton from '../../Components/UI/CustomButton/MainButton';
import ErrorText from '../../Components/UI/CustomText/ErrorText';
import * as categoryActions from '../../store/actions/category';
const MODIFY_INPUT = 'MODIFY_INPUT';
const MEASUREMENT = 'MEASUREMENT';
const ADD_MEASUREMENT = 'ADD_MEASUREMENT';
const DELETE_MEASUREMENT = 'DELETE_MEASUREMENT';
const EXISTING_MEASUREMENT = 'EXISTING_MEASUREMENT';
const inputReducer = (state, action) => {
  switch (action.type) {
    case MODIFY_INPUT:
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
      const {newMeasurement} = action.payload;
      return {
        ...state,
        dynamicInputValues: {
          ...state.dynamicInputValues,
          [newMeasurement]: '',
        },
        dynamicInputValidities: {
          ...state.dynamicInputValidities,
          [newMeasurement]: false,
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
    case EXISTING_MEASUREMENT:
      const existingMeasurement = action.payload;
      const InputValues = {};
      const InputValidities = {};
      existingMeasurement.map(item => {
        InputValues[item] = '';
        InputValidities[item] = false;
        return null; // or any other value, as map expects a return value
      });

      return {
        ...state,
        dynamicInputValues: InputValues,
        dynamicInputValidities: InputValidities,
        dynamicFormIsValid: false,
      };
    default:
      returnstate;
  }
};
const CustomizeProductScreen = props => {
  const specificProduct = props.route.params?.specificProduct;
  const specificStore = props.route.params?.specificStore;
  const userInformation = useSelector(state => state.user.myInformation);
  const categoryList = useSelector(state => state.category.categoryList);
  const dispatch = useDispatch();
  const [specificCategory, setSpecificCategory] = useState();
  const [inputError, setInputError] = useState(false);
  /*   const [measurements, setMeasurements] = useState({}); */
  const [newSubcategory, setNewSubcategory] = useState('');
  /*   const [categoryState, setCategoryState] = useState(); */
  const [isMeasurementModalVisible, setIsMeasurementModalVisible] =
    useState(false);
  const [newMeasurement, setNewMeasurement] = useState('');
  const [modalInputError, setModalInputError] = useState(false);

  const [inputState, dispatchInputState] = useReducer(inputReducer, {
    inputValues: {quantity: ''},
    inputValidities: {quantity: false},
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
    categoryList.map((value, index) => {
      if (value.category == specificProduct.productCategory) {
        /*     setCategoryState(value.category); */
        dispatchDynamicInputState({
          type: EXISTING_MEASUREMENT,
          payload: value.measurement,
        });
        return;
      }
    });
  }, [categoryList]);
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

  useEffect(() => {
    try {
      const unsubcribe = dispatch(
        categoryActions.fetchCategory(specificProduct.storeId),
      );
      return unsubcribe;
    } catch (error) {
      console.log('Error at MyMeasurementBookScreen: ' + error);
    }
  }, []);

  const requestHandler = async () => {
    Keyboard.dismiss();
    if (
      !inputState.formIsValid ||
      !dynamicInputState ||
      Object.keys(dynamicInputState.dynamicInputValues).length === 0
    ) {
      setInputError(true);
    } else {
      const orderItem = [
        {
          id: 1,
          isRated: false,
          productCategory: specificProduct.productCategory,
          productDescription: '',
          productId: specificProduct.id,
          productPrice: '',
          productPrimaryImage: specificProduct.productPrimaryImage,
          productTitle: 'Custom ' + specificProduct.productTitle,
          quantity: inputState.inputValues.quantity,
          storeId: specificProduct.storeId,
          photos: 'default.png',
          measurements: dynamicInputState.dynamicInputValues,
        },
      ];

      dispatch(
        orderActions.createCustomizeOrderRequest(
          orderItem,
          '',
          specificProduct.storeId,
          specificStore.storeName,
          userInformation.username,
          userInformation.phoneNumber,
        ),
      );

      Alert.alert(
        'Order succeded',
        'Please wait if the order is accepted or declined',
        [
          {
            text: 'OK',
            onPress: () => {
              props.navigation.reset({routes: [{name: 'HOMEBOTTOM'}]});
              props.navigation.navigate('BOTTOMACCOUNT');
              props.navigation.navigate('USER ORDERS SCREEN');

              props.navigation.navigate('USER CUSTOM ORDERS', {
                screen: 'Pending User Custom Order',
              });
            },
          },
        ],
      );
    }

    /*  let control = true;
    Object.keys(measurements).forEach(key => {
      if (measurements[key] === '') {
        setInputError(true);
        control = false;
        return;
      }
    }); */
    /* 
    if (control) {
    } else {
      console.log('Some inputs are empty.');
    } */
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
    (id, inputValue, inputValidity) => {
      dispatchInputState({
        type: MODIFY_INPUT,
        value: inputValue,
        isValid: inputValidity,
        input: id,
      });
    },
    [dispatchInputState],
  );
  return (
    <View style={styles.container}>
      <ScrollView
        style={{width: '100%', height: '90%', marginBottom: '19%'}}
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: '2%',
          marginTop: '1.5%',
        }}>
        <Card style={styles.CardContainer}>
          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 5,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Order Detail
          </Text>
          <TwoLabelButton
            firstLabel="Product name"
            secondLabel={'Custom ' + specificProduct.productTitle}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Category"
            secondLabel={specificProduct.productCategory}
            onPress={() => {}}
          />
          <CustomInputWithLabel
            //props send to customInput
            initialValue=""
            initiallyValid={false}
            required
            onlyNumbers
            isError={inputError}
            labelText={'quantity'}
            placeHolder={`Enter quantity`}
            errorText={`Invalid quantity`}
            //props to add on custom input
            id={'quantity'}
            onInputChange={inputChangeHandler}
            keyboardType="number-pad"
            returnKeyType="done"
          />

          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 5,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Measurements needed
          </Text>
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
            Object.keys(dynamicInputState.dynamicInputValues).length === 0 && (
              <ErrorText
                style={styles.errorText}
                errorText="Add at least 1 measurement"
              />
            )}
        </Card>
      </ScrollView>

      <ScrollView
        style={styles.buttonContainer}
        contentContainerStyle={{
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexGrow: 1,
          marginVertical: '1%',
        }}>
        <MainButton
          style={styles.saveButton}
          label="Request"
          onPress={requestHandler}
        />
      </ScrollView>
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
    width: '100%',
    height: '100%',
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
    textTransform: 'lowercase',
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

export default CustomizeProductScreen;

{
  /* <Text style={styles.textStyle}>Measurements</Text>;
{
  specificCategory != undefined &&
    specificCategory.measurement.map((item, index) => {
      return (
        <View key={index}>
          <LabelText style={styles.labelText} labelText={item + '*'} />
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
            keyboardType="number-pad"
            placeholder={item}
            value={measurements[item] || ''} // Set value from state
            onChangeText={text => handleInputChange(item, text)}
          />

          {inputError && measurements[item] == '' && (
            <ErrorText errorText={`Invalid ${item} measurement`} />
          )}
        </View>
      );
    });
}
 */
}

/* 
const handleInputChange = (measurement, text) => {
  text = text.replace(/[^0-9]/g, '');
  text = text.replace(/^0+/, '');
  setMeasurements(prevInputValues => ({
    ...prevInputValues,
    [measurement]: text,
  }));
}; */
