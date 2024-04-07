import firestore from '@react-native-firebase/firestore';
import cartItem from '../../models/cartItem';
import {Alert} from 'react-native';
export const ADD_TO_CART = 'ADD_TO_CART';

export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const ADD_TO_CART_PRODUCTS = 'ADD_TO_CART_PRODUCTS';
export const CHECK_CART = 'CHECK_CART';
export const PLUS = 'PLUS';
export const MINUS = 'MINUS';
export const EMPTY_CART = 'EMPTY_CART';
export const addToCart = (product, quantity, chosenSize) => {
  return {
    type: ADD_TO_CART,
    product: product,
    quantity: quantity,
    chosenSize: chosenSize,
  };
};
export const AddProductToCart = (product, quantity, chosenSize) => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const cartRef = firestore().collection('cart').doc();
      await cartRef.set({
        id: cartRef.id,
        variantId: cartRef.id + chosenSize,
        productId: product.id,
        userId: userId,
        quantity: quantity,
        storeId: product.storeId,
        productCategory: product.productCategory,
        productDescription: product.productDescription,
        productPrimaryImage: product.productPrimaryImage,
        productPrice: product.productPrice,
        productTitle: product.productTitle,
        isRated: false,
        chosenSize: chosenSize,
        isSelected: false,
      });
    } catch (error) {
      console.log('error at AddProductToCart in cart.js ' + error);
    }
  };
};
export const fetchCartItems = userId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('cart')
        .where('userId', '==', userId)
        .onSnapshot(documentSnapshot => {
          const cartItems = [];
          documentSnapshot.docs.forEach(item => {
            const cartData = item.data();

            cartItems.push(
              new cartItem(
                cartData.id,
                cartData.variantId,
                cartData.productId,
                cartData.quantity,
                cartData.storeId,
                cartData.productCategory,
                cartData.productDescription,
                cartData.productPrimaryImage,
                cartData.productPrice,
                cartData.productTitle,
                cartData.isRated,
                cartData.chosenSize,
                cartData.isSelected,
              ),
            );
          });

          dispatch({type: ADD_TO_CART_PRODUCTS, cart_product: cartItems});
        });
    } catch (error) {
      console.log('error at fetchCartItems in cart.js ');
    }
  };
};
/* export const updateCartItems = userId => {}; */
export const removeFromCart = (productId, chosenSize) => {
  return {type: REMOVE_FROM_CART, productId: productId, chosenSize: chosenSize};
};
export const deleteProductFromCart = id => {
  return async (dispatch, getState) => {
    try {
      firestore()
        .collection('cart')
        .doc(id)
        .delete()
        .then(() => {
          console.log('cart deleted!');
        });
    } catch (error) {
      console.log('error from deleteProductFromCart');
    }
  };
};
export const updateProductIsSelected = (
  cartItemId,
  currentIsSelected,
  price,
  quantity,
) => {
  return async (dispatch, getState) => {
    try {
      const cartRef = firestore().collection('cart').doc(cartItemId);
      await cartRef.update({isSelected: !currentIsSelected}).then(() => {
        console.log('isSelected Updated');
      });
      dispatch({
        type: CHECK_CART,
        isSelected: !currentIsSelected,
        price: price,
        quantity: quantity,
      });
    } catch (error) {
      console.log('error on updateProductIsSelected at cart.js ' + error);
    }
  };
};
export const addQuantityByOne = (
  cartItemId,
  quantity,
  addedProduct,
  chosenSize,
) => {
  return async (dispatch, getState) => {
    try {
      const currentQuantity = quantity;
      const newQuantity = currentQuantity + 1;

      for (const key in addedProduct.productVariation) {
        if (chosenSize == key) {
          if (newQuantity > addedProduct.productVariation[key]) {
            Alert.alert(
              'Error!',
              addedProduct.productVariation[key] + ' stocks available',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
          } else {
            const cartRef = firestore().collection('cart').doc(cartItemId);
            await cartRef.update({quantity: newQuantity}).then(() => {
              console.log('isSelected Updated');
            });
          }
        }
      }
      /*    switch (chosenSize) {
        case 'small':
          if (newQuantity > addedProduct.smallStock) {
            Alert.alert(
              'Error!',
              addedProduct.smallStock + ' stocks available',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
            break;
          } else {
            const cartRef = firestore().collection('cart').doc(cartItemId);
            await cartRef.update({quantity: newQuantity}).then(() => {
              console.log('isSelected Updated');
            });
            break;
          }
        case 'medium':
          if (newQuantity > addedProduct.mediumStock) {
            Alert.alert(
              'Error!',
              addedProduct.mediumStock + ' stocks available',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
            break;
          } else {
            const cartRef = firestore().collection('cart').doc(cartItemId);
            await cartRef.update({quantity: newQuantity}).then(() => {
              console.log('isSelected Updated');
            });
            break;
          }
        case 'large':
          if (newQuantity > addedProduct.largeStock) {
            Alert.alert(
              'Error!',
              addedProduct.largeStock + ' stocks available',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
            break;
          } else {
            const cartRef = firestore().collection('cart').doc(cartItemId);
            await cartRef.update({quantity: newQuantity}).then(() => {
              console.log('isSelected Updated');
            });
            break;
          }
      }
 */
      /*    dispatch({
        type: PLUS,
        isSelected: currentIsSelected,
 
      }); */
    } catch (error) {
      console.log('error on addQuantityByOne at cart.js ' + error);
    }
  };
};
export const minusQuantityByOne = (cartItemId, quantity) => {
  return async (dispatch, getState) => {
    try {
      const currentQuantity = quantity;
      const newQuantity = currentQuantity - 1;
      const cartRef = firestore().collection('cart').doc(cartItemId);
      await cartRef.update({quantity: newQuantity}).then(() => {
        console.log('Minus quantity Updated');
      });
      if (newQuantity == 0) {
        firestore()
          .collection('cart')
          .doc(cartItemId)
          .delete()
          .then(() => {
            console.log('product deleted!');
          });
      }
    } catch (error) {
      console.log('error on addQuantityByOne at cart.js ' + error);
    }
  };
};
export const updateQuantityProductDetail = (
  cartItemId,
  cartquantity,
  addedQuantity,
  addedProduct,
  chosenSize,
) => {
  return async (dispatch, getState) => {
    try {
      const currentQuantity = cartquantity;
      const toBeAddedQuantity = addedQuantity;
      const newQuantity = currentQuantity + toBeAddedQuantity;
      for (const key in addedProduct.productVariation) {
        if (chosenSize == key) {
          if (newQuantity > addedProduct.productVariation[key]) {
            Alert.alert(
              'Error!',
              addedProduct.productVariation[key] + ' stocks available',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
          } else {
            const cartRef = firestore().collection('cart').doc(cartItemId);
            await cartRef.update({quantity: newQuantity}).then(() => {
              console.log('isSelected Updated');
            });
          }
        }
      }
     /*  switch (chosenSize) {
        case 'small':
          if (newQuantity > addedProduct.smallStock) {
            Alert.alert(
              'Error!',
              addedProduct.smallStock + ' stocks available',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
            break;
          } else {
            const cartRef = firestore().collection('cart').doc(cartItemId);
            await cartRef.update({quantity: newQuantity}).then(() => {
              console.log('isSelected Updated');
            });
            break;
          }
        case 'medium':
          if (newQuantity > addedProduct.mediumStock) {
            Alert.alert(
              'Error!',
              addedProduct.mediumStock + ' stocks available',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
            break;
          } else {
            const cartRef = firestore().collection('cart').doc(cartItemId);
            await cartRef.update({quantity: newQuantity}).then(() => {
              console.log('isSelected Updated');
            });
            break;
          }
        case 'large':
          if (newQuantity > addedProduct.largeStock) {
            Alert.alert(
              'Error!',
              addedProduct.largeStock + ' stocks available',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
            break;
          } else {
            const cartRef = firestore().collection('cart').doc(cartItemId);
            await cartRef.update({quantity: newQuantity}).then(() => {
              console.log('isSelected Updated');
            });
            break;
          }
      } */
    } catch (error) {
      console.log('error on updateQuantityProductDetail at cart.js ' + error);
    }
  };
};
export const updateExceededQuantity = (cartItemId, newQuantity) => {
  return async (dispatch, getState) => {
    const cartRef = firestore().collection('cart').doc(cartItemId);
    await cartRef.update({quantity: newQuantity}).then(() => {
      console.log('updateExceededQuantity updated');
    });
  };
};
export const emptyCart = () => {
  return {type: EMPTY_CART};
};
