import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Card from '../UI/Card';

import TwoLabelButton from '../UI/CustomButton/TwoLabelButton';
import storage from '@react-native-firebase/storage';
const CheckoutItems = props => {
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
        <View onPress={props.onPress} style={styles.imageContainer}>
          {productImage && (
            <Image style={styles.imageStyle} source={{uri: productImage}} />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.textStyle}>
              {props.productTitle}
              {`(${props.chosenSize})`}
            </Text>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.textStyle}>
              ₱ {parseInt(props.productPrice).toFixed(2)}
            </Text>
            <Text style={styles.textStyle}>X {props.quantity}</Text>
          </View>
        </View>
      </View>
      {/*  <Card style={styles.cardContainer}>
        {props.reqMeasurements.map(item => {
          if (
            props.myMeasurements.measurement[item] == undefined ||
            props.myMeasurements.measurement[item.toLowerCase()] == 0
          ) {
          }
          return (
            <TwoLabelButton
              key={item}
              FirstTextStyle={{paddingLeft: 25}}
              firstLabel={item.toLowerCase()}
              secondTextStyle={{paddingRight: 25}}
              secondLabel={
                props.myMeasurements.measurement[item.toLowerCase()] + ' inches'
              }
            />
          );
        })}
      </Card> */}
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
    margin: 5,
  },
  imageContainer: {
    width: '20%',
    height: 75,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%',
    padding: 5,
  },
  titleContainer: {},
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default CheckoutItems;
