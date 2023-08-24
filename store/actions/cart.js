import firestore from '@react-native-firebase/firestore';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const EMPTY_CART = 'EMPTY_CART';
export const addToCart = (product, measurement, quantity) => {
  return {
    type: ADD_TO_CART,
    product: product,
    measurement: measurement,
    quantity: quantity,
  };
};
export const AddProductToCart = (product, measurement, quantity) => {
  return async (dispatch, getState) => {
    const cartRef = firestore().collection('cart').doc();
  };
};
export const removeFromCart = productId => {
  return {type: REMOVE_FROM_CART, productId: productId};
};

export const emptyCart = () => {
  return {type: EMPTY_CART};
};
