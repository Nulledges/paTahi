import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CHECK_CART,
  PLUS,
  MINUS,
  EMPTY_CART,
  ADD_TO_CART_PRODUCTS,
} from '../actions/cart';
import {LOGOUT} from '../actions/authentication';
import {Alert} from 'react-native';
import cartItem from '../../models/cartItem';
const initialState = {
  items: [],
  cartProducts: [],
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productVariantID = addedProduct.id + action.chosenSize;
      const quantity = action.quantity;

      let updatedOrNewCartItem;

      const cartItems = state.items.find(item => {
        return item.id === productVariantID;
      });
      /*  */
      if (cartItems) {
        switch (action.chosenSize) {
          case 'small':
            if (cartItems.quantity >= addedProduct.smallStock) {
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
              return {
                ...state,
              };
            } else {
              cartItems.quantity += parseInt(quantity);
              return {
                ...state,
                totalAmount: state.totalAmount + +addedProduct.productPrice,
              };
            }
          case 'medium':
            if (cartItems.quantity >= addedProduct.mediumStock) {
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
              return {
                ...state,
              };
            } else {
              cartItems.quantity += parseInt(quantity);
              return {
                ...state,
                totalAmount: state.totalAmount + +addedProduct.productPrice,
              };
            }
          case 'large':
            if (cartItems.quantity >= addedProduct.largeStock) {
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
              return {
                ...state,
              };
            } else {
              cartItems.quantity += parseInt(quantity);
              return {
                ...state,
                totalAmount: state.totalAmount + +addedProduct.productPrice,
              };
            }
        }
      } else {
        updatedOrNewCartItem = new cartItem(
          addedProduct.id,
          productVariantID,
          addedProduct.id,
          quantity,
          addedProduct.storeId,
          addedProduct.productCategory,
          addedProduct.productDescription,
          addedProduct.productPrimaryImage,
          addedProduct.productPrice,
          addedProduct.productTitle,
          false,
          action.chosenSize,
          false,
        );
      }

      const price = +addedProduct.productPrice * quantity;
      return {
        ...state,
        items: [...state.items, updatedOrNewCartItem],
        totalAmount: state.totalAmount + price,
      };
    case ADD_TO_CART_PRODUCTS:
      const product = action.cart_product;
      let totalAmount = 0;
      product.map(item => {
        if (item.isSelected) {
          const total = +item.productPrice * +item.quantity;
          totalAmount += total;
        }
      });

      return {
        ...state,
        cartProducts: product,
        totalAmount: totalAmount,
      };
    /* case CHECK_CART:
      const currentPrice = action.price;
      const isSelected = action.isSelected;
      const currentQuantity = action.quantity;
      if (isSelected == true) {
        const totalprice = currentPrice * currentQuantity;
        return {
          ...state,
          totalAmount: state.totalAmount + totalprice,
        };
      } else if (isSelected == false) {
        const totalprice = currentPrice * currentQuantity;
        return {
          ...state,
          totalAmount: state.totalAmount - +totalprice,
        };
      }
    case PLUS:
      const currentIsSelected = action.isSelected;
      if (currentIsSelected == true) {
        return {
          ...state,
          totalAmount: state.totalAmount + +action.price,
        };
      } */

    /* case REMOVE_FROM_CART:
      const VariantID = action.productId + action.chosenSize;
      const selectCartItem = state.items.find(item => {
        return item.id === VariantID;
      });

      const currentQty = selectCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        selectCartItem.quantity--;
      } else {
        updatedCartItems = {...state};
        const index = updatedCartItems.items
          .map(item => item.id)
          .indexOf(action.productId);
        updatedCartItems.items.splice(index, 1);
      }
      if (updatedCartItems === undefined) {
        return {
          ...state,
          totalAmount: state.totalAmount - +selectCartItem.productPrice,
        };
      }
      return {
        ...state,
        totalAmount: state.totalAmount - +selectCartItem.productPrice,
      };
 */
    case EMPTY_CART:
      return {
        ...initialState,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
