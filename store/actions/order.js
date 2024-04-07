import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import orders from '../../models/orders';
import functions from '@react-native-firebase/functions';
import notifee, {EventType} from '@notifee/react-native';
//premade
export const SET_USER_TOPICKUP_PREMADE_ORDERS =
  'SET_USER_TOPICKUP_PREMADE_ORDERS';
export const SET_USER_COLLECTED_PREMADE_ORDERS =
  'SET_USER_COLLECTED_PREMADE_ORDERS';
export const SET_USER_REFUNDED_PREMADE_ORDERS =
  'SET_USER_REFUNDED_PREMADE_ORDERS';
export const SET_STORETOPICKUP_ORDERS = 'SET_STOREONGOING_ORDERS';
export const SET_STORECOLLECTED_ORDERS = 'SET_STORECOLLECTED_ORDERS';
export const SET_STOREREFUNDED_ORDERS = 'SET_STOREREFUNDED_ORDERS';
//request
export const SET_STOREPENDING_ORDER_REQUEST = 'SET_STOREPENDING_ORDER_REQUEST';
export const SET_STOREACCEPTED_ORDER_REQUEST =
  'SET_STOREACCEPTED_ORDER_REQUEST';
export const SET_STOREONGOING_ORDER_REQUEST = 'SET_STOREONGOING_ORDER_REQUEST';
export const SET_STORETOPICKUP_ORDER_REQUEST =
  'SET_STORETOPICKUP_ORDER_REQUEST';
export const SET_STORECOLLECTED_ORDER_REQUEST =
  'SET_STORECOLLECTED_ORDER_REQUEST';
export const SET_STORECANCELLED_ORDER_REQUEST =
  'SET_STORECANCELLED_ORDER_REQUEST';
//USER

export const SET_USERPENDING_ORDER_REQUEST = 'SET_USERPENDING_ORDER_REQUEST';
export const SET_USERACCEPTED_ORDER_REQUEST = 'SET_USERACCEPTED_ORDER_REQUEST';
export const SET_USERONGOING_ORDER_REQUEST = 'SET_USERONGOING_ORDER_REQUEST';
export const SET_USERTOPICKUP_ORDER_REQUEST = 'SET_USERTOPICKUP_ORDER_REQUEST';
export const SET_USERCOLLECTED_ORDER_REQUEST =
  'SET_USERCOLLECTED_ORDER_REQUEST';
export const SET_USERCANCELLED_ORDER_REQUEST =
  'SET_USERCANCELLED_ORDER_REQUEST';
export const SET_USERUNSEEN_ORDER_REQUEST = 'SET_UNSEEN_ORDER_REQUEST';
export const SET_STOREUNSEEN_ORDER_REQUEST = 'SET_STOREUNSEEN_ORDER_REQUEST';

export const SET_USERUNSEEN_ORDER = 'SET_USERUNSEEN_ORDER';
export const SET_STOREUNSEEN_ORDER = 'SET_STOREUNSEEN_ORDER';
export const addOrder = (
  cartItems,
  totalPrice,
  storeId,
  storeName,
  username,
  userPhone,
) => {
  return async (dispatch, getState) => {
    try {
      const currentDate = new Date();
      const userId = getState().auth.userId;

      const notificationTitle = 'New order!';
      const notificationBody = 'Check the details on premade orders';

      const storeRef = firestore()
        .collection('stores')
        .where('storeId', '==', storeId);

      storeRef.get().then(storeQuery => {
        storeQuery.forEach(doc => {
          const storeData = doc.data();
          const userQuerySnapshot = firestore()
            .collection('Users')
            .doc(storeData.userId)
            .get();
          userQuerySnapshot.then(documentSnapshot => {
            const notification =
              functions().httpsCallable('notificationOnCall');

            const data = documentSnapshot.data();

            notification({
              notificationToken: data.notificationToken,
              notificationTitle: notificationTitle,
              notificationBody: notificationBody,
              userId: '',
              storeId: storeId,
              mainScreen: 'STORE PREMADE ORDERS',
              secondaryScreen: 'STORETOPICKUP',
            });
          });
        });
      });

      const orderRef = firestore().collection('orders').doc();
      await orderRef.set({
        id: orderRef.id,
        storeId: storeId,
        storeName: storeName,
        userId: userId,
        username: username,
        userPhone: userPhone,
        dateOrdered: currentDate,
        datePickedup: '',
        status: 'topickup',
        totalPrice: totalPrice,
        items: cartItems,
        balance: '',
        orderType: 'premade',
        isUserSeen: false,
        isStoreSeen: false,
      });
    } catch (error) {
      console.log('error at addOrder on orderJs: ' + error);
    }
  };
};

