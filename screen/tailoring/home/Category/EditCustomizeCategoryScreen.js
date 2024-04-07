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
import Feather from 'react-native-vector-icons/Feather';
import Card from '../../../../Components/UI/Card';
import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import CustomInputWithLabel from '../../../../Components/UI/Inputs/CustomInputWithLabel';
import ErrorText from '../../../../Components/UI/CustomText/ErrorText';

import * as categoryActions from '../../../../store/actions/category';

const ADD_CATEGORY = 'ADD_CATEGORY';
const customerReducer = (state, action) => {
  if (action.type === ADD_CATEGORY) {
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
const EditCustomizeCategoryScreen = props => {
  const dispatch = useDispatch();
  const categoryId = props.route.params.categoryId;

  const specificCategory = props.route.params.specificCategory;
  const [inputError, setInputError] = useState(false);

  const [measurementName, setMeasurementName] = useState([]);
  const [isMeasurementModalVisible, setIsMeasurementModalVisible] =
    useState(false);
  const [newMeasurement, setNewMeasurement] = useState('');
  const [modalInputError, setModalInputError] = useState(false);
  const [inputState, dispatchInputState] = useReducer(customerReducer, {
    inputValues: {category: specificCategory.category},
    inputValidities: {category: true},
    formIsValid: true,
  });

  useEffect(() => {
    if (measurementName.length == 0) {
      setMeasurementName(specificCategory.measurements);
    }
  }, []);

  const categoryHandler = async () => {
    if (!inputState.formIsValid || measurementName.length == 0) {
      setInputError(true);
    } else {
      Keyboard.dismiss();
      dispatch(
        categoryActions.updateCategory(
          categoryId,
          inputState.inputValues.category,
          measurementName,
        ),
      );
      props.navigation.goBack();
    }
  };
  const addNewMeasurement = () => {
    if (newMeasurement.trim() !== '') {
      setMeasurementName([...measurementName, newMeasurement]);
      setNewMeasurement('');
      setIsMeasurementModalVisible(false);
      setModalInputError(false);
    } else {
      setModalInputError(true);
    }
  };
  const removeSubcategory = index => {
    const updatedSubcategories = measurementName.filter((_, i) => i !== index);
    setMeasurementName(updatedSubcategories);
  };
  const inputChangeHandler = useCallback(
    (id, measurementValue, measurementValidity) => {
      dispatchInputState({
        type: ADD_CATEGORY,
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
          <CustomInputWithLabel
            //props send to customInput
            initialValue={specificCategory.category}
            initiallyValid={!!specificCategory}
            required
            isError={inputError}
            labelText="Category"
            placeHolder="Enter category"
            errorText="Invalid category"
            //props to add on custom input
            id="category"
            onInputChange={inputChangeHandler}
            returnKeyType="done"
          />
        </Card>
        <Card style={styles.CardContainer}>
          <Text style={styles.textStyle}>Measurements</Text>
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

          {measurementName.map((key, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => removeSubcategory(index)}
                style={styles.subcategoryContainer}>
                <Text style={styles.textStyle}>{key}</Text>
                <Feather name={'minus'} size={24} color="red" />
              </TouchableOpacity>
            );
          })}
          {inputError == true && measurementName.length == 0 && (
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
        }}>
        <MainButton
          style={styles.saveButton}
          label="Update"
          onPress={categoryHandler}
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
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 10,
  },
  subcategoryContainer: {
    backgroundColor: '#E8E8E8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  errorText: {
    height: 30,
  },
  addMeasurementButton: {
    width: '100%',
    backgroundColor: 'black',

    borderRadius: 10,
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
export default EditCustomizeCategoryScreen;
