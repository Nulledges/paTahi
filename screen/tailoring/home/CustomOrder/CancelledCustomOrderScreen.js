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
const CancelledCustomOrderScreen = props => {
  const dispatch = useDispatch();
  const storeInformation = useSelector(state => state.store.myStore);
  const cancelledOrderRequest = useSelector(
    state => state.order.storeCancelledRequest,
  );

  /*   useFocusEffect(
    useCallback(() => {
      dispatch(orderActions.fetchCancelledOrder(storeInformation.storeId));
    }, [dispatch]),
  ); */
  useEffect(() => {
    dispatch(orderActions.fetchCancelledOrder(storeInformation.storeId));
    console.log('CancelledCustomOrderScreen');
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
          {item.isStoreSeen != false ? (
            <Text style={styles.notificationIndicatorSeen}>Seen</Text>
          ) : (
            <Text style={styles.notificationIndicatorUnseen}>Unseen</Text>
          )}
          <Text
            style={[
              styles.textStyle,
              {fontWeight: 'bold', textTransform: 'uppercase'},
            ]}>
            Order Id: {item.id}
          </Text>
          <Text style={styles.textStyle}>
            Date Ordered: {item.dateOrdered.toDate().toDateString()}
          </Text>
          <Text style={styles.textStyle}>Status: {item.status}</Text>

          <Text style={styles.textStyle}>
            Category: {item.items[0].productCategory}
          </Text>
          <Text style={styles.textStyle}>Order Type: {item.orderType}</Text>
          <Text style={styles.textStyle}>{item.username}</Text>
          <Text style={styles.textStyle}>{item.userPhone}</Text>
          <View>
            <MainButton
              label={'View Detail'}
              style={styles.finishedButton}
              textStyleProp={styles.refundText}
              onPress={() => {
                dispatch(orderActions.updateStoreCancelledSeen(item.id));
                props.navigation.navigate(
                  'STORE CANCELLED CUSTOM ORDER DETAIL',
                  {
                    orderItems: item,
                  },
                );
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        {cancelledOrderRequest.length === 0 && (
          <Card style={styles.noItemContainer}>
            <Text style={styles.textStyle}>No order yet.</Text>
          </Card>
        )}
        <FlatList
          data={cancelledOrderRequest}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={item => {
            return (
              <TouchableOpacity
                style={styles.showMoreContainer}
                onPress={() => {}}>
                {cancelledOrderRequest.length >= 1 && (
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

export default CancelledCustomOrderScreen;