//premade ORDER
export const fetchUserToPickUpPremadeOrders = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('orders')
    .orderBy('dateOrdered', 'desc')
    .where('status', '==', 'topickup')
    .where('userId', '==', userId)
    .where('orderType', '==', 'premade')
    .onSnapshot(documentSnapshot => {
      const topickupOrders = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        topickupOrders.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });

      dispatch({
        type: SET_USER_TOPICKUP_PREMADE_ORDERS,
        pickUpOrdersInfo: topickupOrders,
      });
    });
};
export const fetchUserCollectedPremadeOrders = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('orders')
    .orderBy('dateOrdered', 'desc')
    .where('status', 'in', ['collected', 'collected/rated'])
    .where('userId', '==', userId)
    .where('orderType', '==', 'premade')
    .onSnapshot(documentSnapshot => {
      const collectedOrders = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();

        collectedOrders.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });

      dispatch({
        type: SET_USER_COLLECTED_PREMADE_ORDERS,
        collectedOrderInfo: collectedOrders,
      });
    });
};
export const fetchUserRefundedPremadeOrders = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('orders')
    .orderBy('dateOrdered', 'desc')
    .where('status', '==', 'refunded')
    .where('userId', '==', userId)
    .where('orderType', '==', 'premade')
    .onSnapshot(documentSnapshot => {
      const refundedOrders = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();

        refundedOrders.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });

      dispatch({
        type: SET_USER_REFUNDED_PREMADE_ORDERS,
        refundedOrderInfo: refundedOrders,
      });
    });
};

