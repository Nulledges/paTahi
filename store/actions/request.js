import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import request from '../../models/request';

export const SET_PENDING_ORDER_REQUEST = 'SET_PENDING_ORDER_REQUEST';
export const SET_ACCEPTED_ORDER_REQUEST = 'SET_ACCEPTED_ORDER_REQUEST';
export const SET_ONGOING_ORDER_REQUEST = 'SET_ONGOING_ORDER_REQUEST';
export const SET_TOPICKUP_ORDER_REQUEST = 'SET_TOPICKUP_ORDER_REQUEST';

export const SET_USERPENDING_ORDER_REQUEST = 'SET_USERPENDING_ORDER_REQUEST';
export const SET_USERACCEPTED_ORDER_REQUEST = 'SET_USERACCEPTED_ORDER_REQUEST';
export const SET_USERONGOING_ORDER_REQUEST = 'SET_USERONGOING_ORDER_REQUEST';
export const SET_USERTOPICKUP_ORDER_REQUEST = 'SET_USERTOPICKUP_ORDER_REQUEST';

export const createOrderRequest = (
  storeId,
  customerId,
  customerName,
  customerPhone,
  category,
  measurements,
  photos,
  fabric,
  description,
) => {
  return async (dispatch, getState) => {
    const currentDate = new Date();
    let photosFileName = [];

    photos.map(value => {
      photosFileName.push(value.imageFileName);
      storage()
        .ref(`request/${customerId}/${value.imageFileName}`)
        .putFile(value.imageUri)
        .on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
    });
    const requestRef = firestore().collection('request').doc();
    requestRef.set({
      id: requestRef.id,
      storeId: storeId,
      customerId: customerId,
      customerName: customerName,
      customerPhone: customerPhone,
      measurements: measurements,
      category: category,
      photos: photosFileName,
      fabric: fabric,
      description: description,
      dateRequested: currentDate,
      status: 'pending',
      price: '',
      name: 'Custom ' + category,
      quantity: 1,
      balance: '',
    });
  };
};

export const fetchPendingOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('request')
        .orderBy('dateRequested', 'desc')
        .where('status', '==', 'pending')
        .where('storeId', '==', storeId)
        .limit(5);

      requestRef.onSnapshot(documentSnapshot => {
        const storePendingrequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storePendingrequest.push(
            new request(
              data.id,
              data.storeId,
              data.customerId,
              data.customerName,
              data.customerPhone,
              data.category,
              data.measurements,
              data.photos,
              data.fabric,
              data.description,
              data.dateRequested,
              data.status,
              data.price,
              data.name,
              data.quantity,
              data.balance,
            ),
          );
        });
        dispatch({
          type: SET_PENDING_ORDER_REQUEST,
          storePendingInfo: storePendingrequest,
        });
      });
    } catch (error) {
      console.log('error at fetchPendingOrder in request.js: ' + error);
    }
  };
};
export const fetchAcceptedOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('request')
        .orderBy('dateRequested', 'desc')
        .where('status', '==', 'accepted/topay')
        .where('storeId', '==', storeId)
        .limit(5);

      requestRef.onSnapshot(documentSnapshot => {
        const storeAcceptedrequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storeAcceptedrequest.push(
            new request(
              data.id,
              data.storeId,
              data.customerId,
              data.customerName,
              data.customerPhone,
              data.category,
              data.measurements,
              data.photos,
              data.fabric,
              data.description,
              data.dateRequested,
              data.status,
              data.price,
              data.name,
              data.quantity,
              data.balance,
            ),
          );
        });
        dispatch({
          type: SET_ACCEPTED_ORDER_REQUEST,
          storeAcceptedInfo: storeAcceptedrequest,
        });
      });
    } catch (error) {
      console.log('error at fetchPendingOrder in request.js: ' + error);
    }
  };
};
export const fetchOngoingOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('request')
        .orderBy('dateRequested', 'desc')
        .where('status', 'in', ['ongoing', 'ongoing/topay'])
        .where('storeId', '==', storeId)
        .limit(5);

      requestRef.onSnapshot(documentSnapshot => {
        const storeOngoingrequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storeOngoingrequest.push(
            new request(
              data.id,
              data.storeId,
              data.customerId,
              data.customerName,
              data.customerPhone,
              data.category,
              data.measurements,
              data.photos,
              data.fabric,
              data.description,
              data.dateRequested,
              data.status,
              data.price,
              data.name,
              data.quantity,
              data.balance,
            ),
          );
        });
        dispatch({
          type: SET_ONGOING_ORDER_REQUEST,
          storeOngoingInfo: storeOngoingrequest,
        });
      });
    } catch (error) {
      console.log('error at fetchPendingOrder in request.js: ' + error);
    }
  };
};
export const fetchToPickupOrder = storeId => {
  return (dispatch, getState) => {
    try {
      const requestRef = firestore()
        .collection('request')
        .orderBy('dateRequested', 'desc')
        .where('status', '==', 'topickup')
        .where('storeId', '==', storeId)
        .limit(5);

      requestRef.onSnapshot(documentSnapshot => {
        const storeToPickuprequest = [];
        documentSnapshot.docs.forEach(item => {
          const data = item.data();
          storeToPickuprequest.push(
            new request(
              data.id,
              data.storeId,
              data.customerId,
              data.customerName,
              data.customerPhone,
              data.category,
              data.measurements,
              data.photos,
              data.fabric,
              data.description,
              data.dateRequested,
              data.status,
              data.price,
              data.name,
              data.quantity,
              data.balance,
            ),
          );
        });
        dispatch({
          type: SET_TOPICKUP_ORDER_REQUEST,
          storeToPickupInfo: storeToPickuprequest,
        });
      });
    } catch (error) {
      console.log('error at fetchPendingOrder in request.js: ' + error);
    }
  };
};

