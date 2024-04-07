import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableNativeFeedbackBase,
  Modal,
  ScrollView,
  PermissionsAndroid,
  Linking,
  Alert,
} from 'react-native';
import functions from '@react-native-firebase/functions';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import Card from '../../Components/UI/Card';
import MainButton from '../../Components/UI/CustomButton/MainButton';
import WebViewItem from '../../Components/Item/WebViewItem';
import * as userActions from '../../store/actions/user';

import * as cartActions from '../../store/actions/cart';
import * as notificationActions from '../../store/actions/notification';
const HomeScreen = props => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.userId);
  const cartProducts = useSelector(state => state.cart.cartProducts);
  const userInfo = useSelector(state => state.user.myInformation);

  useEffect(() => {
    //headerRight
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (userToken) {
              props.navigation.navigate('CART');
            } else {
              props.navigation.navigate('HOMESTACKLOGIN');
            }
          }}>
          <View>
            {cartProducts.length > 0 && (
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  backgroundColor: 'red',
                  zIndex: 100,
                  right: 1,
                  width: 12.5,
                  position: 'absolute',
                  borderRadius: 100,
                  opacity: 0.9,
                }}>
                <Text style={{fontWeight: 'bold'}}>{cartProducts.length}</Text>
              </View>
            )}
            <Ionicons name="md-cart" size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  });
  //fetching Data
  useEffect(() => {
    try {
      if (userToken) {
        const unsubcribe = dispatch(userActions.fetchUserData);
        return unsubcribe;
      }
    } catch (error) {
      console.log('Error at MyAccountScreen: ' + error);
    }
  }, []);
  useEffect(() => {
    try {
      if (userToken) {
        const unsubcribe = dispatch(
          notificationActions.fetchActiveNotification,
        );
        return unsubcribe;
      }
    } catch (error) {
      console.log('Error at MyAccountScreen: ' + error);
    }
  }, []);
  useEffect(() => {
    try {
      if (userToken) {
        const unsubcribe = dispatch(cartActions.fetchCartItems(userId));
        return unsubcribe;
      }
    } catch (error) {
      console.log('Error at MyAccountScreen: ' + error);
    }
  }, []);
  /*   useEffect(() => {
    try {
      if (userToken) {
        const unsubcribe = dispatch(orderActions.fetchOneUnseen);
        return unsubcribe;
      }
    } catch (error) {
      console.log('Error at MyAccountScreen: ' + error);
    }
  }, []); */
  useEffect(() => {
    //DeviceToken
    if (userToken) {
      const bootstrap = async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

 /*        if (granted == 'denied' || granted == 'never_ask_again') {
          Alert.alert(
            'Notification Needed',
            'Notification is needed to work please turn on the notification',
            [{text: 'OK', onPress: () => openAppSettings()}],
          );
        } */
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        dispatch(userActions.updateNotificationToken(token, userId));
      };
      bootstrap();
    }
  }, []);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        granted['android.permission.ACCESS_COARSE_LOCATION'] == 'granted' &&
        granted['android.permission.ACCESS_FINE_LOCATION'] == 'granted'
      ) {
        props.navigation.navigate('FIND TAILORING');
      } else {
        Alert.alert(
          'Location Permission Needed',
          'Location Permission is needed to work',
          [{text: 'OK', onPress: () => openAppSettings()}],
        );
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const openAppSettings = () => {
    // Open the app settings where the user can manually grant the permission
    Linking.openSettings();
  };
  /* UserAction.updateNotificationToken(token,) */

  /*   useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);
   current.setDate(current.getDate() + 30);
  console.log(current.toDateString()); */

  useEffect(() => {
    const onMessageReceived = async message => {
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      await notifee.displayNotification({
        title: `${message.data.title}`,
        body: `${message.data.body}`,
        android: {
          channelId,
        },
      });
    };

    messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);
  }, []);
  const instantRefund = () => {
    const refund = functions().httpsCallable('instantRefund');

    refund({})
      .then(result => {
        const data = result.data;
        console.log('Refund response:', data); // Log the response data for debugging or further processing
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  return (
    <View style={styles.container}>
      {/* <View style={styles.findTailoringContainer}>
        <TouchableOpacity
          onPress={() => {
            instantRefund();
          }}>
          <Text style={styles.itemsText}>REFUND</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.findTailoringContainer}>
        <TouchableOpacity
          onPress={() => {
            requestLocationPermission();
          }}>
          <Text style={styles.itemsText}>FIND TAILORING</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('PRODUCT OVERVIEW');
          }}
          style={styles.items}>
          <Text style={styles.itemsText}>Products</Text>
       {/*    <Ionicons name="shirt-outline" size={150} color="#900D09" /> */}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('STORE OVERVIEW');
          }}
          style={styles.items}>
          <Text style={styles.itemsText}>Stores</Text>
       {/*    <MaterialCommunityIcons
            name="store-outline"
            size={150}
            color="#000080"
          /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

/*    const getdatafromfunction = functions().httpsCallable('getCartData')
        
        getdatafromfunction({}).then(result =>{
          console.log(result)
        }) */
const styles = StyleSheet.create({
  redDotContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 5,
    height: 5,
    zIndex: 100,
    alignSelf: 'flex-end',
    borderRadius: 50,
    padding: 5,
  },
  notificationIndicator: {
    position: 'absolute',
    zIndex: 100,
    right: 0,
    left: 0,
    borderRadius: 50,
    backgroundColor: 'red',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  findTailoringContainer: {
    width: '93%',
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    margin: 15,
  },
  items: {
    width: '48%',
    height: '30%',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemsText: {
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    alignSelf: 'center',
  },
  closeButton: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 1,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
