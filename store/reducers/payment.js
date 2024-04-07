import {LOGOUT} from '../actions/authentication';
import {ADD_PAYMENT_DETAIL, EMPTY_PAYMENT_DETAIL} from '../actions/payment';
const initialState = {
  paymentDetails: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PAYMENT_DETAIL:
      return {
        ...state,
        paymentDetails: action.paymentDetail,
      };
    case EMPTY_PAYMENT_DETAIL:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
