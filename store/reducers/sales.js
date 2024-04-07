import {
  SET_YEARLY_SALES,
  SET_MONTHLY_SALES,
  SET_DAILY_SALES,
} from '../actions/sales';
import {LOGOUT} from '../actions/authentication';

const initialState = {
  yearSales: [],
  monthSales: [],
  dailySales: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_YEARLY_SALES:
      return {
        ...state,
        yearSales: action.yearlySalesData,
      };
    case SET_MONTHLY_SALES:
      return {
        ...state,
        monthSales: action.monthlySalesData,
      };

    case SET_DAILY_SALES:
      return {
        ...state,
        dailySales: action.dailySalesData,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
