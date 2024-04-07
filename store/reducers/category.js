import {LOGOUT} from '../actions/authentication';
import {SET_CATEGORY, SET_SPECIFIC_CATEGORY} from '../actions/category';
const initialState = {
  categoryList: [],
  categoryDetailInfo: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORY:
      return {
        ...state,
        categoryList: action.storeCategory,
      };
    case SET_SPECIFIC_CATEGORY:
      return {
        ...state,
        categoryDetailInfo: action.specificCategory,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
