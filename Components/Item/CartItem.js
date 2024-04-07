import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';
import {useDispatch} from 'react-redux';
import Card from '../UI/Card';

import TwoLabelButton from '../UI/CustomButton/TwoLabelButton';
import CheckBox from '@react-native-community/checkbox';
import * as cartActions from '../../store/actions/cart';
const CartItem = props => {
  const dispatch = useDispatch();
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
        <View style={styles.checkBoxContainer}>
          <CheckBox
            disabled={false}
            value={props.isSelected}
            onChange={() => {
              dispatch(
                cartActions.updateProductIsSelected(
                  props.cartId,
                  props.isSelected,
                  props.productPrice,
                  props.quantity,
                ),
              );
            }}
            tintColors={{true: 'black', false: 'black'}}
          />
        </View>
        <View onPress={props.onPress} style={styles.imageContainer}>
          {productImage && (
            <Image style={styles.imageStyle} source={{uri: productImage}} />
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
                flexDirection: 'row',
                width: '40%',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                onPress={props.minus}
                style={{
                  backgroundColor: props.quantity == 1 ? 'red' : 'black',
                  borderRadius: 25,
                  padding: 10,
                }}>
                <Feather name={'minus'} size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.textStyle}>{props.quantity}</Text>
              <TouchableOpacity
                onPress={props.plus}
                style={{
                  backgroundColor: 'black',
                  borderRadius: 25,
                  padding: 10,
                }}>
                <Feather name={'plus'} size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* <Card style={styles.cardContainer}>
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
  checkBoxContainer: {
    width: '10%',
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
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
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '70%',
    padding: 5,
  },
  quantityContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CartItem;
