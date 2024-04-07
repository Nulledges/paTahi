import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ScrollView,
  Keyboard,
  TextInput,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {AirbnbRating} from 'react-native-ratings';
import RatingAndReviewItem from '../../../Components/Item/RatingAndReviewItem';
import * as ratingAndReview from '../../../store/actions/ratingComment';
import Card from '../../../Components/UI/Card';
import MyRatingItem from '../../../Components/Item/MyRatingItem';
const RatingScreen = props => {
  const dispatch = useDispatch();
  const ratingInfo = useSelector(state => state.rating.userRatedAndReview);
  console.log(ratingInfo);
  useEffect(() => {
    try {
      dispatch(ratingAndReview.fetchUserRatedAndReview);
    } catch (error) {
      console.log('Error on ToRateScreen: ' + error);
    }
  }, []);

  const renderItem = ({item}) => {
    return (
      <MyRatingItem
        profileIcon={item.profileIcon}
        productPrimaryImage={item.productPrimaryImage}
        username={item.username}
        productRating={item.productRating}
        productTitle={item.productTitle}
        productReview={item.productReview}
        dateReviewed={item.dateReviewed}
        storeId={item.storeId}
        productId={item.productId}
        onProductPress={() => {
          props.navigation.navigate('PRODUCT DETAIL', {
            productId: item.productId,
            storeId: item.storeId,
          });
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {ratingInfo == '' && (
        <View style={styles.cardContainer}>
          <Text style={styles.textStyle}>No live products</Text>
        </View>
      )}
      <FlatList
        data={ratingInfo}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  cardContainer: {
    flex: 1,
    width: '97%',
    maxHeight: 146,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'black',
  },
});
export default RatingScreen;
