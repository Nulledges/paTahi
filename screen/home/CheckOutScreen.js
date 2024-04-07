import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {v4 as uuid} from 'uuid';

import Card from '../../Components/UI/Card';
import MainButton from '../../Components/UI/CustomButton/MainButton';
import {useDispatch, useSelector} from 'react-redux';
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/order';
import * as paymentActions from '../../store/actions/payment';
import * as productActions from '../../store/actions/product';
import CheckoutItems from '../../Components/Item/CheckoutItems';
import WebViewItem from '../../Components/Item/WebViewItem';
const CheckOutScreen = props => {
  const dispatch = useDispatch();
  /*   const timestamp = Date.now();
  const combinedUniqueId = `${uniqueId}-${timestamp}`; */
  const cartTotalPrice = useSelector(state => state.cart.totalAmount);
  const specificProduct = useSelector(state => state.products.cartProducts);
  const cartItems = useSelector(state => state.cart.items);
  const approvedStore = useSelector(state => state.store.approvedCartStores);
  const paymentDetails = useSelector(state => state.payment.paymentDetails);
  const userInformation = useSelector(state => state.user.myInformation);
  const cartProducts = useSelector(state => state.cart.cartProducts);
  const paymentMethod = props.route.params?.paymentMethod;
  const uniqueStoreId = props.route.params?.uniqueStoreId;
  const [toPay, setToPay] = useState();
  const [showWebView, setShowWebView] = useState(false);

  useEffect(() => {
    const items = [];
    const products = [];
    cartProducts.map(items => {
      if (items.isSelected == true) {
        const item = {
          name: items.productTitle + `(${items.chosenSize})`,
          price: +items.productPrice,
          quantity: items.quantity,
        };
        products.push(item);
      }
    });
    items.push({id: uuid(), items: products});

    setToPay(items);
  }, []);
  useEffect(() => {
    if (paymentDetails.length == undefined) {
      setShowWebView(false);
      uniqueStoreId.map(storeIdItem => {
        const cartStoreInfo = approvedStore.find(
          cart => cart.storeId == storeIdItem,
        );

        let cartStoreItems = [];
        let productIds = [];

        let totalPrice = 0;
        cartProducts.map(cart => {
          if (cart.storeId == storeIdItem && cart.isSelected == true) {
            totalPrice = +totalPrice + +cart.productPrice * +cart.quantity;
            cartStoreItems.push(cart);
            productIds.push(cart.productId);

            dispatch(
              productActions.updateProductStock(
                cart.productId,
                cart.quantity,
                cart.chosenSize,
              ),
            );
            dispatch(cartActions.deleteProductFromCart(cart.id));
          }
        });

        dispatch(
          orderActions.addOrder(
            cartStoreItems,
            totalPrice,
            storeIdItem,
            cartStoreInfo.storeName,
            userInformation.username,
            userInformation.phoneNumber,
          ),
        );
      });

      dispatch(paymentActions.emptyPaymentDetail());
      Alert.alert('Payment', 'Payment succeded', [
        {
          text: 'OK',
          onPress: () => {
            props.navigation.reset({routes: [{name: 'HOMEBOTTOM'}]});
            props.navigation.navigate('BOTTOMACCOUNT');
            props.navigation.navigate('USER ORDERS SCREEN');

            props.navigation.navigate('MY ORDERS', {
              screen: 'TOPICKUP',
            });                   
          },
        },
      ]);
    }
  }, [paymentDetails]);
  const placeOrderHandler = () => {
    setShowWebView(true);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={showWebView}
        onRequestClose={!setShowWebView}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              setShowWebView(false);
            }}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <WebViewItem items={toPay} />
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={styles.itemsContainer}>
        {uniqueStoreId.map(storeIdItem => {
          let totalPrice = 0;
          let quantity = 0;
          const store = approvedStore.find(
            store => store.storeId == storeIdItem,
          );
          return (
            <View key={storeIdItem}>
              <View key={storeIdItem} style={styles.storeNameContainer}>
                <TouchableWithoutFeedback key={storeIdItem} onPress={() => {}}>
                  <Text style={styles.storeNameText} key={storeIdItem}>
                    {store == undefined ? '' : store.storeName}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.cartItemsContainer}>
                {cartProducts.map(cart => {
                  /*    const addProduct = specificProduct.find(
                    product => product.id === cart.productId,
                  ); */
                  if ((cart.storeId == storeIdItem, cart.isSelected == true)) {
                    totalPrice =
                      +totalPrice + +cart.productPrice * +cart.quantity;
                    quantity = +quantity + +cart.quantity;
                  }
                  return (
                    cart.storeId === storeIdItem &&
                    cart.isSelected == true && (
                      <View key={cart.id}>
                        <CheckoutItems
                          key={cart.id}
                          quantity={cart.quantity}
                          images={cart.productPrimaryImage}
                          productTitle={cart.productTitle}
                          productPrice={cart.productPrice}
                          chosenSize={cart.chosenSize}
                          /*  reqMeasurements={cart.reqMeasurements}
                          myMeasurements={cart.myMeasurements} */
                        />
                      </View>
                    )
                  );
                })}
              </View>
              <View style={styles.orderTotalContainer}>
                <TouchableWithoutFeedback
                  key={storeIdItem}
                  onPress={() => {
                    /*  props.navigation.navigate('PAYMENT METHOD', {
                      uniqueStoreId: uniqueStoreId,
                    }); */
                  }}>
                  <View style={styles.orderTotalItemContainer}>
                    <Text style={styles.textStyle}>{'Payment Method'}</Text>
                    <Text style={styles.textStyle}>PayPal</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.orderTotalContainer}>
                <View style={styles.orderTotalItemContainer}>
                  <Text style={styles.textStyle}>
                    {'Order Total ' + `(${quantity} Items):`}
                  </Text>
                  <Text style={styles.textStyle}>{totalPrice}</Text>
                </View>
              </View>
            </View>
          );
        })}
        <View style={styles.paymentDetailContainer}>
          <Text style={styles.textStyle}>Payment Details</Text>
          <View style={styles.paymentTotalItemContainer}>
            <Text style={styles.textSmallGrey}>Items Subtotal</Text>
            <Text style={styles.textSmallGrey}>₱ {cartTotalPrice} </Text>
          </View>
          <View style={styles.paymentTotalItemContainer}>
            <Text style={styles.textStyle}>Total Payment</Text>
            <Text style={styles.textStyle}>₱ {cartTotalPrice}</Text>
          </View>
        </View>
      </ScrollView>
      <Card style={styles.addToCartButtonContainer}>
        <View style={styles.addToCartButtonItems}>
          <View style={styles.addToCartTextContainer}>
            <Text style={styles.addToCartPriceText}>
              ₱ {parseInt(cartTotalPrice).toFixed(2)}
            </Text>
            <Text style={styles.addToCartText}>Total:</Text>
          </View>
          <View style={styles.addToCartButton}>
            <MainButton onPress={placeOrderHandler} label={'Place Order'} />
          </View>
        </View>
      </Card>
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
  storeNameContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  storeNameText: {color: 'black', fontWeight: 'bold'},
  cartItemsContainer: {marginBottom: 10, width: '100%'},
  orderTotalContainer: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 2.5,
    marginBottom: 10,
  },
  orderTotalItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  paymentDetailContainer: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 2.5,
    marginBottom: 10,
  },
  paymentTotalItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
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
  textSmallGrey: {
    color: 'rgba(0,0,0,0.3)',
    fontSize: 12,
  },
  closeButton: {
    width: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    zIndex: 1,
    backgroundColor: 'grey',
    padding: 5,
    borderRadius: 100,
    margin: 50,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default CheckOutScreen;
