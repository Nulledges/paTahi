import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';
import Card from '../UI/Card';
import TwoLabelButton from '../UI/CustomButton/TwoLabelButton';
const OrderDetailPremadeItem = props => {
  const [productImage, setProductImage] = useState();
  useEffect(() => {
    const downloadProductImage = async () => {
      const fromStorage = await storage()
        .ref(`products/primary/` + props.images)
        .getDownloadURL();
      setProductImage(fromStorage);
    };
    downloadProductImage();
  }, [props.images]);
  return (
    <Card style={styles.container}>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={props.onPress} style={styles.imageContainer}>
          {productImage && (
            <Image style={styles.imageStyle} source={{uri: productImage}} />
          )}
        </TouchableOpacity>
        <Text style={styles.textStyle}>{props.productTitle}</Text>
        <Text style={styles.textStyle}>
          ₱ {parseInt(props.productPrice).toFixed(2)}
        </Text>
      </View>
    </Card>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    padding: 2.5,
  },
  itemContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  imageContainer: {
    width: '20%',
    height: 75,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  textStyle: {
    color: 'black',
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
});
export default OrderDetailPremadeItem;
