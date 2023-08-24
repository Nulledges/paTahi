import firestore from '@react-native-firebase/firestore';

import notification from '../../models/notification';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
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
};
