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
import ToRateItem from '../../../Components/Item/ToRateItem';
import Card from '../../../Components/UI/Card';
import * as ratingActions from '../../../store/actions/ratingComment';

const ToRateScreen = props => {
  const dispatch = useDispatch();
  const orderInfo = useSelector(state => state.rating.userNotRatedItems);
  useEffect(() => {
    try {
      dispatch(ratingActions.fetchNotRatedOrders);
    } catch (error) {
      console.log('Error on ToRateScreen: ' + error);
    }
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

        {item.items.map(orderitem => {
          if (orderitem.isRated === true) {
            return;
          }
          return (
            <ToRateItem
              key={orderitem.id}
              productTitle={orderitem.productTitle}
              productPrice={orderitem.productPrice}
              productQuantity={orderitem.quantity}
              productPrimaryImage={orderitem.productPrimaryImage}
              onToRatePress={() => {
                props.navigation.navigate('RATE PRODUCT', {
                  productTitle: orderitem.productTitle,
                  productPrice: orderitem.productPrice,
                  productPrimaryImage: orderitem.productPrimaryImage,
                  quantity: orderitem.quantity,
                  productId: orderitem.productId,
                  variantId: orderitem.id,
                  orderId: item.id,
                  storeId: orderitem.storeId,
                });
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        {orderInfo.length === 0 && (
          <Card style={styles.cardContainer}>
            <Text style={styles.textStyle}>Nothing to rate.</Text>
          </Card>
        )}
        <FlatList
          data={orderInfo}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={item => {
            return (
              <TouchableOpacity
                style={styles.showMoreContainer}
                onPress={() => {}}>
                {orderInfo.length >= 1 && (
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
});

export default ToRateScreen;
