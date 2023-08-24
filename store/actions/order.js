import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import order from '../../models/order';
import functions from '@react-native-firebase/functions';
import notifee, {EventType} from '@notifee/react-native';
export const SET_ONGOING_ORDERS = 'SET_ONGOING_ORDERS';
export const SET_FINISHED_ORDERS = 'SET_FINISHED_ORDERS';
export const SET_COLLECTED_ORDERS = 'SET_COLLECTED_ORDERS';
export const SET_REFUNDED_ORDERS = 'SET_REFUNDED_ORDERS';
export const SET_STOREONGOING_ORDERS = 'SET_STOREONGOING_ORDERS';
export const SET_STOREFINISHED_ORDERS = 'SET_STOREFINISHED_ORDERS';
export const SET_STORECOLLECTED_ORDERS = 'SET_STORECOLLECTED_ORDERS';
export const SET_STOREREFUNDED_ORDERS = 'SET_STOREREFUNDED_ORDERS';
//
export const addOrder = (
  cartItems,
  productIDs,
  totalPrice,
  storeId,
  storeName,
/*   ratedStatus, */
) => {
  return async (dispatch, getState) => {
    try {
      const currentDate = new Date();
      const userId = getState().auth.userId;

      const orderRef = firestore().collection('orders').doc();
      await orderRef.set({
        id: orderRef.id,
        storeId: storeId,
        storeName: storeName,
        userId: userId,
        totalPrice: totalPrice,
        status: 'ongoing',
        items: cartItems,
        productId: productIDs,
        dateOrdered: currentDate,
        dateCollected: '',
       /*  isRated: false, */
     /*    ratedStatus: ratedStatus, */
      });
    } catch (error) {
      console.log('error at addOrder on orderJs: ' + error);
    }
  };
};
//Customer Orders Screen
export const fetchOnGoingOrders = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const orderRef = firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'ongoing')
      .where('userId', '==', userId)
      .limit(5);

    orderRef.onSnapshot(documentSnapshot => {
      const onGoingOrders = [];
      documentSnapshot.docs.forEach(item => {
        const onGoingOrderData = item.data();
        const orderId = item.id;
        onGoingOrders.push(
          new order(
            onGoingOrderData.id,
            onGoingOrderData.storeId,
            onGoingOrderData.storeName,
            onGoingOrderData.userId,
            onGoingOrderData.status,
            onGoingOrderData.items,
            onGoingOrderData.totalPrice,
            onGoingOrderData.dateOrdered,
            onGoingOrderData.dateCollected,
            onGoingOrderData.isRated,
          ),
        );
      });

      dispatch({
        type: SET_ONGOING_ORDERS,
        onGoingOrderInfo: onGoingOrders,
      });
    });
  } catch (error) {
    console.log('error at fetchOnGoingOrders on orderJs: ' + error);
  }
};

