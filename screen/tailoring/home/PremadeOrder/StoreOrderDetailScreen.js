import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import OrderDetailItem from '../../../../Components/Item/OrderDetailItem';

const StoreOrderDetailScreen = props => {
  const orders = props.route.params.orderItems;

  return (
    <View style={styles.container}>
      <View style={styles.cartItemsContainer}>
        {orders.items.map(item => {
          return (
            <View key={item.id}>
              <OrderDetailItem
                key={item.id}
                quantity={item.quantity}
                productTitle={item.productTitle}
                productPrice={item.productPrice}
                images={item.productPrimaryImage}
              
                chosenSize={item.chosenSize}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  itemsContainer: {
    marginBottom: 51,
  },
  noItemContainer: {
    width: '100%',
    height: 250,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noItemButton: {
    width: 175,
    height: 35,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  storeNameContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  storeNameText: {color: 'black', fontWeight: 'bold'},
  cartItemsContainer: {paddingBottom: 5, width: '100%'},
  addToCartButtonContainer: {
    width: '100%',
    height: 50,
    bottom: 0,
    position: 'absolute',
  },
  addToCartButtonItems: {
    width: '100%',
    flexDirection: 'row',
  },
  addToCartTextContainer: {
    width: '60%',
    alignSelf: 'flex-start',
    flexDirection: 'row-reverse',
  },
  addToCartPriceText: {
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold',
  },
  addToCartText: {
    color: 'black',
    marginRight: 5,
  },
  addToCartButton: {
    width: '40%',
  },
  textStyle: {
    color: 'black',
  },
});
export default StoreOrderDetailScreen;
