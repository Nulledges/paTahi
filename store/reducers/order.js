import {
  SET_USER_TOPICKUP_PREMADE_ORDERS,
  SET_USER_COLLECTED_PREMADE_ORDERS,
  SET_USER_REFUNDED_PREMADE_ORDERS,
  SET_STORETOPICKUP_ORDERS,
  SET_STORECOLLECTED_ORDERS,
  SET_STOREREFUNDED_ORDERS,
  SET_STOREPENDING_ORDER_REQUEST,
  SET_STOREACCEPTED_ORDER_REQUEST,
  SET_STOREONGOING_ORDER_REQUEST,
  SET_STORETOPICKUP_ORDER_REQUEST,
  SET_STORECOLLECTED_ORDER_REQUEST,
  SET_STORECANCELLED_ORDER_REQUEST,
  SET_USERPENDING_ORDER_REQUEST,
  SET_USERACCEPTED_ORDER_REQUEST,
  SET_USERONGOING_ORDER_REQUEST,
  SET_USERTOPICKUP_ORDER_REQUEST,
  SET_USERCOLLECTED_ORDER_REQUEST,
  SET_USERCANCELLED_ORDER_REQUEST,
  SET_USERUNSEEN_ORDER_REQUEST,
  SET_STOREUNSEEN_ORDER_REQUEST,
  SET_USERUNSEEN_ORDER,
  SET_STOREUNSEEN_ORDER,
} from '../actions/order';

import {LOGOUT} from '../actions/authentication';
import UserCancelledCustomOrderScreen from '../../screen/profile/CustomOrder/UserCancelledCustomOrderScreen';

const initialState = {
  //PREMANDE USER ORDERS
  userToPickupItems: [],
  userCollectedItems: [],
  userRefundedItems: [],
  userUnseenOrder: [],
  //PREMADE STORE ORDER
  storeToPickupItems: [],
  storeCollectedItems: [],
  storeRefundedItems: [],
  storeUnseenOrder: [],
  //CUSTOM USER ORDER
  userPendingRequest: [],
  userAcceptedRequest: [],
  userOngoingRequest: [],
  userPickupRequest: [],
  userCollectedRequest: [],
  userCancelledRequest: [],
  userUnseenRequest: [],
  //CUSTOM STORE ORDER
  storePendingRequest: [],
  storeAcceptedRequest: [],
  storeOngoingRequest: [],
  storeToPickupRequest: [],
  storeCollectedRequest: [],
  storeCancelledRequest: [],
  storeUnseenRequest: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_TOPICKUP_PREMADE_ORDERS:
      return {
        ...state,
        userToPickupItems: action.pickUpOrdersInfo,
      };
    case SET_USER_COLLECTED_PREMADE_ORDERS:
      return {
        ...state,
        userCollectedItems: action.collectedOrderInfo,
      };
    case SET_USER_REFUNDED_PREMADE_ORDERS:
      return {
        ...state,
        userRefundedItems: action.refundedOrderInfo,
      };
    case SET_STORETOPICKUP_ORDERS:
      return {
        ...state,
        storeToPickupItems: action.storePickUpOrdersInfo,
      };
    case SET_STORECOLLECTED_ORDERS:
      return {
        ...state,
        storeCollectedItems: action.storeCollectedOrderInfo,
      };
    case SET_STOREREFUNDED_ORDERS:
      return {
        ...state,
        storeRefundedItems: action.storeRefundedOrderInfo,
      };
    case SET_STOREPENDING_ORDER_REQUEST:
      return {
        ...state,
        storePendingRequest: action.storePendingInfo,
      };
    case SET_STOREACCEPTED_ORDER_REQUEST:
      return {
        ...state,
        storeAcceptedRequest: action.storeAcceptedInfo,
      };
    case SET_STOREONGOING_ORDER_REQUEST:
      return {
        ...state,
        storeOngoingRequest: action.storeOngoingInfo,
      };
    case SET_STORETOPICKUP_ORDER_REQUEST:
      return {
        ...state,
        storeToPickupRequest: action.storeToPickupInfo,
      };
    case SET_STORECOLLECTED_ORDER_REQUEST:
      return {
        ...state,
        storeCollectedRequest: action.storeCollectedInfo,
      };
    case SET_STORECANCELLED_ORDER_REQUEST:
      return {
        ...state,
        storeCancelledRequest: action.storeCancelledInfo,
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
    case SET_USERCOLLECTED_ORDER_REQUEST:
      return {
        ...state,
        userCollectedRequest: action.userCollectedInfo,
      };
    case SET_USERCANCELLED_ORDER_REQUEST:
      return {
        ...state,
        userCancelledRequest: action.userCancelledInfo,
      };
    case SET_USERUNSEEN_ORDER_REQUEST:
      return {
        ...state,
        userUnseenRequest: action.UnseenInfo,
      };
    case SET_USERUNSEEN_ORDER:
      return {
        ...state,
        userUnseenOrder: action.UnseenOrderInfo,
      };
    case SET_STOREUNSEEN_ORDER_REQUEST:
      return {
        ...state,
        storeUnseenRequest: action.storeUnseenInfo,
      };
    case SET_STOREUNSEEN_ORDER: {
      return {
        ...state,
        storeUnseenOrder: action.UnseenStoreOrderInfo,
      };
    }
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
