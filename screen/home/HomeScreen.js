import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableNativeFeedbackBase,
  Modal,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import Card from '../../Components/UI/Card';
import MainButton from '../../Components/UI/CustomButton/MainButton';
import WebViewItem from '../../Components/Item/WebViewItem';
import * as userActions from '../../store/actions/user';

const HomeScreen = props => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.userId);
  const cartItems = useSelector(state => state.cart.items);
  const userInfo = useSelector(state => state.user.myInformation);
  const [showWebView, setShowWebView] = useState(false);

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
            {cartItems.length > 0 && (
              <View style={styles.redDotContainer}></View>
            )}
            <Ionicons name="md-cart" size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    //DeviceToken
    if (userToken) {
      const bootstrap = async () => {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        dispatch(userActions.updateNotificationToken(token, userId));
      };
      bootstrap();
    }
  }, []);

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
  

  // it adds 30 days to a current date
  /*  current.setDate(current.getDate() + 30);
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
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          <WebViewItem cartId={userId} />
        </View>
      </Modal>
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('PRODUCT OVERVIEW');
          }}
          style={styles.items}>
          <Text style={styles.itemsText}>Products</Text>
          <Ionicons name="shirt-outline" size={150} color="#900D09" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('STORE OVERVIEW');
          }}
          style={styles.items}>
          <Text style={styles.itemsText}>Stores</Text>
          <MaterialCommunityIcons
            name="store-outline"
            size={150}
            color="#000080"
          />
        </TouchableOpacity>
      </View>
      <MainButton
        onPress={() => {
  
          setShowWebView(true);
        }}
        label="Display WebView"
      />
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
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
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
