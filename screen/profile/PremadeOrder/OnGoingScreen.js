import React, {useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../../Components/UI/Card';
import MainButton from '../../../Components/UI/CustomButton/MainButton';
import * as orderActions from '../../../store/actions/order';

import OrderCustomerItem from '../../../Components/Item/OrderCustomerItem';
const OnGoingScreen = props => {
  const dispatch = useDispatch();
  const ongoingOrders = useSelector(state => state.order.ongoingItems);

  useEffect(() => {
    dispatch(orderActions.fetchOnGoingOrders);
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
            {
              item.orderType == 'premade'
                ? props.navigation.navigate('ORDER DETAILS PREMADE', {
                    orderItems: item,
                  })
                : props.navigation.navigate('ORDER DETAILS', {
                    orderItems: item,
                  });
            }
          }}>
          {item.items.map(orderitem => {
            return (
              <OrderCustomerItem
                key={orderitem.id}
                productTitle={orderitem.productTitle}
                productPrice={orderitem.productPrice}
                productQuantity={orderitem.quantity}
                productPrimaryImage={orderitem.productPrimaryImage}
              />
            );
          })}
        </TouchableOpacity>
        <View style={styles.totalPriceContainer}>
          <Text style={{...styles.textStyle, ...{textTransform: 'uppercase'}}}>
            {item.orderType}
          </Text>
          <Text style={styles.textStyle}>{item.totalPrice}</Text>
        </View>
        <View style={styles.refundContainer}>
          <MainButton
            label={'REFUND'}
            style={styles.refundButton}
            textStyleProp={styles.refundText}
            onPress={() => {
              console.log('refund remove me');
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        {ongoingOrders.length === 0 && (
          <Card style={styles.cardContainer}>
            <Text style={styles.textStyle}>No orders yet.</Text>
            <MainButton
              label={'Browse'}
              style={styles.noItemButton}
              textStyleProp={styles.textStyle}
              onPress={() => {
                props.navigation.navigate('HOME');
              }}
            />
          </Card>
        )}
        <FlatList
          data={ongoingOrders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={item => {
            return (
              <TouchableOpacity
                style={styles.showMoreContainer}
                onPress={() => {}}>
                {ongoingOrders.length >= 1 && (
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
  totalPriceContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  refundContainer: {
    width: '100%',
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'white',
  },
  refundButton: {
    width: 175,
    height: 35,
    backgroundColor: 'red',
    borderRadius: 10,
    borderColor: 'red',
  },
  refundText: {
    color: '#FFFFFF',
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
});
export default OnGoingScreen;
