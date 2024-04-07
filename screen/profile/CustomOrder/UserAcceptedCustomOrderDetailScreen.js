import React, {useEffect, useCallback, useState, useReducer} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Modal,
  Alert,
} from 'react-native';
import {v4 as uuid} from 'uuid';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../../Components/UI/Card';
import MainButton from '../../../Components/UI/CustomButton/MainButton';
import TwoLabelButton from '../../../Components/UI/CustomButton/TwoLabelButton';
import CustomInputWithLabel from '../../../Components/UI/Inputs/CustomInputWithLabel';
import WebViewItem from '../../../Components/Item/WebViewItem';
import * as orderActions from '../../../store/actions/order';
import * as paymentActions from '../../../store/actions/payment';
const UserAcceptedCustomOrderDetailScreen = props => {
  const dispatch = useDispatch();
  const orders = props.route.params.orderItems;
  const paymentDetails = useSelector(state => state.payment.paymentDetails);
  const [showWebView, setShowWebView] = useState(false);
  const [toPay, setToPay] = useState();

  useEffect(() => {
    const items = [];
    const products = [];
    const item = {
      name: orders.items[0].productTitle,
      price:
        props.route.params?.category == undefined ||
        props.route.params?.category == 'full payment'
          ? +(orders.items[0].productPrice * 1).toFixed(2)
          : +(orders.items[0].productPrice * 0.5).toFixed(2),
      quantity: orders.items[0].quantity,
    };
    products.push(item);

    items.push({id: uuid(), items: products});

    setToPay(items);
  }, [props.route.params?.category]);

  useEffect(() => {
    if (paymentDetails.length == undefined) {
      console.log(paymentDetails);
      const balance =
        props.route.params?.category == undefined ||
        props.route.params?.category == 'full payment'
          ? 0
          : +(orders.totalPrice * 0.5).toFixed(2);
      dispatch(
        orderActions.updateUserAcceptedToPayRequest(
          orders.id,
          balance,
          orders.storeId,
        ),
      );
      setShowWebView(false);
      dispatch(paymentActions.emptyPaymentDetail());
      Alert.alert('Payment', 'Payment succeded', [
        {
          text: 'OK',
          onPress: () => {
            props.navigation.goBack();
          },
        },
      ]);
    }
  }, [paymentDetails]);
  const placeOrderHandler = () => {
    setShowWebView(true);
  };

  const cancelHandler = () => {
    dispatch(orderActions.updateCancelRequest(orders.id, orders.storeId));
    props.navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={showWebView}
        onRequestClose={!setShowWebView}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              setShowWebView(false);
            }}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <WebViewItem items={toPay} />
        </View>
      </Modal>
      <ScrollView
        style={{width: '100%', height: '90%', marginBottom: '19%'}}
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: '2%',
          marginTop: '1.5%',
        }}>
        <Card style={styles.cardContainer}>
          <TwoLabelButton
            firstLabel="ORDER STATUS"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.status}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Customer Detail
          </Text>
          <TwoLabelButton
            firstLabel="Customer name"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.username}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Phone Number"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.userPhone}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Customize Order Detail
          </Text>
          <TwoLabelButton
            firstLabel="Name"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.items[0].productTitle}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Category"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.items[0].productCategory}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />

          <TwoLabelButton
            firstLabel="Asked Price"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={`₱${orders.items[0].productPrice}`}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Quantity"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={`x${orders.items[0].quantity}`}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="TotalPrice"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={`₱${orders.totalPrice}`}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <Text
            style={{
              color: 'black',
              textTransform: 'lowercase',
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Measurements
          </Text>
          {Object.keys(orders.items[0].measurements).map(item => {
            return (
              <TwoLabelButton
                key={item}
                FirstTextStyle={{paddingLeft: 25}}
                firstLabel={item}
                secondTextStyle={{paddingRight: 25}}
                secondLabel={orders.items[0].measurements[item] + ' inches'}
              />
            );
          })}
          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Payment Detail
          </Text>

          <TwoLabelButton
            firstLabel="Payment Type"
            FirstTextStyle={{paddingLeft: 25, fontWeight: 'bold'}}
            secondLabel={`${
              props.route.params?.category == undefined
                ? 'full payment'
                : props.route.params?.category
            } >`}
            secondTextStyle={{paddingRight: 25, fontWeight: 'bold'}}
            onPress={() => {
              props.navigation.navigate('USER PAYMENT TYPE CATEGORY', {
                orderItems: orders,
              });
            }}
          />
          <TwoLabelButton
            firstLabel="Asked Price"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={`₱ ${orders.items[0].productPrice}`}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Quantity"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={`x${orders.items[0].quantity}`}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Total price"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={
              props.route.params?.category == undefined ||
              props.route.params?.category == 'full payment'
                ? (orders.totalPrice * 1).toFixed(2)
                : (orders.totalPrice * 0.5).toFixed(2)
            }
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Payment Method"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={'PayPal'}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
        </Card>
      </ScrollView>
      <ScrollView
        style={styles.buttonContainer}
        contentContainerStyle={{
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexGrow: 1,
        }}>
        <MainButton
          label={'Cancel Order'}
          style={styles.buttonStyle}
          onPress={cancelHandler}
        />
        <MainButton
          label={'Pay'}
          style={styles.buttonStyle}
          onPress={placeOrderHandler}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  buttonStyle: {
    width: '45%',
    margin: 5,
    borderRadius: 10,
  },
  cardContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    height: '10%',
    bottom: 0,
    position: 'absolute',
  },
  saveButton: {
    width: '95%',
    backgroundColor: 'black',
    margin: 5,
    borderRadius: 10,
  },
  textStyle: {
    color: 'black',
  },
  closeButton: {
    width: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    zIndex: 1,
    backgroundColor: 'grey',
    padding: 5,
    borderRadius: 100,
    margin: 50,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default UserAcceptedCustomOrderDetailScreen;
