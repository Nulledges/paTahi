import firestore from '@react-native-firebase/firestore';

import notification from '../../models/notification';
export const SET_USER_NOTIFICATION = 'SET_USER_NOTIFICATION';
export const SET_TAILOR_NOTIFICATION = 'SET_TAILOR_NOTIFICATION';
export const SET_ACTIVE_NOTIFICATION = 'SET_ACTIVE_NOTIFICATION';
export const SET_ACTIVETAILOR_NOTIFICATION = 'SET_ACTIVETAILOR_NOTIFICATION';
export const addNotification = (
  notificationTitle,
  notificationBody,
  userId,
) => {
  return async (dispatch, getState) => {
    const currentDate = new Date();
    try {
      const notificationRef = firestore().collection('notifications').doc();
      await notificationRef.set({
        notificationTitle: notificationTitle,
        notificationBody: notificationBody,
        notificationStatus: false,
        notificationId: notificationRef.id,
        dateReceived: currentDate,
        userId: userId,
      });
      console.log('notification added');
    } catch (error) {
      console.log('Error on addNotification notification.js:', error);
    }
  };
};
/* export const fetchNotification = (dispatch, getState) => {
  const userId = getState().auth.userId;
  try {
    console.log(userId);
    firestore()
      .collection('notifications')
      .orderBy('dateReceived', 'desc')
      .where('userId', '==', userId)
      .onSnapshot(documentSnapshot => {
        let userNotifications = [];
        documentSnapshot.docs.forEach(item => {
          const notificationData = item.data();
          userNotifications.push(
            new notification(
              notificationData.dateReceived,
              notificationData.notificationBody,
              notificationData.notificationId,:
              notificationData.notificationStatus,
              notificationData.notificationTitle,
              notificationData.userId,
            ),
          );
        });
        dispatch({
          type: SET_NOTIFICATIONS,
          notificationInfo: userNotifications,
        });
      });
  } catch (error) {
    console.log('Error on fetchNotification notification.js:', error);
  }
}; */
export const fetchNotification = (dispatch, getState) => {
  const userId = getState().auth.userId;
  try {
    const notificitionQuery = firestore()
      .collection('notifications')
      .orderBy('dateReceived', 'desc')
      .where('userId', '==', userId);

    notificitionQuery.onSnapshot(documentSnapshot => {
      const userNotifications = [];
      documentSnapshot.docs.forEach(item => {
        const notificationData = item.data();

        userNotifications.push(
          new notification(
            notificationData.dateReceived,
            notificationData.notificationBody,
            notificationData.notificationId,
            notificationData.notificationStatus,
            notificationData.notificationTitle,
            notificationData.userId,
            notificationData.storeId,
            notificationData.mainScreen,
            notificationData.secondaryScreen,
          ),
        );
      });
      dispatch({
        type: SET_USER_NOTIFICATION,
        notificationInfo: userNotifications,
      });
    });
  } catch (error) {
    console.log('Error on fetchNotification notification.js:', error);
  }
};
export const fetchTailorNotification = storeId => {
  return (dispatch, getState) => {
    try {
      const notificitionQuery = firestore()
        .collection('notifications')
        .orderBy('dateReceived', 'desc')
        .where('storeId', '==', storeId);

      notificitionQuery.onSnapshot(documentSnapshot => {
        const tailorNotifications = [];
        documentSnapshot.docs.forEach(item => {
          const notificationData = item.data();
          tailorNotifications.push(
            new notification(
              notificationData.dateReceived,
              notificationData.notificationBody,
              notificationData.notificationId,
              notificationData.notificationStatus,
              notificationData.notificationTitle,
              notificationData.userId,
              notificationData.storeId,
              notificationData.mainScreen,
              notificationData.secondaryScreen,
            ),
          );
        });
        dispatch({
          type: SET_TAILOR_NOTIFICATION,
          tailorNotificationInfo: tailorNotifications,
        });
      });
    } catch (error) {
      console.log('Error on fetchTtailorNotification notification.js:', error);
    }
  };
};
export const fetchActiveNotification = (dispatch, getState) => {
  const userId = getState().auth.userId;
  try {
    const notificationQuery = firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .where('notificationStatus', '==', false);

    notificationQuery.onSnapshot(documentSnapshot => {
      const activeNotifications = [];
      documentSnapshot.docs.forEach(item => {
        const notificationData = item.data();

        activeNotifications.push(
          new notification(
            notificationData.dateReceived,
            notificationData.notificationBody,
            notificationData.notificationId,
            notificationData.notificationStatus,
            notificationData.notificationTitle,
            notificationData.userId,
            notificationData.storeId,
            notificationData.mainScreen,
            notificationData.secondaryScreen,
          ),
        );
      });
      dispatch({
        type: SET_ACTIVE_NOTIFICATION,
        activeNotificationInfo: activeNotifications,
      });
    });
  } catch (error) {
    console.log('Error on fetchNotification notification.js:', error);
  }
};
export const fetchActiveTailoringNotification = storeId => {
  return async (dispatch, getState) => {
    try {
      const notificationQuery = firestore()
        .collection('notifications')
        .where('storeId', '==', storeId)
        .where('notificationStatus', '==', false);

      notificationQuery.onSnapshot(documentSnapshot => {
        const activeNotifications = [];
        documentSnapshot.docs.forEach(item => {
          const notificationData = item.data();

          activeNotifications.push(
            new notification(
              notificationData.dateReceived,
              notificationData.notificationBody,
              notificationData.notificationId,
              notificationData.notificationStatus,
              notificationData.notificationTitle,
              notificationData.userId,
              notificationData.storeId,
              notificationData.mainScreen,
              notificationData.secondaryScreen,
            ),
          );
        });
        dispatch({
          type: SET_ACTIVETAILOR_NOTIFICATION,
          activeTailorNotificationInfo: activeNotifications,
        });
      });
    } catch (error) {
      console.log('Error on fetchNotification notification.js:', error);
    }
  };
};

