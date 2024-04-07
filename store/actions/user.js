import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import user from '../../models/user';

/* export const CREATE_NEW_USER_INFO = 'CREATE_NEW_USER_INFO'; */
export const SET_USER_INFO = 'SET_USER_INFO';
/* export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'; */

export const fetchUserData = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('Users')
    .doc(userId)
    .onSnapshot(documentSnapshot => {
      const userId = documentSnapshot.id;
      let userData = documentSnapshot.data();
      /* const UserInformation = []; */
      userData.userId = userId;

      /* UserInformation.push(
        new user(
          userId,
          userData.email,
          userData.isTailor,
          userData.name,
          userData.phoneNumber,
          userData.profileBanner,
          userData.profileIcon,
          userData.username,
        ),
      );
 */
      dispatch({
        type: SET_USER_INFO,
        userInfo: userData,
      });
    });
};

export const updatePhoneNumber = (PhoneNumber, userId) => {
  return (dispatch, getState) => {
    firestore()
      .collection('Users')
      .doc(userId)
      .update({phoneNumber: parseInt(PhoneNumber)})
      .then(() => {
        console.log('User updated!');
      });
    firestore()
      .collection('stores')
      .where('userId', '==', userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(item => {
          console.log(item.id);
          console.log(item.data());
          firestore()
            .collection('stores')
            .doc(item.id)
            .update({phoneNumber: parseInt(PhoneNumber)})
            .then(() => {
              console.log('User updated!');
            });
        });
      });
  };
};
/* export const updateUsername = (username, userId) => {
  return (dispatch, getState) => {
    firestore()
      .collection('Users')
      .doc(userId)
      .update({username: username})
      .then(() => {
        console.log('User updated!');
        firestore()
          .collection('RatingsAndReviews')
          .where('customerId', '==', userId)
          .get()
          .then(querySnapshot => {
            querySnapshot.docs.forEach(item => {
              firestore()
                .collection('RatingsAndReviews')
                .doc(item.id)
                .update({username: username})
                .then(() => {
                  console.log('Review updated!');
                });
            });
          });
      });
  };
}; */
export const updateUsername = (username, userId) => {
  return async (dispatch, getState) => {
    try {
      // Create a new batch instance
      const batch = firestore().batch();

      // Update user document
      const userRef = firestore().collection('Users').doc(userId);
      batch.update(userRef, {username: username});
      console.log('User updated!');

      // Fetch ratings and reviews associated with the user
      const ratingsQuerySnapshot = await firestore()
        .collection('RatingsAndReviews')
        .where('customerId', '==', userId)
        .get();

      // Update each rating/review document in the batch
      ratingsQuerySnapshot.docs.forEach(item => {
        const reviewRef = firestore()
          .collection('RatingsAndReviews')
          .doc(item.id);
        batch.update(reviewRef, {username: username});
        console.log('Review updated!');
      });

      // Commit the batch update
      await batch.commit();

      console.log('Batch update completed successfully!');
    } catch (error) {
      console.log('Error updating username:', error);
    }
  };
};
export const updateFullname = (fullname, userId) => {
  return async (dispatch, getState) => {
    try {
      const batch = firestore().batch();
      const userRef = firestore().collection('Users').doc(userId);
      batch.update(userRef, {name: fullname});
      batch.commit();

      console.log('Batch update completed successfully!');
    } catch (error) {
      console.log('Error updating username:', error);
    }
  };
};
export const updateNotificationToken = (notificationToken, userId) => {
  return (dispatch, getState) => {
    firestore()
      .collection('Users')
      .doc(userId)
      .update({notificationToken: notificationToken})
      .then(() => {});
  };
};
/* export const updateProfileImages = (
  userId,
  profileIconInitialFilename,
  profileIconUri,
  profileIconFilename,
  profileBannerInitialFilename,
  profileBannerUri,
  profileBannerFilename,
) => {
  return (dispatch, getState) => {
    //uploadImages
    if (profileIconInitialFilename === profileIconFilename) {
    } else {
      storage()
        .ref(`profile/${profileIconFilename}`)
        .putFile(profileIconUri)
        .on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
    }
    if (profileBannerInitialFilename === profileBannerFilename) {
    } else {
      storage()
        .ref(`profile/${profileBannerFilename}`)
        .putFile(profileBannerUri)
        .on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
    }
    //delete images
    if (
      profileIconInitialFilename === 'defaultProfileIcon.png' ||
      profileIconInitialFilename === profileIconFilename
    ) {
    } else {
      storage().ref(`profile/${profileIconInitialFilename}`).delete();
    }

    if (
      profileBannerInitialFilename === 'defaultProfileBanner.jpg' ||
      profileBannerInitialFilename === profileBannerFilename
    ) {
    } else {
      storage().ref(`profile/${profileBannerInitialFilename}`).delete();
    }
    setTimeout(async () => {
      if (
        profileIconFilename == '' ||
        profileIconInitialFilename === profileIconFilename
      ) {
      } else {
        firestore().collection('Users').doc(userId).update({
          profileIcon: profileIconFilename,
        });
      }

      if (
        profileBannerFilename == '' ||
        profileBannerInitialFilename === profileBannerFilename
      ) {
      } else {
        firestore().collection('Users').doc(userId).update({
          profileBanner: profileBannerFilename,
        });
      }
    }, 1750);
  };
}; */
export const updateProfileImages = (
  userId,
  profileIconInitialFilename,
  profileIconUri,
  profileIconFilename,
  profileBannerInitialFilename,
  profileBannerUri,
  profileBannerFilename,
) => {
  return async (dispatch, getState) => {
    try {
      const uploadImage = async (filename, uri) => {
        return new Promise((resolve, reject) => {
          storage()
            .ref(`profile/${filename}`)
            .putFile(uri)
            .on(
              'state_changed',
              taskSnapshot => {
                console.log(
                  `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                );
              },
              error => {
                reject(error); // Reject the promise if there is an error
              },
              () => {
                resolve(); // Resolve the promise when the upload is complete
              },
            );
        });
      };

      const deleteImage = async filename => {
        await storage().ref(`profile/${filename}`).delete();
      };

      const batch = firestore().batch(); // Create a batch object

      // Delete images
      if (
        profileIconInitialFilename !== 'defaultProfileIcon.png' &&
        profileIconInitialFilename !== profileIconFilename
      ) {
        try {
          await deleteImage(profileIconInitialFilename);
          console.log('Delete success:', profileIconInitialFilename);
        } catch (error) {
          console.error('Delete error:', profileIconInitialFilename, error);
          // Handle delete error here
          // You might want to implement appropriate error handling or cleanup logic
          throw error; // Throw the error to be caught by the outer try-catch block
        }
      }

      if (
        profileBannerInitialFilename !== 'defaultProfileBanner.jpg' &&
        profileBannerInitialFilename !== profileBannerFilename
      ) {
        try {
          await deleteImage(profileBannerInitialFilename);
          console.log('Delete success:', profileBannerInitialFilename);
        } catch (error) {
          console.error('Delete error:', profileBannerInitialFilename, error);
          // Handle delete error here
          // You might want to implement appropriate error handling or cleanup logic
          throw error; // Throw the error to be caught by the outer try-catch block
        }
      }

      // Upload images
      if (profileIconInitialFilename !== profileIconFilename) {
        try {
          await uploadImage(profileIconFilename, profileIconUri);
          console.log('Upload success:', profileIconFilename);
        } catch (error) {
          console.error('Upload error:', profileIconFilename, error);
          // Handle upload error here
          // You might want to implement appropriate error handling or cleanup logic
          throw error; // Throw the error to be caught by the outer try-catch block
        }
      }

      if (profileBannerInitialFilename !== profileBannerFilename) {
        try {
          await uploadImage(profileBannerFilename, profileBannerUri);
          console.log('Upload success:', profileBannerFilename);
        } catch (error) {
          console.error('Upload error:', profileBannerFilename, error);
          // Handle upload error here
          // You might want to implement appropriate error handling or cleanup logic
          throw error; // Throw the error to be caught by the outer try-catch block
        }
      }

      // Update profile data
      if (
        profileIconFilename !== '' &&
        profileIconInitialFilename !== profileIconFilename
      ) {
        const userRef = firestore().collection('Users').doc(userId);
        batch.update(userRef, {profileIcon: profileIconFilename});
        const userRatingReviewSnapshot = await firestore()
          .collection('RatingsAndReviews')
          .where('customerId', '==', userId)
          .get();
        userRatingReviewSnapshot.docs.forEach(item => {
          console.log(item.id);
          const userRatingAndReviewRef = firestore()
            .collection('RatingsAndReviews')
            .doc(item.id);
          batch.update(userRatingAndReviewRef, {
            profileIcon: profileIconFilename,
          });
        });
      }

      if (
        profileBannerFilename !== '' &&
        profileBannerInitialFilename !== profileBannerFilename
      ) {
        const userRef = firestore().collection('Users').doc(userId);
        batch.update(userRef, {profileBanner: profileBannerFilename});
      }

      // Commit the batch
      await batch.commit();
    } catch (error) {
      // Handle any errors caught during the process
      console.error('Error updating profile images:', error);
      // You can handle the error here or rethrow it to be caught by the caller
      // You might want to implement appropriate error handling or cleanup logic
    }
  };
};
