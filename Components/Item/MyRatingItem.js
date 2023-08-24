import React, {
  useState,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';
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
import Card from '../UI/Card';
import {AirbnbRating} from 'react-native-ratings';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceHolder from 'react-native-skeleton-placeholder';

const MyRatingItem = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [productPrimaryImage, setProductPrimaryImage] = useState();
  const [profileIcon, setProfileIcon] = useState();
  useEffect(() => {
    const downloadStoreImage = async () => {
      setIsLoading(true);
      setTimeout(async () => {
        const productPrimaryImage = await storage()
          .ref('products/primary/' + props.productPrimaryImage)
          .getDownloadURL();
        const profileIconImage = await storage()
          .ref('profile/' + props.profileIcon)
          .getDownloadURL();
        setProductPrimaryImage(productPrimaryImage);
        setProfileIcon(profileIconImage);
        setIsLoading(false);
      }, 200);
    };
    downloadStoreImage();
  }, [props.profileIcon, props.productPrimaryImage]);

  return (
    <Card style={styles.userInformationContainer}>
      <View style={{alignSelf: 'flex-start', width: '10%'}}>
        {profileIcon && (
          <Image
            resizeMode="stretch"
            style={styles.profileIcon}
            source={{uri: profileIcon}}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'column',
          width: '90%',
          alignItems: 'flex-start',
        }}>
        <Text numberOfLines={1} style={styles.textStyle}>
          {props.username}
        </Text>

        <AirbnbRating
          count={5}
          defaultRating={props.productRating}
          showRating={false}
          size={14}
          isDisabled={true}
        />
        <View style={styles.productReviewContainer}>
          <Text style={styles.textStyle}>{props.productReview}</Text>
        </View>

        <TouchableOpacity
          onPress={props.onProductPress}
          style={{
            width: '100%',
            backgroundColor: '#E8E8E8',
            flexDirection: 'row',
          }}>
          <View style={styles.imageContainer}>
            {productPrimaryImage && (
              <Image
                resizeMode="stretch"
                style={styles.image}
                source={{uri: productPrimaryImage}}
              />
            )}
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.textStyle}>{props.productTitle}</Text>
          </View>
        </TouchableOpacity>
        <Text style={{color: 'black', marginTop: 5}}>
          {props.dateReviewed.toDate().toDateString()}
        </Text>
      </View>
    </Card>
  );
};
const styles = StyleSheet.create({
  userInformationContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  profileIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
    borderRadius: 200,
    backgroundColor: 'black',
  },

  productReviewContainer: {marginVertical: 5},
  imageContainer: {
    width: '15%',
    height: 55,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textStyle: {
    color: 'black',
  },
});
export default MyRatingItem;
