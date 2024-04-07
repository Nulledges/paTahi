import React, {useEffect, useCallback} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../../../Components/UI/Card';
import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import * as orderActions from '../../../../store/actions/order';
import OrderCustomerItem from '../../../../Components/Item/OrderCustomerItem';
import {useFocusEffect} from '@react-navigation/native';
const StoreCollectedOrdersScreen = props => {
  const dispatch = useDispatch();
  const storeInformation = useSelector(state => state.store.myStore);
  const storeCollectedOrders = useSelector(
    state => state.order.storeCollectedItems,
  );
  useEffect(() => {
    dispatch(orderActions.fetchStoreCollectedOrders(storeInformation.storeId));
    console.log('StoreCollectedOrdersScreen');
  }, []);
  /*   useFocusEffect(
    useCallback(() => {
      dispatch(
        orderActions.fetchStoreCollectedOrders(storeInformation.storeId),
      );
    }, [dispatch]),
  ); */

  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            dispatch(orderActions.updateStorePremadeCollectedSeen(item.id));
            props.navigation.navigate('STORE PREMADE ORDERS DETAILS', {
              orderItems: item,
            });
          }}>
          {item.items.map(orderitem => {
            return (
              <OrderCustomerItem
                key={orderitem.id}
                productTitle={orderitem.productTitle}
                productPrice={orderitem.productPrice}
                productQuantity={orderitem.quantity}
                productPrimaryImage={orderitem.productPrimaryImage}
                chosenSize={orderitem.chosenSize}
              />
            );
          })}
          {item.isStoreSeen != false ? (
            <Text style={styles.notificationIndicatorSeen}>Seen</Text>
          ) : (
            <Text style={styles.notificationIndicatorUnseen}>Unseen</Text>
          )}
        </TouchableOpacity>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.textStyle}>{item.totalPrice}</Text>
        </View>
        <View style={styles.finishedContainer}></View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        {storeCollectedOrders.length === 0 && (
          <Card style={styles.noItemContainer}>
            <Text style={styles.textStyle}>No order yet.</Text>
          </Card>
        )}
        <FlatList
          data={storeCollectedOrders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={item => {
            return (
              <TouchableOpacity
                style={styles.showMoreContainer}
                onPress={() => {}}>
                {storeCollectedOrders.length >= 1 && (
                  <View style={styles.showMoreInfoContainer}>
                    <Text style={styles.showMoreText}>View More</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  noItemContainer: {
    flex: 1,
    width: '97%',
    maxHeight: 146,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemButton: {
    width: 175,
    height: 35,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textStyle: {
    color: 'black',
  },
  itemContainer: {
    width: '100%',
    height: '100%',
  },

  showMoreContainer: {
    marginTop: 1,
    backgroundColor: '#FFFFFF',
  },
  totalPriceContainer: {
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    padding: 10,
    alignItems: 'flex-end',
  },
  finishedContainer: {
    width: '100%',
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'white',
  },
  finishedButton: {
    width: 175,
    height: 35,
    backgroundColor: 'black',
    borderRadius: 10,
  },

  showMoreInfoContainer: {
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showMoreText: {
    color: 'black',
  },
  notificationIndicatorSeen: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'green',
    textTransform: 'uppercase',
  },
  notificationIndicatorUnseen: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'red',
    textTransform: 'uppercase',
  },
});

export default StoreCollectedOrdersScreen;
