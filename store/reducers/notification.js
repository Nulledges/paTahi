import {SET_NOTIFICATIONS} from '../actions/notification';
import {LOGOUT} from '../actions/authentication';
const initialState = {userNotifications: []};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return {
        ...state,
        userNotifications: action.notificationInfo,
      };
    case LOGOUT:
      return {...initialState};
    default:
      return state;
  }
};