export const fetchFinishedOrders = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('orders')
    .orderBy('dateOrdered', 'desc')
    .where('status', '==', 'finished')
    .where('userId', '==', userId)
    .limit(3)
    .onSnapshot(documentSnapshot => {
      const finishedOrders = [];
      documentSnapshot.docs.forEach(item => {
        const finishedOrderData = item.data();
        const orderId = item.id;
        finishedOrders.push(
          new order(
            orderId,
            finishedOrderData.storeId,
            finishedOrderData.storeName,
            finishedOrderData.userId,
            finishedOrderData.status,
            finishedOrderData.items,
            finishedOrderData.totalPrice,
            finishedOrderData.dateOrdered,
            finishedOrderData.dateCollected,
            finishedOrderData.isRated,
          ),
        );
      });

      dispatch({
        type: SET_FINISHED_ORDERS,
        finishedOrderInfo: finishedOrders,
      });
    });
};
export const fetchCollectedOrders = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('orders')
    .orderBy('dateOrdered', 'desc')
    .where('status', 'in', ['collected', 'collected/rated'])
    .where('userId', '==', userId)
    .limit(3)
    .onSnapshot(documentSnapshot => {
      const collectedOrders = [];
      documentSnapshot.docs.forEach(item => {
        const collectedOrderData = item.data();
        const orderId = item.id;
        collectedOrders.push(
          new order(
            orderId,
            collectedOrderData.storeId,
            collectedOrderData.storeName,
            collectedOrderData.userId,
            collectedOrderData.status,
            collectedOrderData.items,
            collectedOrderData.totalPrice,
            collectedOrderData.dateOrdered,
            collectedOrderData.dateCollected,
            collectedOrderData.isRated,
          ),
        );
      });

      dispatch({
        type: SET_COLLECTED_ORDERS,
        collectedOrderInfo: collectedOrders,
      });
    });
};
export const fetchRefundedOrders = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('orders')
    .orderBy('dateOrdered', 'desc')
    .where('status', '==', 'refunded')
    .where('userId', '==', userId)
    .limit(3)
    .onSnapshot(documentSnapshot => {
      const refundedOrders = [];
      documentSnapshot.docs.forEach(item => {
        const refundedOrderData = item.data();
        const orderId = item.id;
        refundedOrders.push(
          new order(
            orderId,
            refundedOrderData.storeId,
            refundedOrderData.storeName,
            refundedOrderData.userId,
            refundedOrderData.status,
            refundedOrderData.items,
            refundedOrderData.totalPrice,
            refundedOrderData.dateOrdered,
            refundedOrderData.dateCollected,
            refundedOrderData.isRated,
          ),
        );
      });

      dispatch({
        type: SET_REFUNDED_ORDERS,
        refundedOrderInfo: refundedOrders,
      });
    });
};

//Tailor Orders Screen
export const fetchStoreOnGoingOrders = storeId => {
  return (dispatch, getState) => {
    const userId = getState().auth.userId;

    firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'ongoing')
      .where('storeId', '==', storeId)
      .limit(5)
      .onSnapshot(documentSnapshot => {
        const storeOngoingOrders = [];
        documentSnapshot.docs.forEach(item => {
          const storeOngoingData = item.data();
          const orderId = item.id;
          storeOngoingOrders.push(
            new order(
              orderId,
              storeOngoingData.storeId,
              storeOngoingData.storeName,
              storeOngoingData.userId,
              storeOngoingData.status,
              storeOngoingData.items,
              storeOngoingData.totalPrice,
              storeOngoingData.dateOrdered,
              storeOngoingData.dateCollected,
              storeOngoingData.isRated,
            ),
          );
        });

        dispatch({
          type: SET_STOREONGOING_ORDERS,
          storeOngoingOrderInfo: storeOngoingOrders,
        });
      });
  };
};
export const fetchStoreFinishedOrders = storeId => {
  return (dispatch, getState) => {
    const userId = getState().auth.userId;
    firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'finished')
      .where('storeId', '==', storeId)
      .limit(3)
      .onSnapshot(documentSnapshot => {
        const storeFinishedOrders = [];
        documentSnapshot.docs.forEach(item => {
          const storeFinishedData = item.data();
          const orderId = item.id;
          storeFinishedOrders.push(
            new order(
              orderId,
              storeFinishedData.storeId,
              storeFinishedData.storeName,
              storeFinishedData.userId,
              storeFinishedData.status,
              storeFinishedData.items,
              storeFinishedData.totalPrice,
              storeFinishedData.dateOrdered,
              storeFinishedData.dateCollected,
              storeFinishedData.isRated,
            ),
          );
        });

        dispatch({
          type: SET_STOREFINISHED_ORDERS,
          storeFinishedOrderInfo: storeFinishedOrders,
        });
      });
  };
};
export const fetchStoreCollectedOrders = storeId => {
  return (dispatch, getState) => {
    const userId = getState().auth.userId;

    firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'collected')
      .where('storeId', '==', storeId)
      .limit(3)
      .onSnapshot(documentSnapshot => {
        const storeCollectedOrders = [];
        documentSnapshot.docs.forEach(item => {
          const storeCollectedData = item.data();

          const orderId = item.id;
          storeCollectedOrders.push(
            new order(
              orderId,
              storeCollectedData.storeId,
              storeCollectedData.storeName,
              storeCollectedData.userId,
              storeCollectedData.status,
              storeCollectedData.items,
              storeCollectedData.totalPrice,
              storeCollectedData.dateOrdered,
              storeCollectedData.dateCollected,
              storeCollectedData.isRated,
            ),
          );
        });

        dispatch({
          type: SET_STORECOLLECTED_ORDERS,
          storeCollectedOrderInfo: storeCollectedOrders,
        });
      });
  };
};
export const fetchStoreRefundedOrders = storeId => {
  return (dispatch, getState) => {
    const userId = getState().auth.userId;

    firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'refunded')
      .where('storeId', '==', storeId)
      .limit(3)
      .onSnapshot(documentSnapshot => {
        const storeRefundedOrders = [];
        documentSnapshot.docs.forEach(item => {
          const storeRefundedData = item.data();

          const orderId = item.id;
          storeRefundedOrders.push(
            new order(
              orderId,
              storeRefundedData.storeId,
              storeRefundedData.storeName,
              storeRefundedData.userId,
              storeRefundedData.status,
              storeRefundedData.items,
              storeRefundedData.totalPrice,
              storeRefundedData.dateOrdered,
              storeRefundedData.dateCollected,
              storeRefundedData.isRated,
            ),
          );
        });

        dispatch({
          type: SET_STOREREFUNDED_ORDERS,
          storeRefundedOrderInfo: storeRefundedOrders,
        });
      });
  };
};

