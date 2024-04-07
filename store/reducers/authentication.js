import {AUTHENTICATE, LOGOUT} from '../actions/authentication';

const initialState = {
  token: null,
  userId: null,
  userType: null,
  isTailor:null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        userType: action.userType,
        isTailor:action.isTailor
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
