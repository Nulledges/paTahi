import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../Components/UI/Card';
import SecondButton from '../../Components/UI/CustomButton/SecondButton';

import * as orderActions from '../../store/actions/order';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';

const UserOrderScreen = props => {
  const dispatch = useDispatch();
  const unseenInfo = useSelector(state => state.order.userUnseenRequest);
  const unseenOrderinfo = useSelector(state => state.order.userUnseenOrder);
  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel="premade orders"
          secondLabel=">"
          onPress={() => {
            props.navigation.navigate('MY ORDERS');
          }}
          numberOfNotification={unseenOrderinfo.length}
          customStyle={
            unseenOrderinfo.length >= 1 ? styles.notificationIndicator : ''
          }
        />
      </Card>
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel="custom orders"
          secondLabel=">"
          onPress={() => {
            props.navigation.navigate('USER CUSTOM ORDERS', {
              screen: 'Pending User Custom Order',
            });
          }}
          numberOfNotification={unseenInfo.length}
          customStyle={
            unseenInfo.length >= 1 ? styles.notificationIndicator : ''
          }
        />
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8E8',
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  notificationIndicator: {
    position: 'absolute',
    top: 10,
    right: 25,
    padding: 1,
    borderRadius: 50,
    backgroundColor: 'red',
    fontWeight: 'bold',
  },
});

export default UserOrderScreen;
