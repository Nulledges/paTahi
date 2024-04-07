import storeVerificationForm from '../../models/storeVerificationForm';
import stores from '../../models/stores';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const SET_PENDING_VERIFICATION_FORM = 'SET_PENDING_VERIFICATION_FORM';
export const SET_ADMINAPPROVED_STORE = 'SET_ADMINAPPROVED_STORE';
export const fetchPendingTailorApplication = (dispatch, getState) => {
  firestore()
    .collection('storeApplications')
    .where('status', '==', 'pending')
    .orderBy('dateSubmitted')
    .onSnapshot(querySnapshot => {
      const pendingStoreVerificationForm = [];
      querySnapshot.docs.forEach(item => {
        const applicationData = item.data();
        pendingStoreVerificationForm.push(
          new storeVerificationForm(
            applicationData.businessPermitImage,
            applicationData.dateSubmitted.toDate().toDateString(),
            applicationData.dateVerified,
            applicationData.status,
            applicationData.storeAddress,
            applicationData.storeId,
            applicationData.storeName,
            applicationData.storeOwner,
            item.id,
          ),
        );
      });

      dispatch({
        type: SET_PENDING_VERIFICATION_FORM,
        pendingStoreVerificationFormInfo: pendingStoreVerificationForm,
      });
    });
};

export const approveStore = (id, storeId) => {
  return async (dispatch, getState) => {
    const currentDate = new Date();
    firestore()
      .collection('storeApplications')
      .doc(id)
      .update({status: 'approved', dateVerified: currentDate});
    firestore().collection('stores').doc(storeId).update({status: 'approved'});
  };
};
export const rejectStore = (id, storeId) => {
  return async (dispatch, getState) => {
    const currentDate = new Date();
    firestore()
      .collection('storeApplications')
      .doc(id)
      .update({status: 'rejected', dateVerified: currentDate});
    firestore().collection('stores').doc(storeId).update({status: 'rejected'});
  };
};
export const fetchAllApprovedStore = (dispatch, getState) => {
  firestore()
    .collection('stores')
    .where('status', '==', 'approved')
    .onSnapshot(documentSnapshot => {
      const allApprovedStores = [];
      documentSnapshot.docs.forEach(item => {
        const approvedStore = item.data();

        allApprovedStores.push(
          new stores(
            approvedStore.storeId,
            approvedStore.activeProduct,
            approvedStore.email,
            approvedStore.inactiveProduct,
            approvedStore.phoneNumber,
            approvedStore.status,
            approvedStore.storeIcon,
            approvedStore.storeImage,
            approvedStore.storeName,
            approvedStore.storeOwner,
            item.id,
            approvedStore.latitude,
            approvedStore.longitude,
            approvedStore.isSubscribed,
            approvedStore.subscriptionId
          ),
        );
      });
      dispatch({
        type: 'SET_ADMINAPPROVED_STORE',
        approvedStoreInfo: allApprovedStores,
      });
    });
};
