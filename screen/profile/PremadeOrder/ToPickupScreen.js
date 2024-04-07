import React, {useEffect, useCallback} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../../Components/UI/Card';
import MainButton from '../../../Components/UI/CustomButton/MainButton';
import * as orderActions from '../../../store/actions/order';

import OrderCustomerItem from '../../../Components/Item/OrderCustomerItem';
const ToPickupScreen = props => {
  const dispatch = useDispatch();
  const toPickupOrders = useSelector(state => state.order.userToPickupItems);
/*   useFocusEffect(
    useCallback(() => {
      return dispatch(orderActions.fetchUserToPickUpPremadeOrders);
    }, []),
  ); */
  useEffect(() => {
    dispatch(orderActions.fetchUserToPickUpPremadeOrders);
    console.log('ToPickupScreen');
  }, []);

  const renderItem = ({item}) => {
    return (
      <View>
        <View
          key={item.id}
          style={{
            width: '100%',
            padding: 10,
            marginBottom: 1,
            backgroundColor: 'white',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>
          <TouchableWithoutFeedback
            key={item.id}
            onPress={() => {
              props.navigation.navigate('STORE DETAIL', {
                storeId: item.storeId,
              });
            }}>
            <Text style={{color: 'black', fontWeight: 'bold'}} key={item.id}>
              {item.storeName + ' >'}
            </Text>
          </TouchableWithoutFeedback>
        </View>

        <TouchableOpacity
          onPress={() => {
            dispatch(orderActions.updateUserPremadeToPickupSeen(item.id));
            props.navigation.navigate('ORDER DETAILS', {orderItems: item});
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
          {item.isUserSeen != false ? (
            <Text style={styles.notificationIndicatorSeen}>Seen</Text>
          ) : (
            <Text style={styles.notificationIndicatorUnseen}>Unseen</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        {toPickupOrders.length === 0 && (
          <Card style={styles.cardContainer}>
            <Text style={styles.textStyle}>No orders yet.</Text>
            <MainButton
              label={'Browse'}
              style={styles.noItemButton}
              textStyleProp={styles.textStyle}
              onPress={() => {
                props.navigation.reset({routes: [{name: 'HOMEBOTTOM'}]});
              }}
            />
          </Card>
        )}
        <FlatList
          data={toPickupOrders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={item => {
            return (
              <TouchableOpacity
                style={styles.showMoreContainer}
                onPress={() => {}}>
                {toPickupOrders.length >= 1 && (
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
export default ToPickupScreen;
