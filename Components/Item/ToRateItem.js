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
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import Card from '../UI/Card';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceHolder from 'react-native-skeleton-placeholder';
const ToRateItem = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [productPrimaryImage, setProductPrimaryImage] = useState();
  useEffect(() => {
    const downloadStoreImage = async () => {
      setIsLoading(true);
      setTimeout(async () => {
        const fromStorage = await storage()
          .ref('products/primary/' + props.productPrimaryImage)
          .getDownloadURL();

        setProductPrimaryImage(fromStorage);
        setIsLoading(false);
      }, 200);
    };
    downloadStoreImage();
  }, [props.productPrimaryImage]);
  return (
    <Card style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          {isLoading ? (
            <SkeletonPlaceHolder backgroundColor="#a3a3a3">
              <SkeletonPlaceHolder.Item width={'100%'} height={200} />
            </SkeletonPlaceHolder>
          ) : (
            productPrimaryImage && (
              <Image
                resizeMode="stretch"
                style={styles.image}
                source={{uri: productPrimaryImage}}
              />
            )
          )}
        </View>
        <Text style={styles.textStyle}>{props.productTitle}</Text>
        <Text style={styles.textStyle}>{props.productPrice}</Text>
        <Text style={styles.textStyle}>{'x' + props.productQuantity}</Text>
      </View>
      <TouchableWithoutFeedback onPress={props.onToRatePress}>
        <View style={styles.ToRateContainer}>
          <Text style={styles.textStyle}>to rate {'>'}</Text>
        </View>
      </TouchableWithoutFeedback>
    </Card>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    margin: 10,
    height: 75,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  imageContainer: {
    width: '20%',
    height: 75,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textStyle: {
    color: 'black',
    textTransform: 'uppercase',
  },
  ToRateContainer: {
    padding: 10,
    alignItems: 'flex-end',
  },
});
export default ToRateItem;
