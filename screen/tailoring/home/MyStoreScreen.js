import React, {useState, useEffect, useCallback} from 'react';
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
import axios from 'axios';
import {encode} from 'base-64';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Card from '../../../Components/UI/Card';
import SecondButton from '../../../Components/UI/CustomButton/SecondButton';
import * as storeActions from '../../../store/actions/store';
import * as userActions from '../../../store/actions/user';
import * as orderActions from '../../../store/actions/order';
import * as notificationActions from '../../../store/actions/notification';
import messaging from '@react-native-firebase/messaging';
import {NotificationManager} from 'react-native-push-notification';

const MyStoreScreen = props => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.userId);
  const unseenInfo = useSelector(state => state.order.storeUnseenRequest);
  const unseenOrderinfo = useSelector(state => state.order.storeUnseenOrder);
  const myStoreInformation = useSelector(state => state.store.myStore);
  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    //DeviceToken
    if (userToken) {
      const bootstrap = async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        /*   if (granted == 'denied' || granted == 'never_ask_again') {
          Alert.alert(
            'Notif ication Needed',
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
  useEffect(() => {
    try {
      dispatch(storeActions.fetchUserStore);
    } catch (error) {
      console.log('Error on ApplicationOverviewScreen: ' + error);
    }
  }, []);
  useEffect(() => {
    try {
      if (myStoreInformation != null) {
        dispatch(
          notificationActions.fetchActiveTailoringNotification(
            myStoreInformation.storeId,
          ),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [myStoreInformation]);
  /*   useEffect(() => {
    if (myStoreInformation != null) {
      dispatch(orderActions.fetchStoreOneUnseen(myStoreInformation.storeId));
    }
  }, [myStoreInformation]); */
  useEffect(() => {
    try {
      const getData = async () => {
        if (myStoreInformation != null) {
          if (myStoreInformation.subscriptionId != '') {
            const clientId =
              'AdQhsG0l6z7W3ss4ZOPfXD8ZauR1t6Qr3-K4S7S3ACQslUGMLzIv1c1HYDvzzSAwpaQhTGu68bxws__h';
            const clientSecret =
              'EHXY56_wfOgpX6XEvfX866k5HeGcF4Ydl2Khvt1Jz280d75CQF21Tel-FLKGRs_WHxmjPUmIW5IawRJx';

            const credentials = `${clientId}:${clientSecret}`;
            const base64Credentials = encode(credentials);
            const tokenResponse = await axios.post(
              'https://api-m.sandbox.paypal.com/v1/oauth2/token',
              'grant_type=client_credentials',
              {
                headers: {
                  Authorization: `Basic ${base64Credentials}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              },
            );
            const accessToken = tokenResponse.data.access_token;
            const getDetails = await axios.get(
              `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${myStoreInformation.subscriptionId}`,
              {
                headers: {
                  Authorization: `Bearer ` + accessToken,
                  'Content-Type': 'application/json',
                },
              },
            );

            if (getDetails.data.status === 'APPROVAL_PENDING') {
              setIsSubscribed(false);
            }
            if (
              getDetails.data.status === 'ACTIVE' &&
              myStoreInformation.isSubscribed == false
            ) {
              dispatch(
                storeActions.updateIsSubscribe(myStoreInformation.storeId),
              );
            }
            if (getDetails.data.status === 'ACTIVE') {
              setIsSubscribed(true);
            }
          } else {
            setIsSubscribed(false);
          }
        }
      };
      getData();
    } catch (error) {
      console.log(error);
    }
  }, [myStoreInformation]);
  useFocusEffect(
    useCallback(() => {
      if (myStoreInformation != null) {
        dispatch(orderActions.fetchStoreOneUnseen(myStoreInformation.storeId));
        dispatch(
          orderActions.fetchStoreOneOrderUnseen(myStoreInformation.storeId),
        );
      }
    }, [dispatch, myStoreInformation]),
  );
  const openAppSettings = () => {
    // Open the app settings where the user can manually grant the permission
    Linking.openSettings();
  };
  /*   useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('STORE SETTINGS');
          }}>
          <View>
            <Ionicons name={'md-settings-outline'} size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, []); */

  return (
    <View style={styles.container}>
      {/*   <Card style={styles.orderContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>PREMADE ORDERS</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE PREMADE ORDERS', {
                screen: 'STORECOLLECTED',
              });
            }}>
            <Text style={styles.textStyle}>{`View Sales History >`} </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.boxContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE PREMADE ORDERS', {
                screen: 'STORETOPICKUP',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>TO PICKUP</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE PREMADE ORDERS', {
                screen: 'STORECOLLECTED',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>COLLECTED</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE PREMADE ORDERS', {
                screen: 'STOREREFUNDED',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>REFUNDED</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Card>
      <Card style={styles.orderContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>Custom Orders</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE REQUEST', {
                screen: 'Collected Custom Order',
              });
            }}>
            <Text style={styles.textStyle}>{`View Sales History >`} </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.boxContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE REQUEST');
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>pending</Text>
              <View style={styles.notificationIndicator} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE REQUEST', {
                screen: 'Accepted Custom Order',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>Accepted</Text>
              <View style={styles.notificationIndicator} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE REQUEST', {
                screen: 'Ongoing Custom Order',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>ONGOING</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('STORE REQUEST', {
                screen: 'Pickup Custom Order',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>TO PICKUP</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Card> */}
      <Card style={styles.cardContainer}>
        <SecondButton
          onPress={() => {
            if (myStoreInformation.status == 'verification needed') {
              Alert.alert('Verification needed', 'Please check store status.', [
                {
                  text: 'OK',
                  onPress: () => {
                    props.navigation.navigate('TAILOR SETTINGS');
                    props.navigation.navigate('APPLICATION OVERVIEW');
                  },
                },
              ]);
            } else if (myStoreInformation.status == 'pending') {
              Alert.alert('Verification pending', 'Store being verified.', [
                {
                  text: 'OK',
                },
              ]);
            } else if (myStoreInformation.status == 'rejected') {
              Alert.alert(
                'Verification rejected',
                'Please resubmit your verification form.',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else {
              props.navigation.navigate('ORDERS SCREEN');
            }
          }}
          label={'Order Status'}
          numberOfNotification={unseenInfo.length + unseenOrderinfo.length}
          customStyle={
            unseenInfo.length >= 1 || unseenOrderinfo.length >= 1
              ? styles.notificationIndicator
              : ''
          }
        />
      </Card>
      <Card style={styles.cardContainer}>
        <SecondButton
          onPress={() => {
            if (myStoreInformation.status == 'verification needed') {
              Alert.alert('Verification needed', 'Please check store status.', [
                {
                  text: 'OK',
                  onPress: () => {
                    props.navigation.navigate('TAILOR SETTINGS');
                    props.navigation.navigate('APPLICATION OVERVIEW');
                  },
                },
              ]);
            } else if (myStoreInformation.status == 'pending') {
              Alert.alert('Verification pending', 'Store being verified.', [
                {
                  text: 'OK',
                },
              ]);
            } else if (myStoreInformation.status == 'rejected') {
              Alert.alert(
                'Verification rejected',
                'Please resubmit your verification form.',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else if (isSubscribed == false) {
              Alert.alert(
                'Subscription Needed',
                'Go to Settings => Store Status',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else {
              props.navigation.navigate('MY PRODUCT');
            }
          }}
          label="Premade Products"
        />
      </Card>
      <Card style={styles.cardContainer}>
        <SecondButton
          onPress={() => {
            if (myStoreInformation.status == 'verification needed') {
              Alert.alert('Verification needed', 'Please check store status.', [
                {
                  text: 'OK',
                  onPress: () => {
                    props.navigation.navigate('TAILOR SETTINGS');
                    props.navigation.navigate('APPLICATION OVERVIEW');
                  },
                },
              ]);
            } else if (myStoreInformation.status == 'pending') {
              Alert.alert('Verification pending', 'Store being verified.', [
                {
                  text: 'OK',
                },
              ]);
            } else if (myStoreInformation.status == 'rejected') {
              Alert.alert(
                'Verification rejected',
                'Please resubmit your verification form.',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else if (isSubscribed == false) {
              Alert.alert(
                'Subscription Needed',
                'Go to Settings => Store Status',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else {
              props.navigation.navigate('CUSTOMIZE CATEGORY');
            }
          }}
          label="Customize Category"
        />
      </Card>
      <Card style={styles.cardContainer}>
        <SecondButton
          onPress={() => {
            if (myStoreInformation.status == 'verification needed') {
              Alert.alert('Verification needed', 'Please check store status.', [
                {
                  text: 'OK',
                  onPress: () => {
                    props.navigation.navigate('TAILOR SETTINGS');
                    props.navigation.navigate('APPLICATION OVERVIEW');
                  },
                },
              ]);
            } else if (myStoreInformation.status == 'pending') {
              Alert.alert('Verification pending', 'Store being verified.', [
                {
                  text: 'OK',
                },
              ]);
            } else if (myStoreInformation.status == 'rejected') {
              Alert.alert(
                'Verification rejected',
                'Please resubmit your verification form.',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else if (isSubscribed == false) {
              Alert.alert(
                'Subscription Needed',
                'Go to Settings => Store Status',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else {
              props.navigation.navigate('WALK IN CUSTOMER', {
                storeId: myStoreInformation.storeId,
              });
            }
          }}
          label="Walk-in Customers"
        />
      </Card>
      {/*     <Card style={styles.cardContainer}>
        <SecondButton
          onPress={() => {
            props.navigation.navigate('TAILOR CHAT', {
              storeId: myStoreInformation.storeId,
            });
          }}
          label="CHAT"
        />
      </Card>
      <Card style={styles.cardContainer}>
        <SecondButton
          onPress={() => {
            props.navigation.navigate('TAILORNOTIFICATION');
          }}
          label="NOTIFICATION"
        />
      </Card> */}

      <Card style={styles.cardContainer}>
        <SecondButton
          onPress={() => {
            if (myStoreInformation.status == 'verification needed') {
              Alert.alert('Verification needed', 'Please check store status.', [
                {
                  text: 'OK',
                  onPress: () => {
                    props.navigation.navigate('TAILOR SETTINGS');
                    props.navigation.navigate('APPLICATION OVERVIEW');
                  },
                },
              ]);
            } else if (myStoreInformation.status == 'pending') {
              Alert.alert('Verification pending', 'Store being verified.', [
                {
                  text: 'OK',
                },
              ]);
            } else if (myStoreInformation.status == 'rejected') {
              Alert.alert(
                'Verification rejected',
                'Please resubmit your verification form.',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else {
              props.navigation.navigate('SALES REPORT');
            }
          }}
          label="Sales Report"
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
  orderContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 2,
  },
  textStyle: {
    color: 'black',
    textTransform: 'uppercase',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  box: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderRadius: 75,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    textTransform: 'uppercase',
    color: 'black',
    fontSize: 10,
  },
  square: {
    width: 75,
    height: 75,
    borderWidth: 1,

    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareText: {
    textTransform: 'uppercase',
    color: 'black',
    fontSize: 10,
  },

  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  notificationIndicator: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 1,
    borderRadius: 50,
    backgroundColor: 'red',
  },
});

export default MyStoreScreen;