export const updateOngoingOrder = (orderId, userId) => {
  return async (dispatch, getState) => {
    try {
      const notificationTitle = 'Your order is finished';
      const notificationBody = 'Please Collect your order in the store';
      const batch = firestore().batch();
      const orderRef = firestore().collection('orders').doc(orderId);
      batch.update(orderRef, {
        status: 'finished',
      });
      const userQuerySnapshot = firestore()
        .collection('Users')
        .doc(userId)
        .get();
      userQuerySnapshot.then(documentSnapshot => {
        const notification = functions().httpsCallable('notificationOnCall');
        const data = documentSnapshot.data();

        notification({
          notificationToken: data.notificationToken,
          notificationTitle: notificationTitle,
          notificationBody: notificationBody,
          userId: userId,
        });
      });
      await batch.commit();
      console.log('order updated');
    } catch (error) {
      console.log('Error on updateOngoingOrder order.js: ' + error);
    }
  };
};

export const updateFinishedOrder = (orderId, userId) => {
  const currentDate = new Date();
  return async (dispatch, getState) => {
    try {
      const notificationTitle = 'Order is collected';
      const notificationBody = 'Review it now.';
      const batch = firestore().batch();
      const orderRef = firestore().collection('orders').doc(orderId);
      batch.update(orderRef, {
        dateCollected: currentDate,
        status: 'collected',
      });
      const userQuerySnapshot = firestore()
        .collection('Users')
        .doc(userId)
        .get();
      userQuerySnapshot.then(documentSnapshot => {
        const notification = functions().httpsCallable('notificationOnCall');
        const data = documentSnapshot.data();

        notification({
          notificationToken: data.notificationToken,
          notificationTitle: notificationTitle,
          notificationBody: notificationBody,
          userId: userId,
        });
      });
      await batch.commit();
      console.log('order updated');
    } catch (error) {
      console.log('Error on updateOngoingOrder order.js: ' + error);
    }
  };
};
export const refundOrder = orderID => {
  return (dispatch, getState) => {
    firestore()
      .collection('orders')
      .doc(orderID)
      .update({
        status: 'refunded',
      })
      .then(() => {
        console.log('Order Updated');
      });
  };
};

/*  .then(documentSnapshot => {
      const storeOngoingOrders = [];
      documentSnapshot.docs.forEach(item => {
        const storeOngoingData = item.data();
        const orderId = item.id;
        storeOngoingOrders.push(
          new order(
            orderId,
            storeOngoingData.storeId,
            storeOngoingData.storeName,
            storeOngoingData.customerId,
            storeOngoingData.status,
            storeOngoingData.items,
            storeOngoingData.totalPrice,
            storeOngoingData.dateOrdered,
            storeOngoingData.dateCollected,
          ),
        );
      });

      dispatch({
        type: SET_STOREONGOING_ORDERS,
        storeOngoingOrderInfo: storeOngoingOrders,
      });
    }); */
