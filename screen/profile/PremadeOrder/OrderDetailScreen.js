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
import Feather from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';

import Card from '../../../Components/UI/Card';
import TwoLabelButton from '../../../Components/UI/CustomButton/TwoLabelButton';
import OrderDetailItem from '../../../Components/Item/OrderDetailItem';
import * as storeActions from '../../../store/actions/store';

const OrderDetailScreen = props => {
  const orders = props.route.params.orderItems;
  const dispatch = useDispatch();
  const approvedStore = useSelector(state =>
    state.store.approvedSpecificStores.find(
      store => store.storeId === orders.storeId,
    ),
  );

  useEffect(() => {
    dispatch(storeActions.fetchSpecificStore(orders.storeId));
  }, [orders.storeId]);


  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.storeNameContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE DETAIL', {
                storeId: approvedStore.storeId,
              });
            }}>
            <Text style={styles.storeNameText}>
              {approvedStore == undefined ? '' : approvedStore.storeName + ' >'}
            </Text>
          </TouchableWithoutFeedback>
        </View>
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
                />
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
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

export default OrderDetailScreen;
