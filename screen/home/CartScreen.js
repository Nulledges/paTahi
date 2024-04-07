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
import Card from '../../Components/UI/Card';
import MainButton from '../../Components/UI/CustomButton/MainButton';
import CartItem from '../../Components/Item/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/product';
import * as orderActions from '../../store/actions/order';
import * as storeActions from '../../store/actions/store';
const CartScreen = props => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueStoreId, setUniqueStoreId] = useState([]);
  const cartTotalPrice = useSelector(state => state.cart.totalAmount);
  const specificProduct = useSelector(state => state.products.cartProducts);
  const cartItems = useSelector(state => state.cart.items);
  const cartProducts = useSelector(state => state.cart.cartProducts);
  const approvedStore = useSelector(state => state.store.approvedCartStores);
  const selectedProducts = cartProducts.filter(
    product => product.isSelected,
  ).length;

  useEffect(() => {
    try {
      let uniqueStores = [];
      cartProducts.map(items => {
        uniqueStores.push(items.storeId);
      });
      const uniqueId = [...new Set(uniqueStores)];
      if (uniqueStores.length === 0) {
      } else {
        dispatch(productActions.fetchCartProducts(uniqueId));
        dispatch(storeActions.fetchCartStore(uniqueId));
      }
      setUniqueStoreId(uniqueId);
    } catch (error) {
      console.log('error at useEffect 1 ' + error);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (specificProduct.length > 0) {
      cartProducts.map(cart => {
        const addProduct = specificProduct.find(
          product => product.id === cart.productId,
        );
        for (const key in addProduct.productVariation) {
          if (cart.chosenSize == key) {
            if (cart.quantity > addProduct.productVariation[key]) {
              const exceededQuantity =
                cart.quantity - addProduct.productVariation[key];
              const newQuantity = cart.quantity - exceededQuantity;
              dispatch(
                cartActions.updateExceededQuantity(cart.id, newQuantity),
              );
              Alert.alert(
                'Stock error!',
                `Please note that due to limited stock, we've adjusted the quantity of ${cart.productTitle}(${cart.chosenSize}) in your cart.You now have ${newQuantity} units instead of the originally requested ${cart.quantity} units. `,
                [
                  {
                    text: 'OK',
                    onPress: () => {},
                  },
                ],
              );
            }
          }
        }
        /*     console.log(addProduct)
        console.log(cart.chosenSize); */
        /* switch (cart.chosenSize) {
          case 'small':
            if (cart.quantity > addProduct.smallStock) {
              const exceededQuantity = cart.quantity - addProduct.smallStock;
              const newQuantity = cart.quantity - exceededQuantity;
              dispatch(
                cartActions.updateExceededQuantity(cart.id, newQuantity),
              );
              Alert.alert(
                'Stock error!',
                `Please note that due to limited stock, we've adjusted the quantity of ${cart.productTitle}(${cart.chosenSize}) in your cart.You now have ${newQuantity} units instead of the originally requested ${cart.quantity} units. `,
                [
                  {
                    text: 'OK',
                    onPress: () => {},
                  },
                ],
              );

              break;
            }
            break;
          case 'medium':
            if (cart.quantity > addProduct.mediumStock) {
              const exceededQuantity = cart.quantity - addProduct.mediumStock;
              const newQuantity = cart.quantity - exceededQuantity;
              dispatch(
                cartActions.updateExceededQuantity(cart.id, newQuantity),
              );
              Alert.alert(
                'Stock error!',
                `Please note that due to limited stock, we've adjusted the quantity of ${cart.productTitle}(${cart.chosenSize}) in your cart.You now have ${newQuantity} units instead of the originally requested ${cart.quantity} units. `,
                [
                  {
                    text: 'OK',
                    onPress: () => {},
                  },
                ],
              );
              break;
            }
            break;
          case 'large':
            if (cart.quantity > addProduct.largeStock) {
              const exceededQuantity = cart.quantity - addProduct.largeStock;
              const newQuantity = cart.quantity - exceededQuantity;
              dispatch(
                cartActions.updateExceededQuantity(cart.id, newQuantity),
              );
              Alert.alert(
                'Stock error!',
                `Please note that due to limited stock, we've adjusted the quantity of ${cart.productTitle}(${cart.chosenSize}) in your cart.You now have ${newQuantity} units instead of the originally requested ${cart.quantity} units. `,
                [
                  {
                    text: 'OK',
                    onPress: () => {},
                  },
                ],
              );
              break;
            }
            break;
        } */
      });
    }
  }, []);
  /*   useEffect(() => {


    cartProducts.map(cart => {
      const addProduct = specificProduct.find(
        product => product.id === cart.productId,
      );


      switch (cart.chosenSize) {
        case 'small':
          if(cart.quantity > addProduct.smallStock){
            console.log(cart.quantity - addProduct.smallStock);
          }

      
          break;
      }
    });
  }, []); */
  /*   const renderItem = ({item}) => {
    return (
      <View>
    
        <CartItem productTitle={item.productTitle} />
      </View>                                                 
    );
  }; */

  const checkOutHandler = () => {
    if (selectedProducts != 0) {
      props.navigation.navigate('CHECKOUT', {
        uniqueStoreId: uniqueStoreId,
      });
    } else {
      Alert.alert('Error!', 'No item Selected', [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    }
    /*     if (selectedProducts != 0) {
      cartProducts.map(cart => {
        const addProduct = specificProduct.find(
          product => product.id === cart.productId,
        );

        switch (cart.chosenSize) {
          case 'small':
            if (cart.quantity > addProduct.smallStock) {
              console.log(cart.quantity - addProduct.smallStock);
              console.log('small');
            }

            break;
          case 'medium':
            if (cart.quantity > addProduct.mediumStock) {
              console.log(cart.quantity - addProduct.mediumStock);
              console.log('medium');
            }

            break;
          case 'large':
            if (cart.quantity > addProduct.largeStock) {
              console.log(cart.quantity - addProduct.largeStock);

              console.log('large');
            }
            break;
        }
      });
 
    } else {
      
    }
 */
    /* if (cartItems.length === 0) {
      return {};
    }
    uniqueStoreId.map(storeIdItem => {
      const cartStoreInfo = approvedStore.find(
        cart => cart.storeId == storeIdItem,
      );
 
      let cartStoreItems = [];
      let productIds = [];
      let totalPrice = 0;
      cartItems.map(cart => {

        if (cart.storeId == storeIdItem) {
          totalPrice = +totalPrice + +cart.productPrice * +cart.quantity;
          cartStoreItems.push(cart);
          productIds.push(cart.productId);
        }
      });
    }); */

    /*   cartStoreItems: cartStoreItems,
      productIds: productIds,
      totalPrice: totalPrice,
      storeIdItem: storeIdItem,
      storeName: cartStoreInfo.storeName, */
    /* , {
      cartStoreItems: cartStoreItems,
      productIds: productIds,
      totalPrice: totalPrice,
      storeIdItem: storeIdItem,
      storeName: cartStoreInfo.storeName,
    } */
    /* dispatch(
      orderActions.addOrder(
        cartStoreItems,
        productIds,
        totalPrice,
        storeIdItem,
        cartStoreInfo.storeName,
      ),
    )
    dispatch(cartActions.emptyCart()),
      props.navigation.reset({routes: [{name: 'HOME'}]}) */
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={styles.itemsContainer}>
        {cartProducts.length === 0 && (
          <Card style={styles.noItemContainer}>
            <Text style={styles.textStyle}>
              There are no items in this cart
            </Text>
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
        {uniqueStoreId.map(storeIdItem => {
          const store = approvedStore.find(
            store => store.storeId == storeIdItem,
          );

          return (
            <View key={storeIdItem}>
              <View key={storeIdItem} style={styles.storeNameContainer}>
                <TouchableWithoutFeedback
                  key={storeIdItem}
                  onPress={() => {
                    props.navigation.navigate('STORE DETAIL', {
                      storeId: storeIdItem,
                    });
                  }}>
                  <Text style={styles.storeNameText} key={storeIdItem}>
                    {store == undefined ? '' : store.storeName + ' >'}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.cartItemsContainer}>
                {cartProducts.map(cart => {
                  const addProduct = specificProduct.find(
                    product => product.id === cart.productId,
                  );

                  return (
                    cart.storeId === storeIdItem && (
                      <View key={cart.id}>
                        <CartItem
                          minus={() => {
                            dispatch(
                              cartActions.minusQuantityByOne(
                                cart.id,
                                cart.quantity,
                              ),
                            );
                          }}
                          plus={() => {
                            dispatch(
                              cartActions.addQuantityByOne(
                                cart.id,
                                cart.quantity,
                                addProduct,
                                cart.chosenSize,
                              ),
                            );
                          }}
                          key={cart.id}
                          cartId={cart.id}
                          quantity={cart.quantity}
                          productTitle={cart.productTitle}
                          productPrice={cart.productPrice}
                          images={cart.productPrimaryImage}
                          chosenSize={cart.chosenSize}
                          isSelected={cart.isSelected}
                          /*        productStock={addProduct.productStock} */
                          /*       reqMeasurements={cart.reqMeasurements}
                          myMeasurements={cart.myMeasurements} */
                        />
                      </View>
                    )
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
      {cartProducts.length > 0 && (
        <Card style={styles.addToCartButtonContainer}>
          <View style={styles.addToCartButtonItems}>
            <View style={styles.addToCartTextContainer}>
              <Text style={styles.addToCartPriceText}>
                ₱ {parseInt(cartTotalPrice).toFixed(2)}
              </Text>
              <Text style={styles.addToCartText}>Total:</Text>
            </View>
            <View style={styles.addToCartButton}>
              <MainButton
                onPress={checkOutHandler}
                label={'Check Out ' + `(${selectedProducts})`}
              />
            </View>
          </View>
        </Card>
      )}
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
export default CartScreen;
