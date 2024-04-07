import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Text,
  StatusBar,
  FlatList,
  ScrollView,
  Image,
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import ProductDetailImageItem from '../../Components/Item/ProductDetailItems/ProductDetailImageItem';
import ProductDetailInformationItems from '../../Components/Item/ProductDetailItems/ProductDetailInformationsItem';
import ProductDetailReviewItems from '../../Components/Item/ProductDetailItems/ProductDetailReviewItems';
import ProductDetailStoreItem from '../../Components/Item/ProductDetailItems/ProductDetailStoreItem';
import MainButton from '../../Components/UI/CustomButton/MainButton';
import Feather from 'react-native-vector-icons/Feather';
import Card from '../../Components/UI/Card';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/product';
import * as storeActions from '../../store/actions/store';
import * as ratingActions from '../../store/actions/ratingComment';
import * as userActions from '../../store/actions/user';
import ErrorText from '../../Components/UI/CustomText/ErrorText';

const ProductDetailScreen = props => {
  const dispatch = useDispatch();
  let totalStocks = 0;
  let stocksss = '';
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const productId = props.route.params?.productId;
  const storeId = props.route.params?.storeId;
  const userToken = useSelector(state => state.auth.token);
  const specificProduct = useSelector(
    state => state.products.specificProduct,
    shallowEqual,
  );
  const cartItems = useSelector(state => state.cart.items, shallowEqual);
  const cartProducts = useSelector(state => state.cart.cartProducts);
  const userInfo = useSelector(state => state.user.myInformation);
  const specificStore = useSelector(state =>
    state.store.approvedSpecificStores.find(
      store => store.storeId === storeId,
      shallowEqual,
    ),
  );
  {
    specificProduct.productVariation &&
      Object.values(specificProduct.productVariation).map(value => {
        totalStocks += parseInt(value);
      });
  }
  {
    specificProduct.productVariation &&
      Object.entries(specificProduct.productVariation).map(([key, value]) => {
        if (selectedOptions == key) {
          stocksss = value;
        }
      });
  }
  console.log(stocksss);

  const handleOptionSelect = option => {
    setQuantity(1);
    setSelectedOptions([option]);
  };
  const ratingAndReviewItem = useSelector(
    state => state.rating.productRatingAndReview,
    shallowEqual,
  );

  useEffect(() => {
    try {
      dispatch(storeActions.fetchSpecificStore(storeId));
      dispatch(productActions.fetchSpecificProduct(productId));
      dispatch(ratingActions.fetchProductRatingAndReview(productId));
    } catch (error) {
      console.log('Error on productDetailScreen: ' + error);
    }
  }, [storeId, productId]);

  //fetching userData
  useEffect(() => {
    try {
      if (userInfo == null && !!userToken) {
        const unsubcribe = dispatch(userActions.fetchUserData);
        return unsubcribe;
      }
    } catch (error) {
      console.log('Error at MyAccountScreen: ' + error);
    }
  }, []);

  //navigation options
  useEffect(() => {
    props.navigation.setOptions({
      headerTintColor: 'white',
      headerTransparent: true,
      headerBackVisible: false,
      headerTitle: '',
      headerStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },

      headerLeft: () => (
        <TouchableOpacity
          style={styles.goBackArrowContainer}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <View>
            <Ionicons name={'arrow-back'} size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.cartContainer}
          onPress={() => {
            if (!!userToken) {
              props.navigation.navigate('CART');
            } else {
              props.navigation.navigate('HOMESTACKLOGIN');
            }
          }}>
          <View>
            {cartProducts.length > 0 && (
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  backgroundColor: 'red',
                  zIndex: 100,
                  right: 1,
                  width: 12.5,
                  position: 'absolute',
                  borderRadius: 100,
                  opacity: 0.9,
                }}>
                <Text style={{fontWeight: 'bold'}}>{cartProducts.length}</Text>
              </View>
            )}
            <Ionicons name="md-cart" size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  });

  const addToCartHandler = () => {
    if (cartProducts.length > 0) {
      if (cartProducts[0].storeId != storeId) {
        if (selectedOptions.length != 0) {
          Alert.alert(
            'Remove your previous items?',
            'You already have items from other store if you continue your cart will be emptied',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  cartProducts.map(item => {
                    dispatch(cartActions.deleteProductFromCart(item.id));
                  });
                  setQuantity(1);
                  setSelectedOptions([]);
                  setIsVisible(!isVisible);
                  dispatch(
                    cartActions.AddProductToCart(
                      specificProduct,
                      quantity,
                      selectedOptions[0],
                    ),
                  );
                  /*    dispatch(
                  cartActions.addToCart(
                    specificProduct,
                    quantity,
                    selectedOptions[0],
                  ),
                ); */
                },
              },
            ],
          );
        }
      } else {
        if (selectedOptions.length != 0) {
          const filteredProducts = cartProducts.filter(items => {
            return (
              selectedOptions[0] === items.chosenSize &&
              specificProduct.id === items.productId
            );
          });
          if (filteredProducts.length > 0) {
            setQuantity(1);
            setSelectedOptions([]);
            setIsVisible(!isVisible);
            dispatch(
              cartActions.updateQuantityProductDetail(
                filteredProducts[0].id,
                filteredProducts[0].quantity,
                quantity,
                specificProduct,
                selectedOptions[0],
              ),
            );
          } else {
            setQuantity(1);
            setSelectedOptions([]);
            setIsVisible(!isVisible);
            dispatch(
              cartActions.AddProductToCart(
                specificProduct,
                quantity,
                selectedOptions[0],
              ),
            );
          }
          /*   cartProducts.map(items => {
            if (
              selectedOptions[0] == items.chosenSize &&
              specificProduct.id == items.productId
            ) {
              
            }
          });
       
     */
        }
      }
    } else {
      if (selectedOptions.length != 0) {
        setQuantity(1);
        setSelectedOptions([]);
        setIsVisible(!isVisible);
        dispatch(
          cartActions.AddProductToCart(
            specificProduct,
            quantity,
            selectedOptions[0],
          ),
        );
        dispatch(
          cartActions.addToCart(specificProduct, quantity, selectedOptions[0]),
        );
      }
    }
  };

  const goToStoreHandler = () => {
    props.navigation.navigate('STORE DETAIL', {
      storeId: specificProduct.storeId,
    });
  };
  const chatHandler = () => {
    if (!!userToken) {
      props.navigation.navigate('PRODUCT DETAIL CHAT', {
        storeName: specificStore.storeName,
        storeId: specificStore.storeId,
      });
    } else {
      props.navigation.navigate('HOMESTACKLOGIN');
    }
  };
  const customizeHandler = () => {
    if (!!userToken) {
      props.navigation.navigate('CUSTOMIZE PRODUCT', {
        specificProduct: specificProduct,
        specificStore: specificStore,
      });
    } else {
      props.navigation.navigate('HOMESTACKLOGIN');
    }
  };
  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={{marginBottom: '30%'}}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <ProductDetailImageItem
          primaryImage={
            specificProduct.productPrimaryImage == undefined
              ? []
              : specificProduct.productPrimaryImage
          }
          images={
            specificProduct.productImages == undefined
              ? []
              : specificProduct.productImages
          }
        />

        <ProductDetailInformationItems
          specificProduct={specificProduct == undefined ? '' : specificProduct}
          productName={
            specificProduct.productTitle == undefined
              ? ''
              : specificProduct.productTitle
          }
          productPrice={
            specificProduct.productPrice == undefined
              ? ''
              : parseInt(specificProduct.productPrice).toFixed(2)
          }
          productDescription={
            specificProduct.productDescription == undefined
              ? ''
              : specificProduct.productDescription
          }
          productStocks={
            specificProduct.productStock == undefined
              ? ''
              : specificProduct.productStock
          }
          productBodyMeasurementNeeded={
            specificProduct.bodyMeasurementNeeded == undefined
              ? []
              : specificProduct.bodyMeasurementNeeded
          }
        />
        <ProductDetailStoreItem
          storeIcon={specificStore == undefined ? '' : specificStore.storeIcon}
          name={specificStore == undefined ? '' : specificStore.storeName}
          goToStoreHandler={goToStoreHandler}
        />
        <ProductDetailReviewItems
          ratingAndReview={ratingAndReviewItem}
          ratings={specificProduct.ratings}
        />
      </ScrollView>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
        style={styles.buttonContainer}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flexDirection: 'row',
          }}>
          <MainButton
            style={styles.storeButton}
            label={'Chat Now'}
            onPress={chatHandler}
          />
          <MainButton
            style={
              totalStocks
                ? styles.addToCartButton
                : styles.addToCartButtonDisabled
            }
            label={'Add to Cart'}
            onPress={() => {
              if (!!userToken) {
                setIsVisible(!isVisible);
              } else {
                props.navigation.navigate('HOMESTACKLOGIN');
              }
            }}
            isDisabled={totalStocks ? false : true}
          />
        </View>
        <MainButton
          style={styles.customizeButton}
          label={'Customize'}
          onPress={customizeHandler}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(!isVisible);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsVisible(!isVisible);
          }}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      margin: 10,
                    }}>
                    Size
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      margin: 10,
                    }}>
                    Stocks:{stocksss}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',

                    alignItems: 'center',
                    marginHorizontal: 10,
                  }}>
                  {specificProduct.productVariation &&
                    Object.entries(specificProduct.productVariation).map(
                      ([key, value]) => {
                        return (
                          <TouchableOpacity
                            key={key}
                            style={[
                              value == 0
                                ? styles.checkboxDisabled
                                : styles.checkbox,
                              selectedOptions.includes(key) &&
                                styles.selectedCheckbox,
                            ]}
                            onPress={() =>
                              value == '' || value == 0
                                ? ''
                                : handleOptionSelect(key)
                            }>
                            <Text
                              style={
                                selectedOptions.includes(key)
                                  ? styles.checkboxTextActive
                                  : styles.checkboxTextInactive
                              }>
                              {key.toUpperCase()}
                            </Text>
                          </TouchableOpacity>
                        );
                      },
                    )}
                </View>

                <Text
                  style={{
                    color: 'black',
                    margin: 10,
                  }}>
                  Quantity
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: 10,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        quantity == 1
                          ? 'setQuantity(quantity - 1)'
                          : setQuantity(quantity - 1);
                      }}
                      style={{
                        backgroundColor: quantity == 1 ? 'grey' : 'black',
                        padding: 10,
                        height: 45,
                        marginRight: 25,
                      }}>
                      <Feather name={'minus'} size={24} color="white" />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: 'black',
                        alignSelf: 'center',
                      }}>
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        quantity >= stocksss
                          ? 'No more stock'
                          : setQuantity(quantity + 1);
                      }}
                      style={{
                        backgroundColor:
                          quantity >= stocksss ? 'grey' : 'black',

                        padding: 10,
                        height: 45,
                        marginLeft: 25,
                      }}>
                      <Feather name={'plus'} size={24} color="white" />
                    </TouchableOpacity>
                  </View>

                  <MainButton
                    style={
                      totalStocks && selectedOptions.length != 0
                        ? styles.addToCartButtonModal
                        : styles.addToCartButtonDisabledModal
                    }
                    label={'Add to Cart'}
                    onPress={addToCartHandler}
                    /*  isDisabled={
                    (specificProduct.smallStock >= 1 ||
                      specificProduct.mediumStock >= 1 ||
                      specificProduct.largeStock >= 1) &&
                    selectedOptions.length != 0
                      ? false
                      : true
                  } */
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  goBackArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  cartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 50,
  },

  redDotContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 5,
    height: 5,
    zIndex: 100,
    alignSelf: 'flex-end',
    borderRadius: 50,
    padding: 5,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  buttonContainer: {
    width: '100%',
    height: '14%',
    backgroundColor: '#ffffff',
    bottom: 0,
    position: 'absolute',
  },
  storeButton: {
    width: '49%',
    margin: 1,
    bottom: 0,
  },
  addToCartButton: {
    alignSelf: 'center',
    width: '49%',
    margin: 1,
    bottom: 0,
  },
  addToCartButtonDisabled: {
    alignSelf: 'center',
    width: '49%',

    margin: 1,
    bottom: 0,

    backgroundColor: 'grey',
  },
  addToCartButtonModal: {
    alignSelf: 'center',
    width: '49%',
    height: 45,
    margin: 1,
    bottom: 0,
  },
  addToCartButtonDisabledModal: {
    alignSelf: 'center',
    width: '49%',
    height: 45,
    margin: 1,
    bottom: 0,

    backgroundColor: 'grey',
  },
  customizeButton: {
    width: '99%',
    margin: 1,
    bottom: 0,
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    height: 250,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  checkbox: {
    width: 100,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',

    margin: 1,
  },
  checkboxDisabled: {
    width: 100,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    opacity: 0.1,
  },
  selectedCheckbox: {
    backgroundColor: 'black',
  },
  checkboxTextActive: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxTextInactive: {
    fontSize: 13,
    color: 'black',
  },
});

export default ProductDetailScreen;
