import firestore from '@react-native-firebase/firestore';

import orders from '../../models/orders';

export const SET_YEARLY_SALES = 'SET_YEARLY_SALES';
export const SET_MONTHLY_SALES = 'SET_MONTHLY_SALES';
export const SET_DAILY_SALES = 'SET_DAILY_SALES';

export const fetchYearlyCollectedOrders = (desiredYear, storeId) => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .where('datePickedup', '>=', new Date(`${desiredYear}-01-01`))
        .where('datePickedup', '<=', new Date(`${desiredYear}-12-31`))
        .where('storeId', '==', storeId)
        .onSnapshot(documentSnapshot => {
          const yearlyOrders = [];

          documentSnapshot.forEach(item => {
            const data = item.data();

            const orderId = item.id;
            yearlyOrders.push(
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
              ),
            );
          });
          dispatch({
            type: SET_YEARLY_SALES,
            yearlySalesData: yearlyOrders,
          });
        });
    } catch (error) {
      console.log('error on fetchYearlyCollectedOrders' + error);
    }
  };
};

export const fetchMonthlyCollectedOrders = (startDate, endDate, storeId) => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('orders')
        .where('datePickedup', '>=', startDate)
        .where('datePickedup', '<=', endDate)
        .where('storeId', '==', storeId)
        .onSnapshot(documentSnapshot => {
          const monthlyOrders = [];

          documentSnapshot.forEach(item => {
            const data = item.data();

            const orderId = item.id;
            monthlyOrders.push(
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
              ),
            );
          });
          dispatch({
            type: SET_MONTHLY_SALES,
            monthlySalesData: monthlyOrders,
          });
        });
    } catch (error) {
      console.log('error on fetchMonthlyCollectedOrders' + error);
    }
  };
};

export const fetchDailyCollectedOrders = (d, m, y, storeId) => {
  return (dispatch, getState) => {
    const sd = new Date(y, m, d); // Month is zero-based in JavaScript Date
    const ed = new Date(y, m, d + 1);
    try {
      firestore()
        .collection('orders')
        .where('datePickedup', '>=', sd)
        .where('datePickedup', '<', ed)
        .where('storeId', '==', storeId)
        .onSnapshot(documentSnapshot => {
          const dailyOrders = [];

          documentSnapshot.forEach(item => {
            const data = item.data();
  
            const orderId = item.id;
            dailyOrders.push(
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
              ),
            );
          });
          dispatch({
            type: SET_DAILY_SALES,
            dailySalesData: dailyOrders,
          });
        });
    } catch (error) {
      console.log('error on fetchDailyCollectedOrders' + error);
    }
  };
};
