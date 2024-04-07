export const ADD_PAYMENT_DETAIL = 'ADD_PAYMENT_DETAIL';
export const EMPTY_PAYMENT_DETAIL = 'EMPTY_PAYMENT_DETAIL';

export const AddPayment = paymentDetail => {
  return {type: ADD_PAYMENT_DETAIL, paymentDetail: paymentDetail};
};
export const emptyPaymentDetail = () => {
  return {type: EMPTY_PAYMENT_DETAIL};
};