export const fetchStorePickupOrders = storeId => {
  return (dispatch, getState) => {
    const userId = getState().auth.userId;
    firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'topickup')
      .where('storeId', '==', storeId)
      .where('orderType', '==', 'premade')
      .onSnapshot(documentSnapshot => {
        const storeToPickupOrders = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();

          storeToPickupOrders.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });

        dispatch({
          type: SET_STORETOPICKUP_ORDERS,
          storePickUpOrdersInfo: storeToPickupOrders,
        });
      });
  };
};
export const fetchStoreCollectedOrders = storeId => {
  return (dispatch, getState) => {
    firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', 'in', ['collected', 'collected/rated'])
      .where('storeId', '==', storeId)
      .where('orderType', '==', 'premade')
      .onSnapshot(documentSnapshot => {
        const storeCollectedOrders = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();

          storeCollectedOrders.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
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
    firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'refunded')
      .where('storeId', '==', storeId)
      .where('orderType', '==', 'premade')
      .onSnapshot(documentSnapshot => {
        const storeRefundedOrders = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();

          storeRefundedOrders.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
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

export const updateToPickupOrder = (orderId, userId) => {
  const currentDate = new Date();
  return async (dispatch, getState) => {
    try {
      const notificationTitle = 'Order is collected';
      const notificationBody = 'Review it now.';
      const batch = firestore().batch();
      const orderRef = firestore().collection('orders').doc(orderId);
      batch.update(orderRef, {
        datePickedup: currentDate,
        status: 'collected',
        isUserSeen: false,
        isStoreSeen: false,
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
          storeId: '',
          mainScreen: 'MY ORDERS',
          secondaryScreen: 'COLLECTED',
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
//premade end

//custom order
export const createOrderRequest = (
  item,
  totalPrice,
  storeId,
  storeName,
  username,
  userPhone,
  photos,
) => {
  return async (dispatch, getState) => {
    try {
      const notificationTitle = 'New pending order!';
      const notificationBody = 'Check pending orders';
      const currentDate = new Date();
      const userId = getState().auth.userId;

      let photosFileName = [];
      const storeRef = firestore()
        .collection('stores')
        .where('storeId', '==', storeId);

      storeRef.get().then(storeQuery => {
        storeQuery.forEach(doc => {
          const storeData = doc.data();
          const userQuerySnapshot = firestore()
            .collection('Users')
            .doc(storeData.userId)
            .get();
          userQuerySnapshot.then(documentSnapshot => {
            const notification =
              functions().httpsCallable('notificationOnCall');

            const data = documentSnapshot.data();

            notification({
              notificationToken: data.notificationToken,
              notificationTitle: notificationTitle,
              notificationBody: notificationBody,
              userId: '',
              storeId: storeId,
              mainScreen: 'STORE REQUEST',
              secondaryScreen: 'Pending Custom Order',
            });
          });
        });
      });
      photos.map(value => {
        photosFileName.push(value.imageFileName);
        storage()
          .ref(`request/${userId}/${value.imageFileName}`)
          .putFile(value.imageUri)
          .on('state_changed', taskSnapshot => {
            console.log(
              `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );
          });
      });
      const requestRef = firestore().collection('orders').doc();
      requestRef.set({
        id: requestRef.id,
        storeId: storeId,
        storeName: storeName,
        userId: userId,
        username: username,
        userPhone: userPhone,
        dateOrdered: currentDate,
        datePickedup: '',
        status: 'pending',
        totalPrice: totalPrice,
        items: item,
        balance: '',
        orderType: 'custom',
        isUserSeen: false,
        isStoreSeen: false,
      });
    } catch (error) {
      console.log('error at createOrderRequest on orderJs: ' + error);
    }
  };
};
export const createCustomizeOrderRequest = (
  item,
  totalPrice,
  storeId,
  storeName,
  username,
  userPhone,
) => {
  return async (dispatch, getState) => {
    try {
      const notificationTitle = 'New pending order!';
      const notificationBody = 'Check pending orders';
      const currentDate = new Date();
      const userId = getState().auth.userId;

      const storeRef = firestore()
        .collection('stores')
        .where('storeId', '==', storeId);

      storeRef.get().then(storeQuery => {
        storeQuery.forEach(doc => {
          const storeData = doc.data();
          const userQuerySnapshot = firestore()
            .collection('Users')
            .doc(storeData.userId)
            .get();
          userQuerySnapshot.then(documentSnapshot => {
            const notification =
              functions().httpsCallable('notificationOnCall');

            const data = documentSnapshot.data();

            notification({
              notificationToken: data.notificationToken,
              notificationTitle: notificationTitle,
              notificationBody: notificationBody,
              userId: '',
              storeId: storeId,
              mainScreen: 'STORE REQUEST',
              secondaryScreen: 'Pending Custom Order',
            });
          });
        });
      });
      const requestRef = firestore().collection('orders').doc();
      requestRef.set({
        id: requestRef.id,
        storeId: storeId,
        storeName: storeName,
        userId: userId,
        username: username,
        userPhone: userPhone,
        dateOrdered: currentDate,
        datePickedup: '',
        status: 'pending',
        totalPrice: totalPrice,
        items: item,
        balance: '',
        orderType: 'custom',
        isUserSeen: false,
        isStoreSeen: false,
      });
    } catch (error) {
      console.log('error at createOrderRequest on orderJs: ' + error);
    }
  };
};
export const createWalkinOrder = (
  item,
  totalPrice,
  storeId,
  storeName,
  username,
  userPhone,
) => {
  return async (dispatch, getState) => {
    try {
      const currentDate = new Date();
      const userId = getState().auth.userId;
      const newOrderRef = firestore().collection('orders').doc();
      newOrderRef.set({
        id: newOrderRef.id,
        storeId: storeId,
        storeName: storeName,
        userId: 'walkin',
        username: username,
        userPhone: userPhone,
        dateOrdered: currentDate,
        datePickedup: '',
        status: 'ongoing',
        totalPrice: totalPrice,
        items: item,
        balance: 0,
        orderType: 'custom',
        isUserSeen: false,
        isStoreSeen: false,
      });
    } catch (error) {
      console.log('error at createWalkinOrder on orderJs: ' + error);
    }
  };
};

//USER ORDERS
export const fetchUserPendingOrder = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const requestRef = firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'pending')
      .where('userId', '==', userId)
      .where('orderType', '==', 'custom');

    requestRef.onSnapshot(documentSnapshot => {
      const userPendingrequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userPendingrequest.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });
      dispatch({
        type: SET_USERPENDING_ORDER_REQUEST,
        userPendingInfo: userPendingrequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserPendingOrder at order.js' + error);
  }
};

export const fetchUserAcceptedOrder = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const requestRef = firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'accepted/topay')
      .where('userId', '==', userId)
      .where('orderType', '==', 'custom');

    requestRef.onSnapshot(documentSnapshot => {
      const userAcceptedRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userAcceptedRequest.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });
      dispatch({
        type: SET_USERACCEPTED_ORDER_REQUEST,
        userAcceptedInfo: userAcceptedRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserAcceptedOrder at order.js' + error);
  }
};
export const fetchUserOngoingOrder = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const requestRef = firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', 'in', ['ongoing', 'ongoing/topay'])
      .where('userId', '==', userId)
      .where('orderType', '==', 'custom');

    requestRef.onSnapshot(documentSnapshot => {
      const userOngoingRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userOngoingRequest.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });
      dispatch({
        type: SET_USERONGOING_ORDER_REQUEST,
        userOngoingInfo: userOngoingRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserOngoingOrder at order.js' + error);
  }
};
export const fetchUserToPickupOrder = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const requestRef = firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', 'in', ['topickup', 'topickup/topay'])
      .where('userId', '==', userId)
      .where('orderType', '==', 'custom');

    requestRef.onSnapshot(documentSnapshot => {
      const userToPickupRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userToPickupRequest.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });
      dispatch({
        type: SET_USERTOPICKUP_ORDER_REQUEST,
        userPickupInfo: userToPickupRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserToPickupOrder at order.js' + error);
  }
};

export const fetchUserCollectedOrder = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const requestRef = firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', '==', 'collected')
      .where('userId', '==', userId)
      .where('orderType', '==', 'custom');

    requestRef.onSnapshot(documentSnapshot => {
      const userCollectedRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userCollectedRequest.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });
      dispatch({
        type: SET_USERCOLLECTED_ORDER_REQUEST,
        userCollectedInfo: userCollectedRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserCollectedOrder at order.js' + error);
  }
};
export const fetchUserCancelledOrder = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const requestRef = firestore()
      .collection('orders')
      .orderBy('dateOrdered', 'desc')
      .where('status', 'in', ['cancelled', 'declined'])
      .where('userId', '==', userId)
      .where('orderType', '==', 'custom');

    requestRef.onSnapshot(documentSnapshot => {
      const userCancelledRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userCancelledRequest.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });
      dispatch({
        type: SET_USERCANCELLED_ORDER_REQUEST,
        userCancelledInfo: userCancelledRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserCancelledOrder at order.js' + error);
  }
};

//TAILORING ORDERS
export const fetchPendingOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('orders')
        .orderBy('dateOrdered', 'desc')
        .where('status', '==', 'pending')
        .where('storeId', '==', storeId)
        .where('orderType', '==', 'custom');

      requestRef.onSnapshot(documentSnapshot => {
        const storePendingrequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storePendingrequest.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });
        dispatch({
          type: SET_STOREPENDING_ORDER_REQUEST,
          storePendingInfo: storePendingrequest,
        });
      });
    } catch (error) {
      console.log('error at fetchPendingOrder in order.js: ' + error);
    }
  };
};
export const fetchAcceptedOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('orders')
        .orderBy('dateOrdered', 'desc')
        .where('status', '==', 'accepted/topay')
        .where('storeId', '==', storeId)
        .where('orderType', '==', 'custom');

      requestRef.onSnapshot(documentSnapshot => {
        const storeAcceptedrequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storeAcceptedrequest.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });
        dispatch({
          type: SET_STOREACCEPTED_ORDER_REQUEST,
          storeAcceptedInfo: storeAcceptedrequest,
        });
      });
    } catch (error) {
      console.log('error at fetchAcceptedOrder in order.js: ' + error);
    }
  };
};
export const fetchOngoingOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('orders')
        .orderBy('dateOrdered', 'desc')
        .where('status', 'in', ['ongoing', 'ongoing/topay'])
        .where('storeId', '==', storeId)
        .where('orderType', '==', 'custom');

      requestRef.onSnapshot(documentSnapshot => {
        const storeOngoingrequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storeOngoingrequest.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });
        dispatch({
          type: SET_STOREONGOING_ORDER_REQUEST,
          storeOngoingInfo: storeOngoingrequest,
        });
      });
    } catch (error) {
      console.log('error at fetchOngoingOrder in order.js: ' + error);
    }
  };
};
export const fetchToPickupOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('orders')
        .orderBy('dateOrdered', 'desc')
        .where('status', 'in', ['topickup', 'topickup/topay'])
        .where('storeId', '==', storeId)
        .where('orderType', '==', 'custom');

      requestRef.onSnapshot(documentSnapshot => {
        const storeToPickuprequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storeToPickuprequest.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });
        dispatch({
          type: SET_STORETOPICKUP_ORDER_REQUEST,
          storeToPickupInfo: storeToPickuprequest,
        });
      });
    } catch (error) {
      console.log('error at fetchToPickupOrder in order.js: ' + error);
    }
  };
};
export const fetchCollectedOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('orders')
        .orderBy('dateOrdered', 'desc')
        .where('status', '==', 'collected')
        .where('storeId', '==', storeId)
        .where('orderType', '==', 'custom');

      requestRef.onSnapshot(documentSnapshot => {
        const storeCollectedRequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storeCollectedRequest.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });
        dispatch({
          type: SET_STORECOLLECTED_ORDER_REQUEST,
          storeCollectedInfo: storeCollectedRequest,
        });
      });
    } catch (error) {
      console.log('error on fetchCollectedOrder at order.js' + error);
    }
  };
};
export const fetchCancelledOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('orders')
        .orderBy('dateOrdered', 'desc')
        .where('status', 'in', ['cancelled', 'declined'])
        .where('storeId', '==', storeId)
        .where('orderType', '==', 'custom');

      requestRef.onSnapshot(documentSnapshot => {
        const storeCancelledRequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storeCancelledRequest.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });
        dispatch({
          type: SET_STORECANCELLED_ORDER_REQUEST,
          storeCancelledInfo: storeCancelledRequest,
        });
      });
    } catch (error) {
      console.log('error on fetchCancelledOrder at order.js' + error);
    }
  };
};
export const updateAcceptedRequest = (orderId, price, totalPrice, userId) => {
  return async (dispatch, getState) => {
    try {
      const notificationTitle = 'Order Accepted';
      const notificationBody = 'Order Accepted go to custom orders to pay.';
      const orderRef = firestore().collection('orders').doc(orderId);
      const orderSnapshot = await orderRef.get();
      const orderData = orderSnapshot.data();
      const orderItems = orderData.items;
      const updatedItems = orderItems.filter(item => item.id !== 1);
      const variantItem = orderItems.find(item => item.id === 1);
      variantItem.productPrice = price;
      updatedItems.push(variantItem);
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
          storeId: '',
          mainScreen: 'USER CUSTOM ORDERS',
          secondaryScreen: 'Accepted User Custom Order',
        });
      });
      orderRef
        .update({
          items: updatedItems,
          totalPrice: totalPrice,
          status: 'accepted/topay',
          isUserSeen: false,
          isStoreSeen: false,
        })
        .then(() => {
          console.log('User updated!');
        });
    } catch (error) {
      console.log('error on updateAcceptedRequest at order.js');
    }
  };
};
export const updateDeclineRequest = (orderId, userId) => {
  return async (dispatch, getState) => {
    try {
      const notificationTitle = 'Order Declined';
      const notificationBody = 'Order Declined request a new one.';
      const orderRef = firestore().collection('orders').doc(orderId);
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
          storeId: '',
          mainScreen: 'USER CUSTOM ORDERS',
          secondaryScreen: 'Cancelled User Custom Order',
        });
      });
      orderRef
        .update({
          status: 'declined',
          isUserSeen: false,
          isStoreSeen: false,
        })
        .then(() => {
          console.log('User updated!');
        });
    } catch (error) {
      console.log('error on updatedeclineRequest as at orderjs ');
    }
  };
};
export const updateCancelRequest = (orderId, storeId) => {
  return async (dispatch, getState) => {
    try {
      const notificationTitle = 'An order has been cancelled!';
      const notificationBody = 'The customer cancelled the accepted order';
      const orderRef = firestore().collection('orders').doc(orderId);
      const storeRef = firestore()
        .collection('stores')
        .where('storeId', '==', storeId);

      storeRef.get().then(storeQuery => {
        storeQuery.forEach(doc => {
          const storeData = doc.data();
          const userQuerySnapshot = firestore()
            .collection('Users')
            .doc(storeData.userId)
            .get();
          userQuerySnapshot.then(documentSnapshot => {
            const notification =
              functions().httpsCallable('notificationOnCall');

            const data = documentSnapshot.data();

            notification({
              notificationToken: data.notificationToken,
              notificationTitle: notificationTitle,
              notificationBody: notificationBody,
              userId: '',
              storeId: storeId,
              mainScreen: 'STORE REQUEST',
              secondaryScreen: 'Cancelled Custom Order',
            });
          });
        });
      });
      orderRef
        .update({
          status: 'cancelled',
          isUserSeen: false,
          isStoreSeen: false,
        })
        .then(() => {
          console.log('User updated!');
        });
    } catch (error) {
      console.log('error on updateCancelRequest as at orderjs ');
    }
  };
};
export const updateUserAcceptedToPayRequest = (orderId, balance, storeId) => {
  let status = 'ongoing/topay';
  let notificationTitle = 'An order has been paid!';
  let notificationBody =
    'Customer partially paid the order. order is now ongoing/topay';
  if (balance == 0) {
    status = 'ongoing';
    notificationTitle = 'An order has been paid!';
    notificationBody = 'Customer fully paid the order. order is now ongoing';
  }
  return (dispatch, getState) => {
    try {
      const storeRef = firestore()
        .collection('stores')
        .where('storeId', '==', storeId);

      storeRef.get().then(storeQuery => {
        storeQuery.forEach(doc => {
          const storeData = doc.data();
          const userQuerySnapshot = firestore()
            .collection('Users')
            .doc(storeData.userId)
            .get();
          userQuerySnapshot.then(documentSnapshot => {
            const notification =
              functions().httpsCallable('notificationOnCall');

            const data = documentSnapshot.data();

            notification({
              notificationToken: data.notificationToken,
              notificationTitle: notificationTitle,
              notificationBody: notificationBody,
              userId: '',
              storeId: storeId,
              mainScreen: 'STORE REQUEST',
              secondaryScreen: 'Ongoing Custom Order',
            });
          });
        });
      });
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({
          balance: balance,
          status: status,
          isUserSeen: false,
          isStoreSeen: false,
        })
        .then(() => {
          console.log('User updated!');
        });
    } catch (error) {
      console.log('error on updateUserAcceptedToPayRequest as at orderjs ');
    }
  };
};
export const updateOngoingRequest = (orderId, balance, userId) => {
  const currentDate = new Date();
  let status = 'topickup/topay';
  let notificationTitle = 'Order is ready to be picked up!';
  let notificationBody =
    'Please pay the remaining balance.To collect your order in store';
  if (balance == 0) {
    status = 'topickup';
    notificationTitle = 'Order is ready to be picked up!';
    notificationBody = 'collect your order in store';
  }
  return (dispatch, getState) => {
    try {
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
          storeId: '',
          mainScreen: 'USER CUSTOM ORDERS',
          secondaryScreen: 'Pickup User Custom Order',
        });
      });
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({status: status, isUserSeen: false, isStoreSeen: false})
        .then(() => {
          console.log('updated!');
        });
    } catch (error) {
      console.log('error on updateOngoingRequest as at orderjs ');
    }
  };
};
export const updateCollectedRequest = (orderId, userId) => {
  const currentDate = new Date();
  const notificationTitle = 'Order is collected';
  const notificationBody = 'Review it now.';
  return (dispatch, getState) => {
    try {
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
          storeId: '',
          mainScreen: 'USER CUSTOM ORDERS',
          secondaryScreen: 'Collected User Custom Order',
        });
      });
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({
          status: 'collected',
          datePickedup: currentDate,
          isUserSeen: false,
          isStoreSeen: false,
        })
        .then(() => {
          console.log('User updated!');
        });
    } catch (error) {
      console.log('error on updateCollectedRequest as at orderjs ');
    }
  };
};
export const updateCollectedRequestNotification = userId => {
  return (dispatch, getState) => {
    try {
      const notificationTitle = 'Order is ready to be picked up!';
      const notificationBody =
        'Please pay the remaining balance.To collect your order in store.';
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
          storeId: '',
          mainScreen: 'USER CUSTOM ORDERS',
          secondaryScreen: 'Pickup User Custom Order',
        });
      });
    } catch (error) {
      console.log('error on updateCollectedRequestNotification as at orderjs ');
    }
  };
};
export const updateOngoingBalance = (orderId, balance, storeId) => {
  let status = 'ongoing/topay';
  let notificationTitle = 'An order has been paid!';
  let notificationBody = 'Customer paid the remaining balance. ';
  if (balance == 0) {
    status = 'ongoing';
  }
  return (dispatch, getState) => {
    try {
      const storeRef = firestore()
        .collection('stores')
        .where('storeId', '==', storeId);

      storeRef.get().then(storeQuery => {
        storeQuery.forEach(doc => {
          const storeData = doc.data();
          const userQuerySnapshot = firestore()
            .collection('Users')
            .doc(storeData.userId)
            .get();
          userQuerySnapshot.then(documentSnapshot => {
            const notification =
              functions().httpsCallable('notificationOnCall');

            const data = documentSnapshot.data();

            notification({
              notificationToken: data.notificationToken,
              notificationTitle: notificationTitle,
              notificationBody: notificationBody,
              userId: '',
              storeId: storeId,
              mainScreen: 'STORE REQUEST',
              secondaryScreen: 'Ongoing Custom Order',
            });
          });
        });
      });
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({balance: balance, status: status})
        .then(() => {
          console.log('balance updated!');
        });
    } catch (error) {
      console.log('error on updateOngoingBalance as at orderjs ');
    }
  };
};
export const updateTopickupBalance = (orderId, balance, storeId) => {
  let status = 'topickup/topay';
  let notificationTitle = 'An order has been paid!';
  let notificationBody = 'Customer paid the remaining balance. ';
  if (balance == 0) {
    status = 'topickup';
  }
  return (dispatch, getState) => {
    try {
      const storeRef = firestore()
        .collection('stores')
        .where('storeId', '==', storeId);

      storeRef.get().then(storeQuery => {
        storeQuery.forEach(doc => {
          const storeData = doc.data();
          const userQuerySnapshot = firestore()
            .collection('Users')
            .doc(storeData.userId)
            .get();
          userQuerySnapshot.then(documentSnapshot => {
            const notification =
              functions().httpsCallable('notificationOnCall');

            const data = documentSnapshot.data();

            notification({
              notificationToken: data.notificationToken,
              notificationTitle: notificationTitle,
              notificationBody: notificationBody,
              userId: '',
              storeId: storeId,
              mainScreen: 'STORE REQUEST',
              secondaryScreen: 'Pickup Custom Order',
            });
          });
        });
      });
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({balance: balance, status: status})
        .then(() => {
          console.log('balance updated!');
        });
    } catch (error) {
      console.log('error on updateTopickupBalance as at orderjs ');
    }
  };
};

//SEEN UNSEEN
//premade user
export const updateUserPremadeToPickupSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateUserToPickupSeen as at orderjs ');
    }
  };
};
export const updateUserPremadeCollectedSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreCollectedSeen as at orderjs ');
    }
  };
};
export const updateUserPremadeRefundedSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreCollectedSeen as at orderjs ');
    }
  };
};
//Custom user
export const updateUserPendingSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateUserPendingSeen as at orderjs ');
    }
  };
};
export const updateUserAcceptedSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateUserAcceptedSeen as at orderjs ');
    }
  };
};
export const updateUserOngoingSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateUserOngoingSeen as at orderjs ');
    }
  };
};
export const updateUserToPickupSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateUserToPickupSeen as at orderjs ');
    }
  };
};
export const updateUserCollectedSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreCollectedSeen as at orderjs ');
    }
  };
};
export const updateUserCancelledSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isUserSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateUserCancelledSeen as at orderjs ');
    }
  };
};
//premade Store
export const updateStorePremadeToPickupSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateUserToPickupSeen as at orderjs ');
    }
  };
};
export const updateStorePremadeCollectedSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreCollectedSeen as at orderjs ');
    }
  };
};
export const updateStorePremadeRefundedSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreCollectedSeen as at orderjs ');
    }
  };
};
//store custom
export const updateStorePendingSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updatePendingSeen as at orderjs ');
    }
  };
};
export const updateStoreAcceptedSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updatePendingSeen as at orderjs ');
    }
  };
};
export const updateStoreOngoingSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreOngoingSeen as at orderjs ');
    }
  };
};
export const updateStoreToPickupSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreToPickupSeen as at orderjs ');
    }
  };
};
export const updateStoreCollectedSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreCollectedSeen as at orderjs ');
    }
  };
};
export const updateStoreCancelledSeen = orderId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .doc(orderId)
        .update({isStoreSeen: true})
        .then(() => {
          console.log('Unseen updated!');
        });
    } catch (error) {
      console.log('error on updateStoreCancelledSeen as at orderjs ');
    }
  };
};

//USER FETCH ONE SEEN FOR NOTIFICATION
export const fetchOneUnseen = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const requestRef = firestore()
      .collection('orders')
      .where('userId', '==', userId)
      .where('orderType', '==', 'custom')
      .where('isUserSeen', '==', false);

    requestRef.onSnapshot(documentSnapshot => {
      const UnseenRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        UnseenRequest.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });
      dispatch({
        type: SET_USERUNSEEN_ORDER_REQUEST,
        UnseenInfo: UnseenRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchOneUnseen at order.js' + error);
  }
};
export const fetchOneOrderUnseen = (dispatch, getState) => {
  try {
    const userId = getState().auth.userId;
    const requestRef = firestore()
      .collection('orders')
      .where('userId', '==', userId)
      .where('orderType', '==', 'premade')
      .where('isUserSeen', '==', false);

    requestRef.onSnapshot(documentSnapshot => {
      const UnseenRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        UnseenRequest.push(
          new orders(
            data.id,
            data.storeId,
            data.storeName,
            data.userId,
            data.username,
            data.userPhone,
            data.dateOrdered,
            data.datePickedup,
            data.status,
            data.totalPrice,
            data.items,
            data.balance,
            data.orderType,
            data.isUserSeen,
            data.isStoreSeen,
          ),
        );
      });
      dispatch({
        type: SET_USERUNSEEN_ORDER,
        UnseenOrderInfo: UnseenRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchOneUnseen at order.js' + error);
  }
};
//TAILOR FETCH ONE SEEN FOR NOTIFICATION
export const fetchStoreOneUnseen = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('orders')
        .where('storeId', '==', storeId)
        .where('orderType', '==', 'custom')
        .where('isStoreSeen', '==', false);

      requestRef.onSnapshot(documentSnapshot => {
        const UnseenRequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          UnseenRequest.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });
        dispatch({
          type: SET_STOREUNSEEN_ORDER_REQUEST,
          storeUnseenInfo: UnseenRequest,
        });
      });
    } catch (error) {
      console.log('error on fetchStoreOneUnseen at order.js' + error);
    }
  };
};
export const fetchStoreOneOrderUnseen = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('orders')
        .where('storeId', '==', storeId)
        .where('orderType', '==', 'premade')
        .where('isStoreSeen', '==', false);

      requestRef.onSnapshot(documentSnapshot => {
        const UnseenRequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          UnseenRequest.push(
            new orders(
              data.id,
              data.storeId,
              data.storeName,
              data.userId,
              data.username,
              data.userPhone,
              data.dateOrdered,
              data.datePickedup,
              data.status,
              data.totalPrice,
              data.items,
              data.balance,
              data.orderType,
              data.isUserSeen,
              data.isStoreSeen,
            ),
          );
        });
        dispatch({
          type: SET_STOREUNSEEN_ORDER,
          UnseenStoreOrderInfo: UnseenRequest,
        });
      });
    } catch (error) {
      console.log('error on fetchStoreOneUnseen at order.js' + error);
    }
  };
};
