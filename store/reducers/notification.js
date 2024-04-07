import {
  SET_USER_NOTIFICATION,
  SET_TAILOR_NOTIFICATION,
  SET_ACTIVE_NOTIFICATION,
  SET_ACTIVETAILOR_NOTIFICATION,
} from '../actions/notification';
import {LOGOUT} from '../actions/authentication';
const initialState = {
  userNotifications: [],
  tailorNotifications: [],
  activeNotification: [],
  activeTailorNotification: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NOTIFICATION:
      return {
        ...state,
        userNotifications: action.notificationInfo,
      };
    case SET_TAILOR_NOTIFICATION:
      return {
        ...state,
        tailorNotifications: action.tailorNotificationInfo,
      };
    case SET_ACTIVE_NOTIFICATION:
      return {
        ...state,
        activeNotification: action.activeNotificationInfo,
      };
    case SET_ACTIVETAILOR_NOTIFICATION:
      return {
        ...state,
        activeTailorNotification: action.activeTailorNotificationInfo,
      };
    case LOGOUT:
      return {...initialState};
    default:
      return state;
  }
};
