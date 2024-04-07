import React, {useReducer, useState, useCallback, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Keyboard,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from '@reduxjs/toolkit';
import Feather from 'react-native-vector-icons/Feather';

import MainButton from '../../Components/UI/CustomButton/MainButton';
import Card from '../../Components/UI/Card';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';
import * as categoryActions from '../../store/actions/category';
import * as orderActions from '../../store/actions/order';
import CustomInputWithLabel from '../../Components/UI/Inputs/CustomInputWithLabel';
import ErrorText from '../../Components/UI/CustomText/ErrorText';
import LabelText from '../../Components/UI/CustomText/LabelText';
import AddProductImagePicker from '../../Components/UI/CustomImagePicker/AddProductImagePicker';
const IMAGE_PICKER_UPDATE = 'IMAGE_PICKER_UPDATE';
const IMAGE_PICKER_REMOVE = 'IMAGE_PICKER_REMOVE';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const imagePickerReducer = (state, action) => {
  if (action.type === IMAGE_PICKER_UPDATE) {
    const updatedUri = {
      ...state.images,
      [action.imageId]: [...state.images.designImages, action.imageValue],
    };

    let updatedIsValid = false;
    if (updatedUri.designImages.length > 0) {
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
      [action.imageId]: state.images.designImages.splice(action.value, 1),
    };
    const updatedUriWithoutUndefined = {
      designImages: updatedUri.designImages,
    };

    let updatedIsValid = false;
    if (updatedUriWithoutUndefined.designImages.length > 0) {
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

const CustomOrderScreen = props => {
  const dispatch = useDispatch();
  const categoryId = props.route.params?.categoryId;
  const specificCategory = useSelector(
    state => state.category.categoryDetailInfo,
  );
  const specificStore = useSelector(
    state => state.store.approvedSpecificStores,
  );
  const userInformation = useSelector(state => state.user.myInformation);

  const [inputError, setInputError] = useState(false);
  const [measurements, setMeasurements] = useState({});
  const [inputState, dispatchInputState] = useReducer(formReducer, {
    inputValues: {
      description: '',
      fabric: '',
    },
    inputValidities: {
      description: false,
      fabric: false,
    },
    formIsValid: false,
  });
  const [imagePickerState, dispatchImagePickerState] = useReducer(
    imagePickerReducer,
    {
      images: {
        designImages: [],
      },
      imageIsValid: false,
    },
  );

  const handleInputChange = (measurement, text) => {
    text = text.replace(/[^0-9]/g, '');
    text = text.replace(/^0+/, '');
    setMeasurements(prevInputValues => ({
      ...prevInputValues,
      [measurement]: text,
    }));
  };

  const categoryHandler = async () => {
    Keyboard.dismiss();

    let control = true;
    Object.keys(measurements).forEach(key => {
      if (
        measurements[key] === '' ||
        !inputState.formIsValid ||
        !imagePickerState.imageIsValid
      ) {
        setInputError(true);
        control = false;
        return;
      }
    });

    if (control) {
      Keyboard.dismiss();
      let photosFileName = [];
      imagePickerState.images.designImages.map(value => {
        photosFileName.push(value.imageFileName);
      });
      const orderItem = [
        {
          id: 1,
          isRated: false,
          productCategory: specificCategory.category,
          productDescription: inputState.inputValues.description,
          productId: 1,
          productPrice: '',
          productPrimaryImage: 'default.png',
          productTitle: 'Custom ' + specificCategory.category,
          quantity: 1,
          storeId: specificStore[0].storeId,
          photos: photosFileName,
          measurements: measurements,
        },
      ];
      dispatch(
        orderActions.createOrderRequest(
          orderItem,
          '',
          specificStore[0].storeId,
          specificStore[0].storeName,
          userInformation.username,
          userInformation.phoneNumber,
          imagePickerState.images.designImages,
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
            },
          },
        ],
      );
    } else {
      console.log('Some inputs are empty. User blocked.');
    }
  };
  useEffect(() => {
    if (specificCategory.length != 0) {
      const initialInputValues = {};
      specificCategory.measurements.forEach(item => {
        initialInputValues[item] = '';
      });
      setMeasurements(initialInputValues);
    }
  }, [specificCategory.measurements]);
  useEffect(() => {
    try {
      const unsubcribe = dispatch(
        categoryActions.fetchSpecificCategory(categoryId),
      );
      return unsubcribe;
    } catch (error) {
      console.log('Error at CustomOrderScreen: ' + error);
    }
  }, []);

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
        imageId: 'designImages',
      });
    },
    [dispatchImagePickerState],
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
        <Card style={styles.cardContainer}>
          <TwoLabelButton
            firstLabel="Category"
            secondLabel={specificCategory.category}
            onPress={() => {}}
          />
        </Card>
        <Card style={styles.cardContainer}>
          <Text style={styles.textStyle}>Measurements</Text>

          {specificCategory.length != 0 &&
            specificCategory.measurements.map((item, index) => {
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
                    <ErrorText
                      style={styles.errorText}
                      errorText="Invalid measurement"
                    />
                  )}
                </View>
              );
            })}
          <Text style={styles.textStyle}>Order Additional Detail</Text>

          <View>
            <Text
              style={{
                marginLeft: 2.5,
                color: 'black',
                textTransform: 'uppercase',
              }}>
              Design blueprint/image*
            </Text>
            <View style={styles.imagesList}>
              {imagePickerState.images.designImages.map((value, index) => {
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
              {imagePickerState.images.designImages.length > 2 ? (
                ''
              ) : (
                <AddProductImagePicker onImageChange={imageChangeHandler} />
              )}
            </View>
            {!imagePickerState.imageIsValid && inputError && (
              <ErrorText errorText="Please upload minimum (1) image of product" />
            )}
          </View>

          <CustomInputWithLabel
            initialValue=""
            initiallyValid={false}
            required
            isError={inputError}
            labelText="fabric*"
            placeHolder="fabric"
            errorText="Enter fabric"
            //props to add on custom input
            id="fabric"
            onInputChange={inputChangeHandler}
            returnKeyType="done"
            keyboardType="default"
            multiline={true}
            numberOfLines={4}
          />
          <CustomInputWithLabel
            initialValue=""
            initiallyValid={false}
            required
            isError={inputError}
            labelText="Description*"
            placeHolder="description"
            errorText="Enter description"
            style={{
              padding: 10,
              marginBottom: 5,
              borderBottomWidth: 1,
              height: 100,
              fontSize: 14,
              backgroundColor: '#E8E8E8',
              color: 'black',
              textAlignVertical: 'top',
            }}
            //props to add on custom input
            id="description"
            onInputChange={inputChangeHandler}
            returnKeyType="done"
            keyboardType="default"
            multiline={true}
            numberOfLines={4}
          />
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
          onPress={categoryHandler}
        />
      </ScrollView>
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
  labelText: {
    textTransform: 'uppercase',
    color: 'black',
    fontSize: 15,
  },
  cardContainer: {
    borderRadius: 10,
    width: '100%',
    padding: 10,
    marginBottom: 10,
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
  textStyle: {
    color: 'black',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 5,
  },
  errorText: {
    height: 30,
  },
});
export default CustomOrderScreen;
