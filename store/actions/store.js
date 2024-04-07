import {ToastAndroid, Alert} from 'react-native';

import stores from '../../models/stores';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import auth from '@react-native-firebase/auth';
import {authenticate} from './authentication';
export const SET_USER_STORE = 'SET_USER_STORE';
export const SET_APPROVED_STORE = 'SET_APPROVED_STORE';
export const SET_APPROVED_CART_STORE = 'SET_APPROVED_CART_STORE';
export const SET_SPECIFIC_STORE = 'SET_SPECIFIC_STORE';

export const createStore = (
  storeName,
  storeOwner,
  phone,
  storeImageUri,
  storeImageFilename,
  storeIconUri,
  storeIconFileName,
  email,
  password,
  latitude,
  longitude,
) => {
  return async (dispatch, getState) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const unsubcribe = () => {
          let initialize = false;
          auth().onAuthStateChanged(user => {
            if (user) {
              if (!initialize) {
                initialize = true;
                firestore()
                  .collection('Users')
                  .doc(user.uid)
                  .set({
                    email: user.email,
                    isTailor: true,
                    name: storeOwner,
                    phoneNumber: parseInt(phone),
                    profileBanner: 'defaultProfileBanner.jpg',
                    profileIcon: 'defaultProfileIcon.png',
                    userType: 'User',
                    username: storeName,
                    notificationToken: '',
                  })
                  .then(() => {
                    firestore()
                      .collection('Users')
                      .doc(user.uid)
                      .get()
                      .then(documentSnapshot => {
                        const userData = documentSnapshot.data();
                        auth()
                          .currentUser.getIdTokenResult()
                          .then(idTokenResult => {
                            dispatch(
                              authenticate(
                                user.uid,
                                idTokenResult.token,
                                userData.userType,
                                userData.isTailor,
                              ),
                            );
                          })
                          .then(() => {
                            storage()
                              .ref(`stores/banners/${storeImageFilename}`)
                              .putFile(storeImageUri)
                              .on('state_changed', taskSnapshot => {
                                console.log(
                                  `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                                );
                              });
                            storage()
                              .ref(`stores/icons/${storeIconFileName}`)
                              .putFile(storeIconUri)
                              .on('state_changed', taskSnapshot => {
                                console.log(
                                  `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                                );
                              });

                            firestore()
                              .collection('stores')
                              .add({
                                activeProduct: 0,
                                email: email,
                                inactiveProduct: 0,
                                latitude: latitude,
                                longitude: longitude,
                                phoneNumber: parseInt(phone),
                                status: 'verification needed',
                                storeImage: storeImageFilename,
                                storeIcon: storeIconFileName,
                                userId: user.uid,
                                storeName: storeName,
                                storeOwner: storeOwner,
                                isSubscribed: false,
                                subscriptionId: '',
                              })
                              .then(() => {
                                firestore()
                                  .collection('stores')
                                  .where('userId', '==', user.uid)
                                  .get()
                                  .then(querySnapshot => {
                                    querySnapshot.docs.forEach(
                                      documentSnapshot => {
                                        const storeId = documentSnapshot.id;
                                        firestore()
                                          .collection('stores')
                                          .doc(storeId)
                                          .update({storeId: storeId});
                                      },
                                    );
                                  });
                              });
                          });
                      });
                  });
              }
            }
          });
        };
        return unsubcribe();
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Error!', 'Invalid email.');
            break;
          case 'auth/weak-password':
            Alert.alert('Error!', 'Password must be 6 characters or longer.');
            break;
          case 'auth/email-already-in-use':
            Alert.alert('Error!', 'Email address already taken.');
            break;
        }
      });
  };
};
export const fetchUserStore = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('stores')
    .where('userId', '==', userId)
    .onSnapshot(querySnapshot => {
      let myStore = '';
      querySnapshot.docs.forEach(documentSnapshot => {
        const myStoreData = documentSnapshot.data();
        myStore = myStoreData;
      });
      dispatch({
        type: SET_USER_STORE,
        myStoreInfo: myStore,
      });
    });
  /*    firestore()
      .collection('stores')
      .where()
      .onSnapshot(documentSnapshot => {
        let storeData = documentSnapshot.data();
        console.log(storeData); */
  /* const myStore = [];
          documentSnapshot.docs.forEach(item => {
            const storeData = item.data();
            myStore.push(
              new tailors(
                item.id,
                storeData.activeProduct,
                storeData.email,
                storeData.inactiveProduct,
                storeData.location,
                storeData.phoneNumber,
                storeData.status,
                storeData.storeImage,
                storeData.storeName,
                storeData.storeOwner,
                storeData.userId,
              ),
            );
          }); */

  /*  }); */
};
//used in
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
            approvedStore.subscriptionId,
          ),
        );
      });
      dispatch({
        type: 'SET_APPROVED_STORE',
        approvedStoreInfo: allApprovedStores,
      });
    });
};
export const fetchCartStore = storeId => {
  //FOR CART NOT TO ERROR WHILE ADDING NEW PRODUCT
  return (dispatch, getState) => {
    firestore()
      .collection('stores')
      .where('storeId', 'in', storeId)
      .onSnapshot(documentSnapshot => {
        const allCartApprovedStores = [];
        documentSnapshot.docs.forEach(item => {
          const approvedStore = item.data();
          allCartApprovedStores.push(
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
              approvedStore.subscriptionId,
            ),
          );
        });
        dispatch({
          type: 'SET_APPROVED_CART_STORE',
          cartApprovedStoreInfo: allCartApprovedStores,
        });
      });
  };
};
export const fetchSpecificStore = storeId => {
  //FOR STORE
  return (dispatch, getState) => {
    const unsubscribe = firestore()
      .collection('stores')
      .where('storeId', '==', storeId)
      .onSnapshot(documentSnapshot => {
        const specificStore = [];
        documentSnapshot.docs.forEach(item => {
          const approvedStore = item.data();

          specificStore.push(
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
              approvedStore.subscriptionId,
            ),
          );
        });
        dispatch({
          type: 'SET_SPECIFIC_STORE',
          specificStore: specificStore,
        });
      });
    return () => unsubscribe();
  };
};
export const updateStoreImages = (
  storeId,
  storeIconInitialFileName,
  storeIconUri,
  storeIconFileName,
  storeImageInitialFileName,
  storeImageUri,
  storeImageFileName,
) => {
  console.log(storeIconInitialFileName);
  console.log(storeIconFileName);
  return (dispatch, getState) => {
    if (
      storeIconInitialFileName === storeIconFileName ||
      storeIconFileName === ''
    ) {
      console.log('suc store icon');
    } else {
      console.log('not store icon');
      //update storeIcon
      storage()
        .ref(`stores/icons/${storeIconFileName}`)
        .putFile(storeIconUri)
        .on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
      //delete Prev icon
      storage().ref(`stores/icons/${storeIconInitialFileName}`).delete();
      //update firestore
      if (storeIconFileName == '') {
      } else {
        firestore().collection('stores').doc(storeId).update({
          storeIcon: storeIconFileName,
        });
      }
    }

    if (
      storeImageInitialFileName === storeImageFileName ||
      storeImageFileName === ''
    ) {
    } else {
      //update store image
      storage()
        .ref(`stores/banners/${storeImageFileName}`)
        .putFile(storeImageUri)
        .on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
      storage().ref(`stores/banners/${storeImageInitialFileName}`).delete();
      if (storeImageFileName === '') {
      } else {
        firestore().collection('stores').doc(storeId).update({
          storeImage: storeImageFileName,
        });
      }
    }
  };
};
export const updateStoreName = (storeId, storeName) => {
  return async (dispatch, getState) => {
    try {
      const batch = firestore().batch();

      const storeRef = firestore().collection('stores').doc(storeId);
      batch.update(storeRef, {storeName: storeName});

      await batch.commit();
    } catch (error) {
      console.error('Error updating Store name:', error);
    }
  };
};
export const updateStoreOwner = (storeId, storeOwner) => {
  return async (dispatch, getState) => {
    try {
      const batch = firestore().batch();

      const storeRef = firestore().collection('stores').doc(storeId);
      batch.update(storeRef, {storeOwner: storeOwner});

      await batch.commit();
    } catch (error) {
      console.error('Error updating Store owner Name:', error);
    }
  };
};

export const eraseStoreSubscriptionId = storeId => {
  return async (dispatch, getState) => {
    try {
      const batch = firestore().batch();

      const storeRef = firestore().collection('stores').doc(storeId);
      batch.update(storeRef, {subscriptionId: ''});

      await batch.commit();
    } catch (error) {
      console.error('Error updating Subcription:', error);
    }
  };
};

export const updateSubscriptionId = (storeId, subscriptionId) => {
  return async (dispatch, getState) => {
    try {
      const batch = firestore().batch();

      const storeRef = firestore().collection('stores').doc(storeId);
      batch.update(storeRef, {subscriptionId: subscriptionId});

      await batch.commit();
      console.log('update successful');
    } catch (error) {
      console.error('Error updating Subcription:', error);
    }
  };
};
export const updateIsSubscribe = storeId => {
  return async (dispatch, getState) => {
    try {
      const batch = firestore().batch();

      const storeRef = firestore().collection('stores').doc(storeId);
      batch.update(storeRef, {isSubscribed: true});

      await batch.commit();
      console.log('update successful');
    } catch (error) {
      console.error('Error updating Subcription:', error);
    }
  };
};
