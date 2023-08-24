import {LOGOUT} from '../actions/authentication';
import {
  SET_NOTRATED_ORDERS,
  SET_USERRATEDANDREVIEW_PRODUCTS,
  SET_PRODUCTRATINGANDREVIEW_PRODUCTS,
} from '../actions/ratingComment';

const initialState = {
  userNotRatedItems: [],
  userRatedAndReview: [],
  productRatingAndReview: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTRATED_ORDERS:
      return {
        ...state,
        userNotRatedItems: action.notRatedOrdersInfo,
      };
    case SET_USERRATEDANDREVIEW_PRODUCTS:
      return {
        ...state,
        userRatedAndReview: action.userRatedAndReviewInfo,
      };
    case SET_PRODUCTRATINGANDREVIEW_PRODUCTS:
      return {
        ...state,
        productRatingAndReview: action.productRatingAndReviewInfo,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
