import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ScrollView,
  Keyboard,
} from 'react-native';
import Card from '../../Components/UI/Card';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceHolder from 'react-native-skeleton-placeholder';
import {AirbnbRating} from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import CustomInputWithLabelAndLength from '../../Components/UI/Inputs/CustomInputWithLabelAndLength';
import ErrorText from '../../Components/UI/CustomText/ErrorText';

import * as ratingActions from '../../store/actions/ratingComment';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

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
const RateProductScreen = props => {
  const dispatch = useDispatch();
  const [inputError, setInputError] = useState(false);
  const product = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [productPrimaryImage, setProductPrimaryImage] = useState();
  const [rating, setRating] = useState(5);

  const [inputState, dispatchInputState] = useReducer(formReducer, {
    inputValues: {
      Review: '',
    },
    inputValidities: {
      Review: false,
    },
    formIsValid: false,
  });

  const ratingCompleted = rating => {
    setRating(rating);
  };
  const confirmHandler = () => {
    Keyboard.dismiss();
    if (!inputState.formIsValid || rating === undefined) {
      setInputError(true);
      return;
    }
    dispatch(
      ratingActions.createRatingAndComment(
        product.productId,
        product.storeId,
        product.orderId,
        product.variantId,
        product.productTitle,
        product.productPrimaryImage,
        product.productPrice,
        product.quantity,
        rating,
        inputState.inputValues.Review,
      ),
    );
    props.navigation.goBack();
  };
  useEffect(() => {
    const downloadStoreImage = async () => {
      setIsLoading(true);
      setTimeout(async () => {
        const fromStorage = await storage()
          .ref('products/primary/' + product.productPrimaryImage)
          .getDownloadURL();

        setProductPrimaryImage(fromStorage);
        setIsLoading(false);
      }, 200);
    };
    downloadStoreImage();
  }, [product.productPrimaryImage]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={confirmHandler}>
          <ScrollView>
            <Ionicons name="md-checkmark-sharp" size={24} color="black" />
          </ScrollView>
        </TouchableOpacity>
      ),
    });
  });
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
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableWithoutFeedback>
        <Card style={styles.ProductContainer}>
          {productPrimaryImage && (
            <Image
              resizeMode="stretch"
              style={styles.productPrimaryImage}
              source={{uri: productPrimaryImage}}
            />
          )}
          <Text numberOfLines={1} style={styles.productTextStyle}>
            {product.productTitle}
          </Text>
        </Card>
      </TouchableWithoutFeedback>
      <Card style={styles.ReviewContainer}>
        <View style={styles.RatingContainer}>
          <Text style={styles.TextStyle}>PRODUCT RATING</Text>
          <AirbnbRating
            count={5}
            defaultRating={5}
            showRating={false}
            size={20}
            onFinishRating={ratingCompleted}
          />
        </View>

        <CustomInputWithLabelAndLength
          //props send to customInput
          initialValue=""
          initiallyValid={false}
          textLength={0}
          required
          isError={inputError}
          labelText="Review"
          placeHolder="Enter Review"
          errorText="Please enter a review"
          maxLength={200}
          isMultiLine={true}
          textInputStyle={styles.CustomInputStyle}
          //props to add on custom input
          id="Review"
          onInputChange={inputChangeHandler}
          returnKeyType="done"
        />
      </Card>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  ProductContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  productPrimaryImage: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  productTextStyle: {
    color: 'black',
    textAlignVertical: 'center',
  },
  TextStyle: {
    color: 'black',
    marginRight: 40,
  },
  ReviewContainer: {width: '100%', padding: 10},
  RatingContainer: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
  },
  CustomInputStyle: {
    justifyContent: 'flex-start',
    height: 200,
    textAlignVertical: 'top',
  },
});
export default RateProductScreen;
