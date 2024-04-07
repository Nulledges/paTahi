import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Card from '../UI/Card';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceHolder from 'react-native-skeleton-placeholder';
const OrderCustomerItem = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState();

  useEffect(() => {
    const downloadProductPrimaryImage = async () => {
      setIsLoading(true);
      setTimeout(async () => {
        const fromStorage = await storage()
          .ref('products/primary/' + props.productPrimaryImage)
          .getDownloadURL();

        setProductImage(fromStorage);
        setIsLoading(false);
      }, 200);
    };
    downloadProductPrimaryImage();
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
            productImage && (
              <Image
                resizeMode="stretch"
                style={styles.image}
                source={{uri: productImage}}
              />
            )
          )}
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.textStyle}>
              {props.productTitle + `(${props.chosenSize})`}
            </Text>
          </View>

          <View style={styles.quantityContainer}>
            <View
              style={{
                width: '60%',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.textStyle}>
                ₱ {parseInt(props.productPrice).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                width: '40%',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              <Text style={styles.textStyle}>
                {'x' + props.productQuantity}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    margin: 5,
  },
  imageContainer: {
    width: '20%',
    height: 75,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textStyle: {
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%',
    padding: 5,
  },
  quantityContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default OrderCustomerItem;
