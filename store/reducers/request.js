import {
  SET_PENDING_ORDER_REQUEST,
  SET_ACCEPTED_ORDER_REQUEST,
  SET_ONGOING_ORDER_REQUEST,
  SET_TOPICKUP_ORDER_REQUEST,
  SET_USERPENDING_ORDER_REQUEST,
  SET_USERACCEPTED_ORDER_REQUEST,
  SET_USERONGOING_ORDER_REQUEST,
  SET_USERTOPICKUP_ORDER_REQUEST,
} from '../actions/request';
import {EMPTY_CART} from '../actions/cart';
import {LOGOUT} from '../actions/authentication';
const initialState = {
  pendingRequest: [],
  acceptedRequest: [],
  ongoingRequest: [],
  toPickupRequest: [],
  userPendingRequest: [],
  userAcceptedRequest: [],
  userOngoingRequest: [],
  userPickupRequest: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PENDING_ORDER_REQUEST:
      return {
        ...state,
        pendingRequest: action.storePendingInfo,
      };
    case SET_ACCEPTED_ORDER_REQUEST:
      return {
        ...state,
        acceptedRequest: action.storeAcceptedInfo,
      };
    case SET_ONGOING_ORDER_REQUEST:
      return {
        ...state,
        ongoingRequest: action.storeOngoingInfo,
      };
    case SET_TOPICKUP_ORDER_REQUEST:
      return {
        ...state,
        toPickupRequest: action.storeToPickupInfo,
      };
    case SET_USERPENDING_ORDER_REQUEST:
      return {
        ...state,
        userPendingRequest: action.userPendingInfo,
      };
    case SET_USERACCEPTED_ORDER_REQUEST:
      return {
        ...state,
        userAcceptedRequest: action.userAcceptedInfo,
      };
    case SET_USERONGOING_ORDER_REQUEST:
      return {
        ...state,
        userOngoingRequest: action.userOngoingInfo,
      };
    case SET_USERTOPICKUP_ORDER_REQUEST:
      return {
        ...state,
        userPickupRequest: action.userPickupInfo,
      };
    case LOGOUT:
      return {...initialState};
    default:
      return state;
  }
};
