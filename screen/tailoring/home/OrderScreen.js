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
import Card from '../../../Components/UI/Card';
import SecondButton from '../../../Components/UI/CustomButton/SecondButton';
import * as storeActions from '../../../store/actions/store';
import * as userActions from '../../../store/actions/user';
import TwoLabelButton from '../../../Components/UI/CustomButton/TwoLabelButton';

const OrderScreen = props => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.userId);
  const myStoreInformation = useSelector(state => state.store.myStore);
  const unseenInfo = useSelector(state => state.order.storeUnseenRequest);
  const unseenOrderinfo = useSelector(state => state.order.storeUnseenOrder);
  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel="premade orders"
          secondLabel=">"
          onPress={() => {
            props.navigation.navigate('STORE PREMADE ORDERS', {
              screen: 'STORETOPICKUP',
            });
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
            props.navigation.navigate('STORE REQUEST', {
              screen: 'Pending Custom Order',
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

export default OrderScreen;
