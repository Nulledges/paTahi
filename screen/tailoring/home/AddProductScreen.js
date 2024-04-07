import React, {useReducer, useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Image,
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {useDispatch, useSelector} from 'react-redux';

import Card from '../../../Components/UI/Card';
import AddProductImagePicker from '../../../Components/UI/CustomImagePicker/AddProductImagePicker';
import ErrorText from '../../../Components/UI/CustomText/ErrorText';
import CustomInputWithLabelAndLength from '../../../Components/UI/Inputs/CustomInputWithLabelAndLength';
import CustomInputWithLabel from '../../../Components/UI/Inputs/CustomInputWithLabel';
import TwoLabelButton from '../../../Components/UI/CustomButton/TwoLabelButton';
import MainButton from '../../../Components/UI/CustomButton/MainButton';

import * as productActions from '../../../store/actions/product';

const IMAGE_PICKER_UPDATE = 'IMAGE_PICKER_UPDATE';
const IMAGE_PICKER_REMOVE = 'IMAGE_PICKER_REMOVE';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const MEASUREMENT = 'MEASUREMENT';
const ADD_MEASUREMENT = 'ADD_MEASUREMENT';
const DELETE_MEASUREMENT = 'DELETE_MEASUREMENT';
const EXISTING_MEASUREMENT = 'EXISTING_MEASUREMENT';
//images Reducer
const imagePickerReducer = (state, action) => {
  if (action.type === IMAGE_PICKER_UPDATE) {
    const updatedUri = {
      ...state.images,
      [action.imageId]: [...state.images.productImages, action.imageValue],
    };

    let updatedIsValid = false;
    if (updatedUri.productImages.length > 0) {
      updatedIsValid = true;
    } else {
      updatedIsValid = false;
    }
    return {
      images: updatedUri,
      imageIsValid: updatedIsValid,
    };
  } else if (action.type === IMAGE_PICKER_REMOVE) {
    const updatedUri = {
      ...state.images,
      [action.imageId]: state.images.productImages.splice(action.value, 1),
    };
    const updatedUriWithoutUndefined = {
      productImages: updatedUri.productImages,
    };

    let updatedIsValid = false;
    if (updatedUriWithoutUndefined.productImages.length > 0) {
      updatedIsValid = true;
    } else {
      updatedIsValid = false;
    }
    return {
      images: updatedUriWithoutUndefined,
      imageIsValid: updatedIsValid,
    };
  }
};
const primaryImagePickerReducer = (state, action) => {
  if (action.type === IMAGE_PICKER_UPDATE) {
    const updatedUri = {
      ...state.images,
      [action.imageId]: [...state.images.primaryImages, action.imageValue],
    };

    let updatedIsValid = false;
    if (updatedUri.primaryImages.length > 0) {
      updatedIsValid = true;
    } else {
      updatedIsValid = false;
    }
    return {
      images: updatedUri,
      imageIsValid: updatedIsValid,
    };
  } else if (action.type === IMAGE_PICKER_REMOVE) {
    const updatedUri = {
      ...state.images,
      [action.imageId]: state.images.primaryImages.splice(action.value, 1),
    };
    const updatedUriWithoutUndefined = {
      primaryImages: updatedUri.primaryImages,
    };

    let updatedIsValid = false;
    if (updatedUriWithoutUndefined.primaryImages.length > 0) {
      updatedIsValid = true;
    } else {
      updatedIsValid = false;
    }
    return {
      images: updatedUriWithoutUndefined,
      imageIsValid: updatedIsValid,
    };
  }
};
//Input Reducer
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
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
//Variation Reducecr
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
      const newVariation = action.payload;
      const stocks = action.stock;

      return {
        ...state,
        dynamicInputValues: {
          ...state.dynamicInputValues,
          [newVariation]: stocks,
        },
        dynamicInputValidities: {
          ...state.dynamicInputValidities,
          [newVariation]: true,
        },
        dynamicFormIsValid: true,
      };
    case DELETE_MEASUREMENT:
      const subCategoryToDelete = action.payload;

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
const AddProductScreen = props => {
  const dispatch = useDispatch();
  const productId = props.route.params?.productId;
  const storeId = props.route.params?.storeId;

  const [inputError, setInputError] = useState(false);
  const [modalInputError, setModalInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVariationModalVisible, setIsVariationModalVisible] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [categoryState, setCategoryState] = useState();
  const [newVariation, setNewVariation] = useState('');
  const [newStock, setnewStock] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionSelect = (option, stock) => {
    if (selectedOptions.includes(option)) {
      // If the option is already selected, remove it from the array
      setSelectedOptions(
        selectedOptions.filter(selected => selected !== option),
      );

      dispatchInputState({
        type: FORM_INPUT_UPDATE,
        value: '',
        isValid: true,
        input: stock,
      });
    } else {
      // If the option is not selected, add it to the array
      setSelectedOptions([...selectedOptions, option]);

      dispatchInputState({
        type: FORM_INPUT_UPDATE,
        value: '',
        isValid: false,
        input: stock,
      });
    }
  };
  const [initialPrimaryImage, setInitialPrimaryImage] = useState();
  const [primaryImagePickerState, dispatchPrimaryImagePickerState] = useReducer(
    primaryImagePickerReducer,
    {
      images: {
        primaryImages: [],
      },
      imageIsValid: false,
    },
  );
  const [imagePickerState, dispatchImagePickerState] = useReducer(
    imagePickerReducer,
    {
      images: {
        productImages: [],
      },
      imageIsValid: false,
    },
  );
  const [inputState, dispatchInputState] = useReducer(formReducer, {
    inputValues: {
      productTitle: '',
      productDescription: '',
      smallStock: '',
      mediumStock: '',
      largeStock: '',
      price: '',
    },
    inputValidities: {
      productTitle: false,
      productDescription: false,
      smallStock: true,
      mediumStock: true,
      largeStock: true,
      price: false,
    },
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

  //category
  useEffect(() => {
    setCategoryState(props.route.params?.category);
  }, [props.route.params?.category]);
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
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: id,
      });
    },
    [dispatchInputState],
  );
  const imageChangeHandler = useCallback(
    (uri, fileName) => {
      dispatchImagePickerState({
        type: IMAGE_PICKER_UPDATE,
        imageValue: {imageUri: uri, imageFileName: fileName},
        imageId: 'productImages',
      });
    },
    [dispatchImagePickerState],
  );

  const primaryImageChangeHandler = useCallback(
    (uri, fileName) => {
      dispatchPrimaryImagePickerState({
        type: IMAGE_PICKER_UPDATE,
        imageValue: {imageUri: uri, imageFileName: fileName},
        imageId: 'primaryImages',
      });
    },
    [dispatchPrimaryImagePickerState],
  );
  const saveHandler = async () => {
    Keyboard.dismiss();
    if (
      !primaryImagePickerState.imageIsValid ||
      !imagePickerState.imageIsValid ||
      !inputState.formIsValid ||
      !dynamicInputState.dynamicFormIsValid ||
      categoryState === undefined
    ) {
      setInputError(true);
      return;
    }
    setIsButtonDisable(true);
    dispatch(
      productActions.addProduct(
        storeId,
        inputState.inputValues.productTitle,
        imagePickerState.images.productImages,
        primaryImagePickerState.images.primaryImages,
        categoryState,
        inputState.inputValues.productDescription,
        dynamicInputState.dynamicInputValues,
        inputState.inputValues.price,
        false,
      ),
    );
    setIsButtonDisable(false);
    props.navigation.goBack();
  };
  const publishHandler = async () => {
    Keyboard.dismiss();
    if (
      !primaryImagePickerState.imageIsValid ||
      !imagePickerState.imageIsValid ||
      !inputState.formIsValid ||
      !dynamicInputState.dynamicFormIsValid ||
      categoryState === undefined
    ) {
      setInputError(true);
      return;
    }
    setIsButtonDisable(true);
    dispatch(
      productActions.addProduct(
        storeId,
        inputState.inputValues.productTitle,
        imagePickerState.images.productImages,
        primaryImagePickerState.images.primaryImages,
        categoryState,
        inputState.inputValues.productDescription,
        dynamicInputState.dynamicInputValues,
        inputState.inputValues.price,
        true,
      ),
    );
    setIsButtonDisable(false);
    props.navigation.goBack();
  };

  //modalHandlers
  const addNewVariation = () => {
    const trimmedVariation = newVariation.trim().toLowerCase();
    const stock = parseInt(newStock);

    if (
      !!stock &&
      !!trimmedVariation &&
      !(trimmedVariation in dynamicInputState.dynamicInputValues)
    ) {
      dispatchDynamicInputState({
        type: ADD_MEASUREMENT,
        payload: trimmedVariation,
        stock: newStock,
      });
      setNewVariation('');
      setnewStock('');
      setIsVariationModalVisible(false);
      setModalInputError(false);
    } else {
      setModalInputError(true);
    }
  };
  const deleteVariation = subCategoryToDelete => {
    dispatchDynamicInputState({
      type: DELETE_MEASUREMENT,
      payload: subCategoryToDelete,
    });
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}

      <ScrollView
        style={{width: '100%', height: '90%', marginBottom: '19%'}}
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: '2%',
          marginTop: '1.5%',
        }}>
        <Card style={styles.CardContainer}>
          <View>
            <Text
              style={{
                marginLeft: 2.5,
                color: 'black',
                textTransform: 'uppercase',
              }}>
              Primary Image*
            </Text>
            <View style={styles.imagesList}>
              {primaryImagePickerState.images.primaryImages.map(
                (value, index) => {
                  return (
                    <TouchableHighlight
                      onPress={() => {
                        dispatchPrimaryImagePickerState({
                          type: IMAGE_PICKER_REMOVE,
                          value: index,
                        });
                      }}
                      style={styles.imageBorder}
                      key={index}>
                      <Image
                        resizeMode="stretch"
                        style={styles.image}
                        source={{
                          uri: value.imageUri,
                        }}
                      />
                    </TouchableHighlight>
                  );
                },
              )}
              {primaryImagePickerState.images.primaryImages.length >= 1 ? (
                ''
              ) : (
                <AddProductImagePicker
                  onImageChange={primaryImageChangeHandler}
                />
              )}
            </View>
            {!primaryImagePickerState.imageIsValid && inputError && (
              <ErrorText errorText="Please upload minimum (1) image of product" />
            )}
          </View>
        </Card>
        <Card style={styles.CardContainer}>
          <View>
            <Text
              style={{
                marginLeft: 2.5,
                color: 'black',
                textTransform: 'uppercase',
              }}>
              Secondary Image*
            </Text>
            <View style={styles.imagesList}>
              {imagePickerState.images.productImages.map((value, index) => {
                return (
                  <TouchableHighlight
                    onPress={() => {
                      dispatchImagePickerState({
                        type: IMAGE_PICKER_REMOVE,
                        value: index,
                      });
                    }}
                    style={styles.imageBorder}
                    key={index}>
                    <Image
                      resizeMode="stretch"
                      style={styles.image}
                      source={{
                        uri: value.imageUri,
                      }}
                    />
                  </TouchableHighlight>
                );
              })}
              {imagePickerState.images.productImages.length > 2 ? (
                ''
              ) : (
                <AddProductImagePicker onImageChange={imageChangeHandler} />
              )}
            </View>
            {!imagePickerState.imageIsValid && inputError && (
              <ErrorText errorText="Please upload minimum (1) image of product" />
            )}
          </View>
        </Card>
        <Card style={styles.CardContainer}>
          <TwoLabelButton
            firstLabel="Category"
            secondLabel={`${
              props.route.params?.category ? props.route.params?.category : ''
            } >`}
            onPress={() => {
              props.navigation.navigate('SELECT CATEGORY', {
                productId: productId,
                storeId: storeId,
              });
            }}
          />
          {/* {bodyMeasurementState.length > 1 && (
            <Text
              style={{
                color: 'black',
                padding: 10,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              Body Measurements Needed
            </Text>
          )}
          {bodyMeasurementState.map((value, index) => {
            return (
              <TwoLabelButton
                key={index}
                firstLabel={value}
                onPress={() => {}}
              />
            );
          })} */}
          {!categoryState && inputError && (
            <ErrorText
              style={{marginTop: 5}}
              errorText="Please select a category"
            />
          )}
        </Card>
        {/*        <Card style={styles.CardContainer}>
          <Text
            style={{
              marginLeft: 2.5,
              color: 'black',
              textTransform: 'uppercase',
              marginBottom: 5,
            }}>
            Available Sizes
          </Text>
          <TouchableOpacity
            style={[
              styles.checkbox,
              selectedOptions.includes('S') && styles.selectedCheckbox,
            ]}
            onPress={() => handleOptionSelect('S', 'smallStock')}>
            <Text
              style={
                selectedOptions.includes('S')
                  ? styles.checkboxTextActive
                  : styles.checkboxTextInactive
              }>
              SMALL
            </Text>
          </TouchableOpacity>

          {selectedOptions.includes('S') && (
            <View>
              <CustomInputWithLabel
                //props send to customInput
                initialValue={''}
                required
                onlyNumbers
                isError={inputError}
                labelText="Stock*"
                placeHolder="Enter Stock"
                errorText="Please enter stock"
                maxLength={5}
                isMultiLine={true}
                //props to add on custom input
                id="smallStock"
                onInputChange={inputChangeHandler}
                returnKeyType="done"
                keyboardType="number-pad"
              />
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.checkbox,
              selectedOptions.includes('M') && styles.selectedCheckbox,
            ]}
            onPress={() => handleOptionSelect('M', 'mediumStock')}>
            <Text
              style={
                selectedOptions.includes('M')
                  ? styles.checkboxTextActive
                  : styles.checkboxTextInactive
              }>
              MEDIUM
            </Text>
          </TouchableOpacity>

          {selectedOptions.includes('M') && (
            <View>
              <CustomInputWithLabel
                //props send to customInput
                initialValue={''}
                required
                onlyNumbers
                isError={inputError}
                labelText="Stock*"
                placeHolder="Enter Stock"
                errorText="Please enter stock"
                maxLength={5}
                isMultiLine={true}
                //props to add on custom input
                id="mediumStock"
                onInputChange={inputChangeHandler}
                returnKeyType="done"
                keyboardType="number-pad"
              />
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.checkbox,
              selectedOptions.includes('L') && styles.selectedCheckbox,
            ]}
            onPress={() => handleOptionSelect('L', 'largeStock')}>
            <Text
              style={
                selectedOptions.includes('L')
                  ? styles.checkboxTextActive
                  : styles.checkboxTextInactive
              }>
              LARGE
            </Text>
          </TouchableOpacity>

          {selectedOptions.includes('L') && (
            <View>
              <CustomInputWithLabel
                //props send to customInput
                initialValue={''}
                required
                onlyNumbers
                isError={inputError}
                labelText="Stock*"
                placeHolder="Enter Stock"
                errorText="Please enter stock"
                maxLength={5}
                isMultiLine={true}
                //props to add on custom input
                id="largeStock"
                onInputChange={inputChangeHandler}
                returnKeyType="done"
                keyboardType="number-pad"
              />
            </View>
          )}
          {selectedOptions.length == 0 && inputError && (
            <ErrorText
              style={{marginTop: 5}}
              errorText="Please select a size"
            />
          )}
        </Card> */}
        <Card style={styles.CardContainer}>
          <View
            style={{
              fle1: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 5,
            }}>
            <Text
              style={{
                marginLeft: 2.5,
                color: 'black',
                textTransform: 'uppercase',
                marginBottom: 5,
                alignSelf: 'center',
              }}>
              Variations
            </Text>

            <MainButton
              style={{width: '45%', height: 40, margin: 1, borderRadius: 10}}
              label={'+ADD VARIATIONS'}
              onPress={() => {
                setIsVariationModalVisible(true);
              }}
            />
          </View>

          {Object.entries(dynamicInputState.dynamicInputValues).map(
            ([key, value]) => {
              return (
                <CustomInputWithLabel
                  //props send to customInput
                  initialValue={value}
                  initiallyValid={true}
                  required
                  onlyNumbers
                  deleteIcon
                  trashOnPress={() => {
                    deleteVariation(key);
                  }}
                  isError={inputError}
                  labelText={key}
                  placeHolder={`Enter ${key} stocks`}
                  errorText={`Invalid stocks`}
                  //props to add on custom input
                  id={key}
                  key={key}
                  onInputChange={dynamicInputChangeHandler}
                  keyboardType="number-pad"
                  returnKeyType="done"
                />
              );
            },
          )}
          {Object.keys(dynamicInputState.dynamicInputValues).length < 1 &&
            inputError && (
              <ErrorText
                style={{marginTop: 5}}
                errorText="Please add at least 1 variation."
              />
            )}
        </Card>
        <Card style={styles.CardContainer}>
          <View>
            <CustomInputWithLabelAndLength
              //props send to customInput
              initialValue={''}
              textLength={0}
              required
              isError={inputError}
              labelText="Product Name*"
              placeHolder="Enter Product Name"
              errorText="Please enter product Name"
              maxLength={100}
              isMultiLine={false}
              //props to add on custom input
              id="productTitle"
              onInputChange={inputChangeHandler}
              returnKeyType="done"
            />
          </View>
          <View>
            <CustomInputWithLabelAndLength
              //props send to customInput
              initialValue={''}
              textLength={0}
              required
              isError={inputError}
              labelText="Product Description*"
              placeHolder="Enter Product Description"
              errorText="Please enter Product Description"
              maxLength={200}
              isMultiLine={true}
              //props to add on custom input
              id="productDescription"
              onInputChange={inputChangeHandler}
              returnKeyType="done"
            />
          </View>

          <View>
            <CustomInputWithLabel
              //props send to customInput
              initialValue={''}
              required
              onlyNumbers
              isError={inputError}
              labelText="Price*"
              placeHolder="Enter Price"
              errorText="Please enter price"
              maxLength={5}
              isMultiLine={true}
              //props to add on custom input
              id="price"
              onInputChange={inputChangeHandler}
              returnKeyType="done"
              keyboardType="number-pad"
            />
          </View>
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
          textStyleProp={{
            color: 'black',
          }}
          style={styles.saveButton}
          label={'SAVE'}
          onPress={saveHandler}
          isDisabled={isButtonDisable}
        />
        <MainButton
          style={styles.publishButton}
          label={'PUBLISH'}
          onPress={publishHandler}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVariationModalVisible}
        onRequestClose={() => {
          setIsVariationModalVisible(false);
          setNewVariation('');
          setnewStock('');
          setModalInputError(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsVariationModalVisible(false);
            setNewVariation('');
            setnewStock('');
            setModalInputError(false);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <View style={styles.buttonModalContainer}>
                <View style={styles.buttonMargin}>
                  <Text
                    style={{
                      color: 'black',
                      textTransform: 'uppercase',
                      marginBottom: 5,
                    }}>
                    Add new variation
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
                    placeholder="Enter variation"
                    value={newVariation}
                    onChangeText={text => setNewVariation(text)}
                  />
                  {modalInputError && !newVariation && (
                    <ErrorText errorText="Enter a variation" />
                  )}
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
                    placeholder="Enter stock"
                    value={newStock}
                    onChangeText={text => setnewStock(text)}
                  />
                  {modalInputError && !newStock && (
                    <ErrorText errorText="Enter a stock" />
                  )}

                  <MainButton
                    style={styles.modalAddButton}
                    label={'ADD'}
                    onPress={addNewVariation}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    position: 'absolute',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
  },

  CardContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  imagesList: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imageBorder: {
    width: 100,
    height: 100,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    height: '10%',
    bottom: 0,
    position: 'absolute',
  },
  saveButton: {
    width: '45%',
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
  },
  publishButton: {
    width: '45%',
    margin: 5,
    borderRadius: 10,
  },

  checkbox: {
    width: 100,
    height: 50,
    borderRadius: 2000,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedCheckbox: {
    backgroundColor: 'black',
  },
  checkboxTextActive: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxTextInactive: {
    fontSize: 18,
    color: 'black',
  },
  textStyle: {color: 'black'},
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

export default AddProductScreen;
