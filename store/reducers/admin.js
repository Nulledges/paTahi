import {
  SET_PENDING_VERIFICATION_FORM,
  SET_ADMINAPPROVED_STORE,
} from '../actions/admin';
import {LOGOUT} from '../actions/authentication';

const initialState = {
  allPendingVerificationForms: [],
  approvedStores: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PENDING_VERIFICATION_FORM:
      return {
        ...state,
        allPendingVerificationForms: action.pendingStoreVerificationFormInfo,
      };
    case SET_ADMINAPPROVED_STORE:
      return {
        ...state,
        approvedStores: action.approvedStoreInfo,
      };
    case LOGOUT:
      return {...initialState};
    default:
      return state;
  }
};
