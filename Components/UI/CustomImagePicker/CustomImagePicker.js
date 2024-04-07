import React, {useEffect, useState, useReducer, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Modal,
  Button,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Card from '../Card';
import ErrorText from '../CustomText/ErrorText';
import MainButton from '../CustomButton/MainButton';

const IMAGE_CHANGE = 'IMAGE_CHANGE';
const IMAGE_VALIDITY_CHANGE = 'IMAGE_VALIDITY_CHANGE';
const IMAGE_VISIBILITY_CHANGE = 'IMAGE_VISIBILITY_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const imagePickerReducer = (state, action) => {
  switch (action.type) {
    case IMAGE_CHANGE:
      return {
        ...state,
        uri: action.uri,
        fileName: action.fileName,
      };
    case IMAGE_VALIDITY_CHANGE:
      return {
        ...state,
        isValid: action.isValid,
      };
    case IMAGE_VISIBILITY_CHANGE:
      return {
        ...state,
        isVisible: action.isVisible,
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

const CustomImagePicker = props => {
  const [imagePickerState, dispatch] = useReducer(imagePickerReducer, {
    uri: '',
    fileName: '',
    isValid: false,
    isVisible: false,
    touched: false,
  });
  const {id, onImageChange} = props;
  useEffect(() => {
    onImageChange(
      id,
      imagePickerState.uri,
      imagePickerState.fileName,
      imagePickerState.isValid,
    );
  }, [id, onImageChange, imagePickerState]);

  /* const [modalImageVisibility, setModalImageVisibility] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUri, setImageUri] = useState();
  const [imageFileName, setImageFileName] = useState();
 */


  const takeImageHandler = async () => {
    try {
      launchCamera((mediaType = 'photo'), response => {
        if (response.didCancel) {
          if (!imagePickerState.uri) {
            dispatch({type: IMAGE_VALIDITY_CHANGE, isValid: false});
          }
        } else {
          response.assets.forEach(item => {
            dispatch({type: IMAGE_VISIBILITY_CHANGE, isVisible: false});
            dispatch({
              type: IMAGE_CHANGE,
              uri: item.uri,
              fileName: item.fileName,
            });
            dispatch({type: IMAGE_VALIDITY_CHANGE, isValid: true});
          });
        }
      });
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const chooseImageHandler = async () => {
    try {
      launchImageLibrary((mediaType = 'photo'), response => {
        if (response.didCancel) {
          if (!imagePickerState.uri) {
            dispatch({type: IMAGE_VALIDITY_CHANGE, isValid: false});
          }
        } else {
          response.assets.forEach(item => {
            dispatch({type: IMAGE_VISIBILITY_CHANGE, isVisible: false});
            dispatch({
              type: IMAGE_CHANGE,
              uri: item.uri,
              fileName: item.fileName,
            });
            dispatch({type: IMAGE_VALIDITY_CHANGE, isValid: true});
          });
        }
      });
    } catch (err) {
      console.log(err);
      return;
    }
  };

  return (
    <View style={styles.viewContainer}>
      <Text style={(styles.textStyle, {color: '#000'})}>
        {props.imagePickerLabel}
      </Text>
      <TouchableWithoutFeedback
        onPress={() => {
          dispatch({type: IMAGE_VISIBILITY_CHANGE, isVisible: true});
        }}>
        <View>
          <View style={{...styles.imagePreview, ...props.imageContainerStyle}}>
            {!imagePickerState.uri ? (
              props.textIsVisible && (
                <Text style={{color: '#000'}}>No image picked yet.</Text>
              )
            ) : (
              <Image
                resizeMode="stretch"
                style={{...styles.image, ...props.imageContainerStyle}}
                source={{uri: imagePickerState.uri}}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      {!imagePickerState.isValid && props.isError && (
        <ErrorText
          style={{marginRight: 10, marginVertical: 5}}
          errorText={'Please select take or select image.'}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imagePickerState.isVisible}
        onRequestClose={() => {
          dispatch({type: IMAGE_VISIBILITY_CHANGE, isVisible: false});
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            dispatch({type: IMAGE_VISIBILITY_CHANGE, isVisible: false});
          }}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.buttonModalContainer}>
                  <View style={styles.buttonMargin}>
                    <MainButton
                      style={styles.blackButton}
                      label="Take Image"
                      onPress={takeImageHandler}
                    />
                  </View>

                  <View>
                    <MainButton
                      style={styles.blackButton}
                      label="Choose Image"
                      onPress={chooseImageHandler}
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
  viewContainer: {
    width: '100%',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
    marginLeft: '2%',
  },

  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonModalContainer: {
    width: '95%',
    padding: 5,
  },
  blackButton: {
    width: '100%',
    borderRadius: 10,
  },
  buttonMargin: {
    marginBottom: 10,
  },
});
export default CustomImagePicker;
