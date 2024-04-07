import {LOGOUT} from '../actions/authentication';
import {SET_CUSTOMER, SET_CUSTOMER_DETAIL} from '../actions/customer';
const initialState = {
  customerList: [],
  customerDetailInfo: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CUSTOMER:
      return {
        ...state,
        customerList: action.storeCustomers,
      };
    case SET_CUSTOMER_DETAIL:
      return {
        ...state,
        customerDetailInfo: action.specificCustomer,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