export const fetchUserPendingOrder = (dispatch, getState) => {
  try {
    const customerId = getState().auth.userId;
    const requestRef = firestore()
      .collection('request')
      .orderBy('dateRequested', 'desc')
      .where('status', '==', 'pending')
      .where('customerId', '==', customerId)
      .limit(5);

    requestRef.onSnapshot(documentSnapshot => {
      const userPendingrequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userPendingrequest.push(
          new request(
            data.id,
            data.storeId,
            data.customerId,
            data.customerName,
            data.customerPhone,
            data.category,
            data.measurements,
            data.photos,
            data.fabric,
            data.description,
            data.dateRequested,
            data.status,
            data.price,
            data.name,
            data.quantity,
            data.balance,
          ),
        );
      });
      dispatch({
        type: SET_USERPENDING_ORDER_REQUEST,
        userPendingInfo: userPendingrequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserPendingOrder at request.js' + error);
  }
};
export const fetchUserAcceptedOrder = (dispatch, getState) => {
  try {
    const customerId = getState().auth.userId;
    const requestRef = firestore()
      .collection('request')
      .orderBy('dateRequested', 'desc')
      .where('status', '==', 'accepted/topay')
      .where('customerId', '==', customerId)
      .limit(5);

    requestRef.onSnapshot(documentSnapshot => {
      const userAcceptedRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userAcceptedRequest.push(
          new request(
            data.id,
            data.storeId,
            data.customerId,
            data.customerName,
            data.customerPhone,
            data.category,
            data.measurements,
            data.photos,
            data.fabric,
            data.description,
            data.dateRequested,
            data.status,
            data.price,
            data.name,
            data.quantity,
            data.balance,
          ),
        );
      });
      dispatch({
        type: SET_USERACCEPTED_ORDER_REQUEST,
        userAcceptedInfo: userAcceptedRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserPendingOrder at request.js' + error);
  }
};
export const fetchUserOngoingOrder = (dispatch, getState) => {
  try {
    const customerId = getState().auth.userId;
    const requestRef = firestore()
      .collection('request')
      .orderBy('dateRequested', 'desc')
      .where('status', 'in', ['ongoing', 'ongoing/topay'])
      .where('customerId', '==', customerId)
      .limit(5);

    requestRef.onSnapshot(documentSnapshot => {
      const userOngoingRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userOngoingRequest.push(
          new request(
            data.id,
            data.storeId,
            data.customerId,
            data.customerName,
            data.customerPhone,
            data.category,
            data.measurements,
            data.photos,
            data.fabric,
            data.description,
            data.dateRequested,
            data.status,
            data.price,
            data.name,
            data.quantity,
            data.balance,
          ),
        );
      });
      dispatch({
        type: SET_USERONGOING_ORDER_REQUEST,
        userOngoingInfo: userOngoingRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserPendingOrder at request.js' + error);
  }
};
export const fetchUserToPickupOrder = (dispatch, getState) => {
  try {
    const customerId = getState().auth.userId;
    const requestRef = firestore()
      .collection('request')
      .orderBy('dateRequested', 'desc')
      .where('status', '==', 'topickup')
      .where('customerId', '==', customerId)
      .limit(5);

    requestRef.onSnapshot(documentSnapshot => {
      const userToPickupRequest = [];
      documentSnapshot.docs.forEach(item => {
        const data = item.data();
        userToPickupRequest.push(
          new request(
            data.id,
            data.storeId,
            data.customerId,
            data.customerName,
            data.customerPhone,
            data.category,
            data.measurements,
            data.photos,
            data.fabric,
            data.description,
            data.dateRequested,
            data.status,
            data.price,
            data.name,
            data.quantity,
            data.balance,
          ),
        );
      });
      dispatch({
        type: SET_USERTOPICKUP_ORDER_REQUEST,
        userPickupInfo: userToPickupRequest,
      });
    });
  } catch (error) {
    console.log('error on fetchUserPendingOrder at request.js' + error);
  }
};
export const updateAcceptedRequest = (requestId, price) => {
  return (dispatch, getState) => {
    firestore()
      .collection('request')
      .doc(requestId)
      .update({price: price, status: 'accepted/topay'})
      .then(() => {
        console.log('User updated!');
      });
  };
};
export const updateUserAcceptedToPayRequest = (requestId, balance) => {
  let status = 'ongoing/topay';
  if (balance == 0) {
    status = 'ongoing';
  }
  return (dispatch, getState) => {
    firestore()
      .collection('request')
      .doc(requestId)
      .update({balance: balance, status: status})
      .then(() => {
        console.log('User updated!');
      });
  };
};