export const updateMarkAsReadNotification = userId => {
  return async (dispatch, getState) => {
    try {
      const querySnapshot = await firestore()
        .collection('notifications')
        .where('notificationStatus', '==', false)
        .where('userId', '==', userId)
        .get();
      const batch = firestore().batch();
      querySnapshot.forEach(doc => {
        const docRef = doc.data();
        const notificationDoc = firestore()
          .collection('notifications')
          .doc(docRef.notificationId);
        batch.update(notificationDoc, {
          notificationStatus: true,
        });
      });
      await batch.commit();
    } catch (error) {
      console.log('error on updateMarkAsReadNotifcation at notification.js');
    }
  };
};
export const updateTailoringMarkAsReadNotification = storeId => {
  return async (dispatch, getState) => {
    try {
      const querySnapshot = await firestore()
        .collection('notifications')
        .where('notificationStatus', '==', false)
        .where('storeId', '==', storeId)
        .get();
      const batch = firestore().batch();
      querySnapshot.forEach(doc => {
        const docRef = doc.data();
        const notificationDoc = firestore()
          .collection('notifications')
          .doc(docRef.notificationId);
        batch.update(notificationDoc, {
          notificationStatus: true,
        });
      });
      await batch.commit();
    } catch (error) {
      console.log(
        'error on updateTailoringMarkAsReadNotifcation at notification.js',
      );
    }
  };
};

export const updateTailoringOnclickNotification = notificationId => {
  return async (dispatch, getState) => {
    try {
      firestore().collection('notifications').doc(notificationId).update({
        notificationStatus: true,
      });
    } catch (error) {
      console.log('error on updateOnclickNotification');
    }
  };
};
export const updateOnclickNotification = notificationId => {
  return async (dispatch, getState) => {
    try {
      firestore().collection('notifications').doc(notificationId).update({
        notificationStatus: true,
      });
    } catch (error) {
      console.log('error on updateOnclickNotification');
    }
  };
};
