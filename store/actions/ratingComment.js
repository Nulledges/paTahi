import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import rating from '../../models/rating';
import ratingAndReview from '../../models/ratingAndReview';
export const SET_NOTRATED_ORDERS = 'SET_NOTRATED_ORDERS';
export const SET_USERRATEDANDREVIEW_PRODUCTS =
  'SET_USERRATEDANDREVIEW_PRODUCTS';
export const SET_PRODUCTRATINGANDREVIEW_PRODUCTS =
  'SET_PRODUCTRATINGANDREVIEW_PRODUCTS';
//used in rateProductScreen on profile Folder
export const createRatingAndComment = (
  productId,
  storeId,
  orderId,
  variantId,
  productTitle,
  productPrimaryImage,
  productPrice,
  quantity,
  productRating,
  productReview,
) => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const userInfo = getState().user.myInformation;
      const currentDate = new Date();
      const batch = firestore().batch();
      const ratingRef = firestore().collection('RatingsAndReviews').doc();
      ratingRef.set({
        id: ratingRef.id,
        productId: productId,
        storeId: storeId,
        customerId: userId,
        productTitle: productTitle,
        productPrimaryImage: productPrimaryImage,
        productPrice: productPrice,
        quantity: quantity,
        productRating: productRating,
        productReview: productReview,
        dateReviewed: currentDate,
        username: userInfo.username,
        profileIcon: userInfo.profileIcon,
      });
      //fetch then update
      const orderRef = firestore().collection('orders').doc(orderId);
      const productRef = firestore().collection('Products').doc(productId);

      const orderSnapshot = await orderRef.get();
      const productSnapshot = await productRef.get();

      const productData = productSnapshot.data();
      const orderData = orderSnapshot.data();

      const productRatings = productData.ratings;
      const orderItems = orderData.items;

      /*  const increment = firebase.firestore.FieldValue.increment(1); */

      switch (productRating) {
        case 1:
          productRatings['1Star'] = productRatings['1Star'] + 1;
          break;
        case 2:
          productRatings['2Star'] = productRatings['2Star'] + 1;
          break;
        case 3:
          productRatings['3Star'] = productRatings['3Star'] + 1;
          break;
        case 4:
          productRatings['4Star'] = productRatings['4Star'] + 1;
          break;
        case 5:
          productRatings['5Star'] = productRatings['5Star'] + 1;
          break;
      }
      const updatedItems = orderItems.filter(item => item.id !== variantId);
      const variantItem = orderItems.find(item => item.id === variantId);
      variantItem.isRated = true;
      updatedItems.push(variantItem);
      batch.update(productRef, {ratings: productRatings});
      batch.update(orderRef, {items: updatedItems});
      await batch.commit();

      console.log('Order items updated with batch write!');
      const allItemsRated = orderItems.every(item => item.isRated === true);
      if (allItemsRated) {
        orderRef.update({status: 'collected/rated'});
      }
    } catch (error) {
      console.log(
        'error at createRatingAndComment in ratingComment.js ' + error,
      );
    }
  };
};
//TorateScreen in profile folder
export const fetchNotRatedOrders = (dispatch, getState) => {
  const userId = getState().auth.userId;
  const orderQuerySnapshot = firestore()
    .collection('orders')
    .where('status', '==', 'collected')
    .where('userId', '==', userId);

  orderQuerySnapshot.onSnapshot(doc => {
    const notRatedOrders = [];
    const data = doc.docs;
    data.forEach(item => {
      const data = item.data();
      notRatedOrders.push(
        new rating(
          data.id,
          data.storeId,
          data.storeName,
          data.userId,
          data.status,
          data.items,
          data.totalPrice,
          data.dateOrdered,
          data.dateCollected,
          data.isRated,
        ),
      );
    });
    dispatch({
      type: SET_NOTRATED_ORDERS,
      notRatedOrdersInfo: notRatedOrders,
    });
  });
  /*   firestore()
      .collection('orders')
      .where('h', 'array-contains', '07sfdWFDpsTWXZyeQEaN')
      .onSnapshot(documentSnapshot => {
        documentSnapshot.docs.forEach(item => {
          const collectedNotRatedData = item.data();
          console.log(collectedNotRatedData);
        });
      }); */
};
//ratingScreen in profile folder
export const fetchUserRatedAndReview = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('RatingsAndReviews')
    .where('customerId', '==', userId)
    .orderBy('dateReviewed', 'desc')
    .onSnapshot(doc => {
      const ratedAndReviewProduct = [];

      const ratingAndReviewRef = doc.docs;
      ratingAndReviewRef.forEach(item => {
        const data = item.data();

        ratedAndReviewProduct.push(
          new ratingAndReview(
            data.id,
            data.customerId,
            data.dateReviewed,
            data.productId,
            data.productPrice,
            data.productPrimaryImage,
            data.productRating,
            data.productReview,
            data.productTitle,
            data.profileIcon,
            data.quantity,
            data.storeId,
            data.username,
          ),
        );
      });

      dispatch({
        type: SET_USERRATEDANDREVIEW_PRODUCTS,
        userRatedAndReviewInfo: ratedAndReviewProduct,
      });
    });
};
//productDetailScreen in home folder
export const fetchProductRatingAndReview = productId => {
  return (dispatch, getState) => {
    const userId = getState().auth.userId;
    firestore()
      .collection('RatingsAndReviews')
      .where('productId', '==', productId)
      .orderBy('dateReviewed', 'desc')
      .onSnapshot(doc => {
        const productRatingAndReview = [];

        const ratingAndReviewRef = doc.docs;
        ratingAndReviewRef.forEach(item => {
          const data = item.data();

          productRatingAndReview.push(
            new ratingAndReview(
              item.id,
              data.customerId,
              data.dateReviewed,
              data.productId,
              data.productPrice,
              data.productPrimaryImage,
              data.productRating,
              data.productReview,
              data.productTitle,
              data.profileIcon,
              data.quantity,
              data.storeId,
              data.username,
            ),
          );
        });

        dispatch({
          type: SET_PRODUCTRATINGANDREVIEW_PRODUCTS,
          productRatingAndReviewInfo: productRatingAndReview,
        });
      });
  };
};
