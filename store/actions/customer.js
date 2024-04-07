import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import customer from '../../models/customer';
export const SET_CUSTOMER = 'SETCUSTOMER';
export const SET_CUSTOMER_DETAIL = 'SET_CUSTOMER_DETAIL';
export const fetchCustomers = storeId => {
  return (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      firestore()
        .collection('customer')
        .where('storeId', '==', storeId)
        .onSnapshot(documentSnapshot => {
          const storeCustomer = [];
          documentSnapshot.docs.forEach(item => {
            const customerData = item.data();

            storeCustomer.push(
              new customer(
                item.id,
                customerData.storeId,
                customerData.customerName,
                customerData.measurement,
              ),
            );
          });

          dispatch({
            type: SET_CUSTOMER,
            storeCustomers: storeCustomer,
          });
        });
    } catch (error) {
      console.log('erron at fetchSpecificCustomer in customer.js ' + error);
    }
  };
};
export const fetchSpecificCustomer = customerId => {
  return (dispatch, getState) => {
    try {
      firestore()
        .collection('customer')
        .where('id', '==', customerId)
        .onSnapshot(querySnapshot => {
          let specificCustomer = '';
          querySnapshot.docs.forEach(documentSnapshot => {
            const specificCustomerData = documentSnapshot.data();
            specificCustomer = specificCustomerData;
          });
          dispatch({
            type: SET_CUSTOMER_DETAIL,
            specificCustomer: specificCustomer,
          });
        });
    } catch (error) {
      console.log('erron at fetchSpecificCustomer in customer.js ' + error);
    }
  };
};
export const addCustomer = (
  /*   measurements,
  measurementValidities, */
  name,
  phone,
  storeId,
) => {
  return async (dispatch, getState) => {
    try {
      const customerRef = firestore().collection('customer').doc();
      await customerRef.set({
        /*    measurement: measurements,
        measurementValidities: measurementValidities, */
        customerName: name,
        storeId: storeId,
        id: customerRef.id,
        phoneNumber: phone,
      });
    } catch (error) {
      console.log('error at addCustomer at customer.js' + error);
    }
  };
};
export const updateCustomer = (name, phone, storeId, customerId) => {
  return (dispatch, getState) => {
    firestore().collection('customer').doc(customerId).update({
      customerName: name,
      storeId: storeId,
      phoneNumber: phone,
    });
  };
};
/* export const updateCustomer = (
  measurements,
  measurementValidities,
  name,
  phone,
  storeId,
  customerId,
) => {
  return (dispatch, getState) => {
    firestore().collection('customer').doc(customerId).update({
      measurement: measurements,
      measurementValidities: measurementValidities,
      customerName: name,
      storeId: storeId,
      phoneNumber: phone,
    });
  };
}; */
