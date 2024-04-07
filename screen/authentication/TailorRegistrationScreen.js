import React, {useReducer, useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MainButton from '../../Components/UI/CustomButton/MainButton';
import CustomImagePicker from '../../Components/UI/CustomImagePicker/CustomImagePicker';
import CustomInputWithLabelAndLength from '../../Components/UI/Inputs/CustomInputWithLabelAndLength';
import CustomInputWithLabel from '../../Components/UI/Inputs/CustomInputWithLabel';
import CustomMapPicker from '../../Components/UI/MapMarkerPicker/CustomMapPicker';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';
import ErrorText from '../../Components/UI/CustomText/ErrorText';
import Card from '../../Components/UI/Card';
import * as storeActions from '../../store/actions/store';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const IMAGE_PICKER_UPDATE = 'IMAGE_PICKER_UPDATE';
const MAP_PICKER_UPDATE = 'MAP_PICKER_UPDATE';

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
const imagePickerReducer = (state, action) => {
  if (action.type === IMAGE_PICKER_UPDATE) {
    const updatedUri = {
      ...state.imageUri,
      [action.imageId]: action.uriValue,
    };
    const updatedFileName = {
      ...state.imageFileName,
      [action.imageId]: action.fileNameValue,
    };

    const updatedValidities = {
      ...state.imageValidities,
      [action.imageId]: action.isValid,
    };
    let updatedImageIsValid = true;
    for (key in updatedValidities) {
      updatedImageIsValid = updatedImageIsValid && updatedValidities[key];
    }
    return {
      imageUri: updatedUri,
      imageFileName: updatedFileName,
      imageValidities: updatedValidities,
      imageIsValid: updatedImageIsValid,
    };
  }
  return state;
};
const mapPickerReducer = (state, action) => {
  if (action.type === MAP_PICKER_UPDATE) {
    return {
      latitude: action.latitude,
      longitude: action.longitude,
      mapIsValid: action.isValid,
    };
  }
};
const TailorRegistrationScreen = props => {
  const dispatch = useDispatch();

  const [inputError, setInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputState, dispatchInputState] = useReducer(formReducer, {
    inputValues: {
      storeName: '',
      storeOwner: '',
      email: '',
      password: '',
      phone: '',
    },
    inputValidities: {
      storeName: false,
      storeOwner: false,
      email: false,
      password: false,
      phone: false,
    },
    formIsValid: false,
  });
  const [imagePickerState, dispatchImagePickerState] = useReducer(
    imagePickerReducer,
    {
      imageUri: {
        storeImage: '',
        storeIcon: '',
      },
      imageFileName: {
        storeImage: '',
        storeIcon: '',
      },
      imageValidities: {
        storeImage: false,
        storeIcon: false,
      },
      imageIsValid: false,
    },
  );
  const [mapPickerState, dispatchMapPickerState] = useReducer(
    mapPickerReducer,
    {
      latitude: '',
      longitude: '',
      mapIsValid: false,
    },
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
    (id, uri, fileName, imageValidity) => {
      dispatchImagePickerState({
        type: IMAGE_PICKER_UPDATE,
        uriValue: uri,
        fileNameValue: fileName,
        isValid: imageValidity,
        imageId: id,
      });
    },
    [dispatchImagePickerState],
  );
  const mapPickerChangeHandler = useCallback(
    (id, latitude, longitude, mapValidity) => {
      dispatchMapPickerState({
        type: MAP_PICKER_UPDATE,
        latitude: latitude,
        longitude: longitude,
        isValid: mapValidity,
        mapId: id,
      });
    },
    [dispatchMapPickerState],
  );

  const confirmHandler = async () => {
    Keyboard.dismiss();

    if (
      !imagePickerState.imageIsValid ||
      !inputState.formIsValid ||
      !mapPickerState.mapIsValid
    ) {
      setInputError(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        storeActions.createStore(
          inputState.inputValues.storeName,
          inputState.inputValues.storeOwner,
          inputState.inputValues.phone,
          imagePickerState.imageUri.storeImage,
          imagePickerState.imageFileName.storeImage,
          imagePickerState.imageUri.storeIcon,
          imagePickerState.imageFileName.storeIcon,
          inputState.inputValues.email,
          inputState.inputValues.password,
          mapPickerState.latitude,
          mapPickerState.longitude,
        ),
      );
      setIsLoading(false);
    }, 850);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: '2%',
        }}
        style={{
          width: '100%',
          height: '90%',
          marginBottom: '19%',
        }}>
        <Card style={styles.CardContainer}>
          <CustomImagePicker
            onImageChange={imageChangeHandler}
            id="storeIcon"
            imagePickerLabel="STORE ICON*"
            imageContainerStyle={styles.storeProfileIcon}
            isError={inputError}
            textIsVisible={false}
          />

          <CustomImagePicker
            onImageChange={imageChangeHandler}
            id="storeImage"
            imagePickerLabel="STORE IMAGE*"
            imageContainerStyle={styles.storeProfileImage}
            isError={inputError}
            textIsVisible={true}
          />

          <CustomMapPicker
            onPickerChange={mapPickerChangeHandler}
            id="location"
            label="STORE LOCATION*"
            isError={inputError}
          />

          <CustomInputWithLabelAndLength
            initialValue=""
            textLength={0}
            required
            isError={inputError}
            labelText="Store Name*"
            placeHolder="Enter store name"
            errorText="Please enter store name"
            maxLength={30}
            isMultiLine={false}
            //props to add on custom input
            id="storeName"
            onInputChange={inputChangeHandler}
            returnKeyType="done"
          />

          <CustomInputWithLabelAndLength
            initialValue=""
            textLength={0}
            required
            isError={inputError}
            labelText="Store Owner*"
            placeHolder="Enter store owner"
            errorText="Please enter store owner"
            maxLength={30}
            isMultiLine={false}
            //props to add on custom input
            id="storeOwner"
            onInputChange={inputChangeHandler}
            returnKeyType="done"
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
            blurOnSubmit={false}
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
            onPress={confirmHandler}
            label={'Register'}
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
    borderRadius: 10,
  },
  textStyle: {
    color: 'black',
    fontSize: 15,
    marginBottom: 10,
    marginLeft: '2%',
  },
  storeProfileIcon: {
    backgroundColor: 'grey',
    borderRadius: 200,
    height: 55,
    width: 55,
  },
  storeProfileImage: {
    width: '100%',
    height: 200,
  },
  text: {
    color: 'black',
  },
  secondTextFalseColor: {
    color: 'red',
  },
  secondTextTransformText: {
    textTransform: 'none',
  },
  buttonContainer: {
    backgroundColor: 'white',
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

export default TailorRegistrationScreen;
