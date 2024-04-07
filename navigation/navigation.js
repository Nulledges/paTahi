import React, {useLayoutEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ToastAndroid,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Alert,
} from 'react-native';

import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
//Authentication Screen
import LoginScreen from '../screen/authentication/LoginScreen';
import ForgetPasswordScreen from '../screen/authentication/ForgetPasswordScreen';
import SignupScreen from '../screen/authentication/SignupScreen';
import TailorRegistrationScreen from '../screen/authentication/TailorRegistrationScreen';
//Admin Screen
import AdminMainScreen from '../screen/admin/AdminMainScreen';
import StoreVerificationScreen from '../screen/admin/StoreVerificationScreen';
import VerificationFormDetailScreen from '../screen/admin/VerificationFormDetailScreen';
import ApprovedScreen from '../screen/admin/ApprovedScreen';
import ApprovedDetailScreen from '../screen/admin/ApprovedDetailScreen';
import AdminSettingsScreen from '../screen/admin/AdminSettingsScreen';
//profile Screen
import MyAccountScreen from '../screen/profile/MyAccountScreen';
import AccountSettingsScreen from '../screen/profile/Settings/AccountSettingsScreen';
import AccountAndSecurityScreen from '../screen/profile/Settings/AccountAndSecurityScreen';
import EditProfileScreen from '../screen/profile/Settings/EditProfileScreen';
import EditNameScreen from '../screen/profile/Settings/EditNameScreen';
import ChangeUsernameScreen from '../screen/profile/Settings/ChangeUsernameScreen';

import VerifyNumberScreen from '../screen/profile/VerifyNumberScreen';
import ChangeEmailScreen from '../screen/profile/Settings/ChangeEmailScreen';
import EmailLoginVerificationScreen from '../screen/profile/Settings/EmailLoginVerificationScreen';
import PasswordLoginVerificationScreen from '../screen/profile/Settings/PasswordLoginVerificationScreen';
import ChangePasswordScreen from '../screen/profile/Settings/ChangePasswordScreen';
import RatingScreen from '../screen/profile/Ratings/RatingScreen';
import ToRateScreen from '../screen/profile/Ratings/ToRateScreen';
import RateProductScreen from '../screen/profile/Ratings/RateProductScreen';
import MyMeasurementBookScreen from '../screen/profile/UserMeasurement/MyMeasurementBookScreen';
import AddMeasurementScreen from '../screen/profile/UserMeasurement/AddMeasurementScreen';
import MyMeasurementDetailScreen from '../screen/profile/UserMeasurement/MyMeasurementDetailScreen';
//profile tailoringShopApplication
import BecomeATailorScreen from '../screen/profile/tailoringShopApplication/BecomeATailorScreen';
import SetTailorStoreScreen from '../screen/profile/tailoringShopApplication/SetTailorStoreScreen';
//USER PREMADE ORDER STATUS
import UserOrderScreen from '../screen/profile/UserOrderScreen';
import ToPickupScreen from '../screen/profile/PremadeOrder/ToPickupScreen';
import CollectedScreen from '../screen/profile/PremadeOrder/CollectedScreen';
import RefundedScreen from '../screen/profile/PremadeOrder/RefundedScreen';
import OrderDetailScreen from '../screen/profile/PremadeOrder/OrderDetailScreen';
import PremadeOrderDetailScreen from '../screen/profile/PremadeOrder/PremadeOrderDetailScreen';
//USER CUSTOM ORDER STATUS
import UserPendingCustomOrderScreen from '../screen/profile/CustomOrder/UserPendingCustomOrderScreen';
import UserPendingCustomOrderDetailScreen from '../screen/profile/CustomOrder/UserPendingCustomOrderDetailScreen';
import UserAcceptedCustomOrderScreen from '../screen/profile/CustomOrder/UserAcceptedCustomOrderScreen';
import UserAcceptedCustomOrderDetailScreen from '../screen/profile/CustomOrder/UserAcceptedCustomOrderDetailScreen';
import UserOngoingCustomOrderScreen from '../screen/profile/CustomOrder/UserOngoingCustomOrderScreen';
import UserOngoingCustomOrderDetailScreen from '../screen/profile/CustomOrder/UserOngoingCustomOrderDetailScreen';
import UserToPickupCustomOrderScreen from '../screen/profile/CustomOrder/UserToPickupCustomOrderScreen';
import UserToPickupCustomOrderDetailScreen from '../screen/profile/CustomOrder/UserToPickupCustomOrderDetailScreen';
import UserCollectedCustomOrderScreen from '../screen/profile/CustomOrder/UserCollectedCustomOrderScreen';
import UserCollectedCustomOrderDetailScreen from '../screen/profile/CustomOrder/UserCollectedCustomOrderDetailScreen';
import UserCancelledCustomOrderScreen from '../screen/profile/CustomOrder/UserCancelledCustomOrderScreen';
import UserCancelledCustomOrderDetailScreen from '../screen/profile/CustomOrder/UserCancelledCustomOrderDetailScreen';
import UserPaymentTypeCategoryScreen from '../screen/profile/CustomOrder/UserPaymentTypeCategoryScreen';

//Tailor
import MyStoreScreen from '../screen/tailoring/home/MyStoreScreen';
//TAILOR PREMADE ORDER STATUS
import OrderScreen from '../screen/tailoring/home/OrderScreen';
import StoreToPickupScreen from '../screen/tailoring/home/PremadeOrder/StoreToPickupScreen';
import StoreCollectedOrdersScreen from '../screen/tailoring/home/PremadeOrder/StoreCollectedOrdersScreen';
import StoreRefundedOrdersScreen from '../screen/tailoring/home/PremadeOrder/StoreRefundedOrdersScreen';
import StoreOrderDetailScreen from '../screen/tailoring/home/PremadeOrder/StoreOrderDetailScreen';
import StorePremadeOrderDetailScreen from '../screen/tailoring/home/StorePremadeOrderDetailScreen';
//TAILOR CUSTOM ORDER STATUS
import PendingCustomOrderScreen from '../screen/tailoring/home/CustomOrder/PendingCustomOrderScreen';
import PendingCustomOrderDetailScreen from '../screen/tailoring/home/CustomOrder/PendingCustomOrderDetailScreen';
import AcceptedToPayOrderScreen from '../screen/tailoring/home/CustomOrder/AcceptedToPayOrderScreen';
import AcceptedToPayOrderDetailScreen from '../screen/tailoring/home/CustomOrder/AcceptedToPayOrderDetailScreen';
import CustomOrderDetailScreen from '../screen/tailoring/home/CustomOrder/CustomOrderDetailScreen';
import OngoingCustomOrderScreen from '../screen/tailoring/home/CustomOrder/OngoingCustomOrderScreen';
import OngoingCustomOrderDetailScreen from '../screen/tailoring/home/CustomOrder/OngoingCustomOrderDetailScreen';
import ToPickupCustomOrderScreen from '../screen/tailoring/home/CustomOrder/ToPickupCustomOrderScreen';
import ToPickupCustomOrderDetailScreen from '../screen/tailoring/home/CustomOrder/ToPickupCustomOrderDetailScreen';
import CollectedCustomOrderScreen from '../screen/tailoring/home/CustomOrder/CollectedCustomOrderScreen';
import CollectedCustomOrderDetailScreen from '../screen/tailoring/home/CustomOrder/CollectedCustomOrderDetailScreen';
import CancelledCustomOrderScreen from '../screen/tailoring/home/CustomOrder/CancelledCustomOrderScreen';
import CancelledCustomOrderDetailScreen from '../screen/tailoring/home/CustomOrder/CancelledCustomOrderDetailScreen';

import AddProductScreen from '../screen/tailoring/home/AddProductScreen';
import EditProductScreen from '../screen/tailoring/home/EditProductScreen';
import LiveProductScreen from '../screen/tailoring/home/LiveProductScreen';
import DelistedProductScreen from '../screen/tailoring/home/DelistedProductScreen';
import SelectCategoryScreen from '../screen/tailoring/home/SelectCategoryScreen';

import WalkInCustomerScreen from '../screen/tailoring/home/Customer/WalkInCustomerScreen';
import CustomerDetailScreen from '../screen/tailoring/home/Customer/CustomerDetailScreen';
import WalkinAddNewOrderScreen from '../screen/tailoring/home/Customer/WalkinAddNewOrderScreen';
import SelectCustomerCategoryScreen from '../screen/tailoring/home/Customer/SelectCustomerCategoryScreen';
import AddWalkinCustomerScreen from '../screen/tailoring/home/Customer/AddWalkinCustomerScreen';
import EditWalkinCustomerScreen from '../screen/tailoring/home/Customer/EditWalkinCustomerScreen';

import DailySalesScreen from '../screen/tailoring/home/DailySalesScreen';
import MonthlySalesScreen from '../screen/tailoring/home/MonthlySalesScreen';
import YearlySalesScreen from '../screen/tailoring/home/YearlySalesScreen';

import CustomizeCategoryScreen from '../screen/tailoring/home/Category/CustomizeCategoryScreen';
import AddCustomizeCategoryScreen from '../screen/tailoring/home/Category/AddCustomizeCategoryScreen';
import CustomizeCategoryDetailScreen from '../screen/tailoring/home/Category/CustomizeCategoryDetailScreen';
import EditCustomizeCategoryScreen from '../screen/tailoring/home/Category/EditCustomizeCategoryScreen';
import CustomOrderScreen from '../screen/home/CustomOrderScreen';

import TailorChatScreen from '../screen/tailoring/chat/TailorChatScreen';
import TailorChatRoomScreen from '../screen/tailoring/chat/TailorChatRoomScreen';
import TailorNotification from '../screen/tailoring/notification/TailorNotificationScreen';

import StoreSettingScreen from '../screen/tailoring/settings/StoreSettingsScreen';
import EditStoreScreen from '../screen/tailoring/settings/EditStoreScreen';
import ChangeStoreNameScreen from '../screen/tailoring/settings/ChangeStoreNameScreen';
import ChangeOwnerNameScreen from '../screen/tailoring/settings/ChangeOwnerNameScreen';
import ChangeNumberScreen from '../screen/profile/Settings/ChangeNumberScreen';

import ApplicationOverviewScreen from '../screen/tailoring/settings/ApplicationOverviewScreen';
import ApplicationFormScreen from '../screen/tailoring/settings/ApplicationFormScreen';
import ApplicationHistoryScreen from '../screen/tailoring/settings/ApplicationHistoryScreen';

//profile tailorShop
/* import MyStoreScreen from '../screen/profile/TailoringShop/MyStoreScreen'; */

//store Products

//store Orders

//STORE NOTIFIACTION
/* import TailorNotification from '../screen/profile/TailoringShop/Notification/TailorNotification'; */
//chat Screen
import ChatScreen from '../screen/chat/ChatScreen';
import ChatRoomScreen from '../screen/chat/ChatRoomScreen';
//notification Screen
import NotificationScreen from '../screen/notification/NotificationScreen';
//home Screen
import HomeScreen from '../screen/home/HomeScreen';
import CartScreen from '../screen/home/CartScreen';
import CheckOutScreen from '../screen/home/CheckOutScreen';
import FindTailoringScreen from '../screen/home/FindTailoringScreen';
import SelectPaymentMethodScreen from '../screen/home/SelectPaymentMethodScreen';
import ProductOverviewScreen from '../screen/home/ProductOverviewScreen';
import ProductDetailScreen from '../screen/home/ProductDetailScreen';
import ProductDetailChatScreen from '../screen/home/ProductDetailChatScreen';
import CustomizeProductScreen from '../screen/home/CustomizeProductScreen';
import AddProductChooseMeasurementScreen from '../screen/home/AddProductChooseMeasurementScreen';
import ConfirmAddOrderScreen from '../screen/home/ConfirmAddOrderScreen';
import HomeStoreOverviewScreen from '../screen/home/HomeStoreOverviewScreen';
import HomeStoreDetailScreen from '../screen/home/HomeStoreDetailScreen';
import MoreInfomationScreen from '../screen/home/MoreInformationScreen';
import SelectCategoryCustomOrderScreen from '../screen/home/SelectCategoryCustomOrderScreen';

//--------------------------------------//

const LoginStack = createNativeStackNavigator();
export const LoginStackNavigator = () => {
  const navigation = useNavigation();
  return (
    <LoginStack.Navigator initialRouteName="LOG IN">
      <LoginStack.Screen
        name="LOG IN"
        component={LoginScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          headerLeft: () => (
            <TouchableOpacity
              style={{marginRight: 30}}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'HOMEBOTTOM'}],
                });
              }}>
              <View>
                <Ionicons name={'arrow-back'} size={24} color="black" />
              </View>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <LoginStack.Screen
        name="FORGOT PASSWORD"
        component={ForgetPasswordScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <LoginStack.Screen
        name="TAILOR REGISTRATION"
        component={TailorRegistrationScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: 'TAILOR REGISTRATION',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <LoginStack.Screen
        name="USER REGISTRATION"
        component={SignupScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: 'USER REGISTRATION',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </LoginStack.Navigator>
  );
};
//for homelogin
const HomeLoginStack = createNativeStackNavigator();
export const HomeLoginStackNavigator = () => {
  const navigation = useNavigation();
  return (
    <HomeLoginStack.Navigator initialRouteName="LOG IN">
      <HomeLoginStack.Screen
        name="LOG IN"
        component={LoginScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeLoginStack.Screen
        name="FORGOT PASSWORD"
        component={ForgetPasswordScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeLoginStack.Screen
        name="TAILOR REGISTRATION"
        component={TailorRegistrationScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: 'TAILOR REGISTRATION',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeLoginStack.Screen
        name="USER REGISTRATION"
        component={SignupScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: 'USER REGISTRATION',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </HomeLoginStack.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();
export const HomeStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'HOMESTACKLOGIN' ||
      routeName === 'CART' ||
      routeName === 'PRODUCT OVERVIEW' ||
      routeName === 'PRODUCT DETAIL' ||
      routeName === 'PRODUCT DETAIL CHAT' ||
      routeName === 'CUSTOMIZE PRODUCT' ||
      routeName === 'MY MEASUREMENT' ||
      routeName === 'ADD MEASUREMENT' ||
      routeName === 'STORE OVERVIEW' ||
      routeName === 'STORE DETAIL' ||
      routeName === 'SELECT CATEGORY CUSTOM' ||
      routeName === 'CUSTOM ORDER' ||
      routeName === 'MORE INFO' ||
      routeName === 'CHECKOUT' ||
      routeName === 'PAYMENT METHOD' ||
      routeName === 'CHOOSE MEASUREMENT' ||
      routeName === 'CONFIRM ORDER' ||
      routeName === 'FIND TAILORING'
    ) {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HOME"
        component={HomeScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />
      <HomeStack.Screen
        name="CART"
        component={CartScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="CHECKOUT"
        component={CheckOutScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="FIND TAILORING"
        component={FindTailoringScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="PAYMENT METHOD"
        component={SelectPaymentMethodScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="PRODUCT OVERVIEW"
        component={ProductOverviewScreen}
        options={{
          /*   headerLeft: () => (
            <TouchableOpacity>
              <View>
                <TextInput
                  placeholder="Search!"
                  placeholderTextColor={'black'}
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    height: 40,
                    width: 300,
                    fontSize: 14,
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: 15,
                  }}
                />
              </View>
            </TouchableOpacity>
          ), */
          headerTitle: 'PRODUCTS OVERVIEW',
          headerBackVisible: true,
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="PRODUCT DETAIL"
        component={ProductDetailScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      <ChatStack.Screen
        name="PRODUCT DETAIL CHAT"
        component={ProductDetailChatScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />
      <ChatStack.Screen
        name="CUSTOMIZE PRODUCT"
        component={CustomizeProductScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />

      <HomeStack.Screen
        name="CHOOSE MEASUREMENT"
        component={AddProductChooseMeasurementScreen}
        options={{
          headerTintColor: 'black',

          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="CONFIRM ORDER"
        component={ConfirmAddOrderScreen}
        options={{
          headerTintColor: 'black',
          title: 'ADD TO CART',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="MY MEASUREMENT"
        component={MyMeasurementBookScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="ADD MEASUREMENT"
        component={AddMeasurementScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="STORE OVERVIEW"
        component={HomeStoreOverviewScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="STORE DETAIL"
        component={HomeStoreDetailScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      <HomeStack.Screen
        name="SELECT CATEGORY CUSTOM"
        component={SelectCategoryCustomOrderScreen}
        options={{
          headerTitle: 'Select Category',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="CUSTOM ORDER"
        component={CustomOrderScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="MORE INFO"
        component={MoreInfomationScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <HomeStack.Screen
        name="HOMESTACKLOGIN"
        component={HomeLoginStackNavigator}
        options={{
          headerTintColor: 'black',
          headerTitle: 'LOG IN',
          headerShown: false,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </HomeStack.Navigator>
  );
};
const ChatStack = createNativeStackNavigator();
export const ChatStackNavigation = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'CHATROOM') {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);
  return (
    <ChatStack.Navigator initialRouteName="CHAT">
      <ChatStack.Screen
        name="CHAT"
        component={ChatScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />

      <ChatStack.Screen
        name="CHATROOM"
        component={ChatRoomScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />
    </ChatStack.Navigator>
  );
};
const NotificationStack = createNativeStackNavigator();
export const NotificationStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'MY ORDERS' ||
      routeName === 'ORDER DETAILS' ||
      routeName === 'USER CUSTOM ORDERS' ||
      routeName === 'USER PENDING CUSTOM ORDERS DETAIL' ||
      routeName === 'USER ACCEPTED CUSTOM ORDERS DETAIL' ||
      routeName === 'USER ONGOING CUSTOM ORDERS DETAIL' ||
      routeName === 'USER TOPICKUP CUSTOM ORDERS DETAIL' ||
      routeName === 'USER COLLECTED CUSTOM ORDERS DETAIL' ||
      routeName === 'USER CANCELLED CUSTOM ORDERS DETAIL' ||
      routeName === 'USER PAYMENT TYPE CATEGORY'
    ) {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);
  return (
    <NotificationStack.Navigator initialRouteName="NOTIFICATION">
      <NotificationStack.Screen
        name="NOTIFICATION"
        component={NotificationScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      <AccountStack.Screen
        name="MY ORDERS"
        component={PurchaseStatusTopTabNavigator}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="ORDER DETAILS"
        component={OrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <NotificationStack.Screen
        name="USER CUSTOM ORDERS"
        component={UserCustomOrderTopTabNavigator}
        options={{
          headerTintColor: 'black',
          headerTitle: 'CUSTOM ORDERS',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <NotificationStack.Screen
        name="USER PENDING CUSTOM ORDERS DETAIL"
        component={UserPendingCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'ORDER DETAIL',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <NotificationStack.Screen
        name="USER ACCEPTED CUSTOM ORDERS DETAIL"
        component={UserAcceptedCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'TO PAY',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <NotificationStack.Screen
        name="USER ONGOING CUSTOM ORDERS DETAIL"
        component={UserOngoingCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Order detail',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <NotificationStack.Screen
        name="USER TOPICKUP CUSTOM ORDERS DETAIL"
        component={UserToPickupCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Order detail',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <NotificationStack.Screen
        name="USER COLLECTED CUSTOM ORDERS DETAIL"
        component={UserCollectedCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Order detail',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <NotificationStack.Screen
        name="USER CANCELLED CUSTOM ORDERS DETAIL"
        component={UserCancelledCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Order detail',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      <NotificationStack.Screen
        name="USER PAYMENT TYPE CATEGORY"
        component={UserPaymentTypeCategoryScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'PAYMENT TYPE',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </NotificationStack.Navigator>
  );
};

const AccountStack = createNativeStackNavigator();
export const AccountStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'USER ORDERS SCREEN' ||
      routeName === 'MY ORDERS' ||
      routeName === 'ORDER DETAILS' ||
      routeName === 'USER CUSTOM ORDERS' ||
      routeName === 'USER PENDING CUSTOM ORDERS DETAIL' ||
      routeName === 'USER ACCEPTED CUSTOM ORDERS DETAIL' ||
      routeName === 'USER ONGOING CUSTOM ORDERS DETAIL' ||
      routeName === 'USER TOPICKUP CUSTOM ORDERS DETAIL' ||
      routeName === 'USER COLLECTED CUSTOM ORDERS DETAIL' ||
      routeName === 'USER CANCELLED CUSTOM ORDERS DETAIL' ||
      routeName === 'USER PAYMENT TYPE CATEGORY' ||
      routeName === 'STORE DETAIL' ||
      routeName === 'MORE INFO' ||
      routeName === 'SELECT CATEGORY CUSTOM' ||
      routeName === 'CUSTOM ORDER' ||
      routeName === 'PRODUCT DETAIL' ||
      routeName === 'PRODUCT DETAIL CHAT' ||
      routeName === 'CART' ||
      routeName === 'CHECKOUT' ||
      routeName === 'MY RATING' ||
      routeName === 'RATE PRODUCT' ||
      routeName === 'BECOME A TAILOR' ||
      routeName === 'SET TAILORING SHOP' ||
      routeName === 'SETTINGS' ||
      routeName === 'ACCOUNTANDSECURITY' ||
      routeName === 'EDITPROFILE' ||
      routeName === 'EDITNAME' ||
      routeName === 'CHANGEUSERNAME' ||
      routeName === 'VERIFYNUMBER' ||
      routeName === 'CHANGENUMBER' ||
      routeName === 'EMAILLOGINVERIFICATION' ||
      routeName === 'CHANGEEMAIL' ||
      routeName === 'PASSWORDLOGINVERIFICATION' ||
      routeName === 'CHANGEPASSWORD' ||
      routeName === 'STORE ORDERS' ||
      routeName === 'STORE ORDERS DETAILS' ||
      routeName === 'MY MEASUREMENT' ||
      routeName === 'ADD MEASUREMENT' ||
      routeName === 'MEASUREMENT DETAIL' ||
      routeName === 'WALK IN CUSTOMER' ||
      routeName === 'ADD CUSTOMER' ||
      routeName === 'CUSTOMER DETAIL' ||
      routeName === 'SALES REPORT' ||
      routeName === 'CHATROOM' ||
      routeName === 'TAILOR CHAT' ||
      routeName === 'TAILORNOTIFICATION'
    ) {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);
  const userToken = useSelector(state => state.auth.token);
  return (
    <AccountStack.Navigator initialRouteName="ACCOUNT">
      <AccountStack.Screen
        name="ACCOUNT"
        component={MyAccountScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="USER ORDERS SCREEN"
        component={UserOrderScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      <AccountStack.Screen
        name="MY ORDERS"
        component={PurchaseStatusTopTabNavigator}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="ORDER DETAILS"
        component={OrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      {/*  <AccountStack.Screen
        name="ORDER DETAILS PREMADE"
        component={PremadeOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'ORDER DETAILS',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      /> */}
      <AccountStack.Screen
        name="USER CUSTOM ORDERS"
        component={UserCustomOrderTopTabNavigator}
        options={{
          headerTintColor: 'black',
          headerTitle: 'CUSTOM ORDERS',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="USER PENDING CUSTOM ORDERS DETAIL"
        component={UserPendingCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'ORDER DETAIL',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="USER ACCEPTED CUSTOM ORDERS DETAIL"
        component={UserAcceptedCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'TO PAY',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="USER ONGOING CUSTOM ORDERS DETAIL"
        component={UserOngoingCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Order detail',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="USER TOPICKUP CUSTOM ORDERS DETAIL"
        component={UserToPickupCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Order detail',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="USER COLLECTED CUSTOM ORDERS DETAIL"
        component={UserCollectedCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Order detail',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="USER CANCELLED CUSTOM ORDERS DETAIL"
        component={UserCancelledCustomOrderDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Order detail',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="USER PAYMENT TYPE CATEGORY"
        component={UserPaymentTypeCategoryScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'PAYMENT TYPE',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      {/* Copy from other stacks for smooth transition from here to end comment */}
      <HomeStack.Screen
        name="HOME"
        component={HomeScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />
      <AccountStack.Screen
        name="STORE DETAIL"
        component={HomeStoreDetailScreen}
      />
      <AccountStack.Screen name="MORE INFO" component={MoreInfomationScreen} />
      <AccountStack.Screen
        name="SELECT CATEGORY CUSTOM"
        component={SelectCategoryCustomOrderScreen}
        options={{
          headerTitle: 'Select Category',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="CUSTOM ORDER"
        component={CustomOrderScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="PRODUCT DETAIL"
        component={ProductDetailScreen}
      />
      <AccountStack.Screen
        name="PRODUCT DETAIL CHAT"
        component={ProductDetailChatScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />
      <AccountStack.Screen
        name="CART"
        component={CartScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="CHECKOUT"
        component={CheckOutScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      {/*    <HomeStack.Screen
        name="CONFIRM ORDER"
        component={ConfirmAddOrderScreen}
        options={{
          headerTintColor: 'black',
          title: 'ADD TO CART',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      /> */}
      {/* end */}
      <AccountStack.Screen
        name="MY RATING"
        component={MyRatingTopTabNavigator}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="RATE PRODUCT"
        component={RateProductScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="MY MEASUREMENT"
        component={MyMeasurementBookScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="ADD MEASUREMENT"
        component={AddMeasurementScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="MEASUREMENT DETAIL"
        component={MyMeasurementDetailScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="BECOME A TAILOR"
        component={BecomeATailorScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'WELCOME TO PATAHI',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="SET TAILORING SHOP"
        component={SetTailorStoreScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'SET TAILOR STORE INFO',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="SETTINGS"
        component={AccountSettingsScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="ACCOUNTANDSECURITY"
        component={AccountAndSecurityScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'ACCOUNT & SECURITY',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="EDITPROFILE"
        component={EditProfileScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Edit Profile',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="EDITNAME"
        component={EditNameScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Edit Name',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGEUSERNAME"
        component={ChangeUsernameScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Username',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="VERIFYNUMBER"
        component={VerifyNumberScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Verify Phone Number',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGENUMBER"
        component={ChangeNumberScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Phone Number',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="EMAILLOGINVERIFICATION"
        component={EmailLoginVerificationScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Verification',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGEEMAIL"
        component={ChangeEmailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Change Email',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="PASSWORDLOGINVERIFICATION"
        component={PasswordLoginVerificationScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Verification',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGEPASSWORD"
        component={ChangePasswordScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Change Password',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      {/* <AccountStack.Screen
        name="MYSTORE"
        component={MyStoreScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'MY STORE',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      /> */}
      {/*  <AccountStack.Screen
        name="TAILOR CHAT"
        component={TailorChatScreen}
        options={{
          headerTintColor: 'black',

          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      /> */}
      <ChatStack.Screen
        name="CHATROOM"
        component={ChatRoomScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />
      {/*    <ChatStack.Screen
        name="TAILORNOTIFICATION"
        component={TailorNotification}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      /> */}
      {/*     <AccountStack.Screen
        name="SALES REPORT"
        component={SalesReportTopTabNavigator}
        options={{
          headerTitle: 'SALES',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      /> */}
    </AccountStack.Navigator>
  );
};
const TailorStack = createNativeStackNavigator();
export const TailorStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'ORDERS SCREEN' ||
      routeName === 'STORE PREMADE ORDERS' ||
      routeName === 'STORE PREMADE ORDERS DETAILS' ||
      routeName === 'STORE ORDERS' ||
      routeName === 'STORE REQUEST' ||
      routeName === 'STORE PENDING CUSTOM ORDER DETAIL' ||
      routeName === 'STORE ACCEPTED CUSTOM ORDER DETAIL' ||
      routeName === 'STORE ONGOING CUSTOM ORDER DETAIL' ||
      routeName === 'STORE PICKUP CUSTOM ORDER DETAIL' ||
      routeName === 'STORE COLLECTED CUSTOM ORDER DETAIL' ||
      routeName === 'STORE CANCELLED CUSTOM ORDER DETAIL' ||
      routeName === 'SALES REPORT' ||
      routeName === 'WALK IN CUSTOMER' ||
      routeName === 'CUSTOMER DETAIL' ||
      routeName === 'ADD WALKIN ORDER' ||
      routeName === 'SELECT CUSTOMER CATEGORY' ||
      routeName === 'ADD CUSTOMER' ||
      routeName === 'EDIT CUSTOMER' ||
      routeName === 'MY PRODUCT' ||
      routeName === 'ADD PRODUCT' ||
      routeName === 'EDIT PRODUCT' ||
      routeName === 'SELECT CATEGORY' ||
      routeName === 'Customize Category' ||
      routeName === 'CUSTOMIZE CATEGORY' ||
      routeName === 'ADD CUSTOMIZE CATEGORY' ||
      routeName === 'EDIT CUSTOMIZE CATEGORY' ||
      routeName === 'CUSTOMIZE CATEGORY DETAIL'
    ) {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);
  return (
    <TailorStack.Navigator>
      <TailorStack.Screen
        name="MY STORE"
        component={MyStoreScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'MY STORE',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="ORDERS SCREEN"
        component={OrderScreen}
        options={{
          headerTitle: 'ORDERS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE PREMADE ORDERS"
        component={StoreOrderStatusTopTabNavigator}
        options={{
          headerTitle: 'PREMADE ORDERS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE PREMADE ORDERS DETAILS"
        component={StoreOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAILS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE REQUEST"
        component={StoreRequestTopTabNavigator}
        options={{
          headerTitle: 'CUSTOM ORDERS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE PENDING CUSTOM ORDER DETAIL"
        component={PendingCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE ACCEPTED CUSTOM ORDER DETAIL"
        component={AcceptedToPayOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE ONGOING CUSTOM ORDER DETAIL"
        component={OngoingCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE PICKUP CUSTOM ORDER DETAIL"
        component={ToPickupCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE COLLECTED CUSTOM ORDER DETAIL"
        component={CollectedCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      <TailorStack.Screen
        name="STORE CANCELLED CUSTOM ORDER DETAIL"
        component={CancelledCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      <TailorStack.Screen
        name="MY PRODUCT"
        component={ProductStatusTopTabNavigator}
        options={{
          headerTitle: 'MY PRODUCTS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="ADD PRODUCT"
        component={AddProductScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="EDIT PRODUCT"
        component={EditProductScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="SELECT CATEGORY"
        component={SelectCategoryScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'SELECT CATEGORY',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="WALK IN CUSTOMER"
        component={WalkInCustomerScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="CUSTOMER DETAIL"
        component={CustomerDetailScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="ADD WALKIN ORDER"
        component={WalkinAddNewOrderScreen}
        options={{
          headerTitle: 'ADD NEW ORDER',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="SELECT CUSTOMER CATEGORY"
        component={SelectCustomerCategoryScreen}
        options={{
          headerTitle: 'SELECT CATEGORY',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="ADD CUSTOMER"
        component={AddWalkinCustomerScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="EDIT CUSTOMER"
        component={EditWalkinCustomerScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="SALES REPORT"
        component={SalesReportTopTabNavigator}
        options={{
          headerTitle: 'SALES',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="CUSTOMIZE CATEGORY"
        component={CustomizeCategoryScreen}
        options={{
          headerTitle: 'CATEGORIES',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="ADD CUSTOMIZE CATEGORY"
        component={AddCustomizeCategoryScreen}
        options={{
          headerTitle: 'ADD CATEGORY',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="EDIT CUSTOMIZE CATEGORY"
        component={EditCustomizeCategoryScreen}
        options={{
          headerTitle: 'EDIT CATEGORY',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="CUSTOMIZE CATEGORY DETAIL"
        component={CustomizeCategoryDetailScreen}
        options={{
          headerTitle: 'CATEGORY DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </TailorStack.Navigator>
  );
};
const TailorChatStack = createNativeStackNavigator();
export const TailorChatStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'TAILOR CHATROOM') {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);
  return (
    <TailorChatStack.Navigator initialRouteName="TAILOR CHAT">
      <TailorChatStack.Screen
        name="TAILOR CHAT"
        component={TailorChatScreen}
        options={{
          headerTitle: 'CHAT',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorChatStack.Screen
        name="TAILOR CHATROOM"
        component={TailorChatRoomScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        })}
      />
    </TailorChatStack.Navigator>
  );
};
const TailorNotifiationStack = createNativeStackNavigator();
export const TailorNotificationStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'STORE PREMADE ORDERS' ||
      routeName === 'STORE PREMADE ORDERS DETAILS' ||
      routeName === 'STORE REQUEST' ||
      routeName === 'STORE REQUEST' ||
      routeName === 'STORE PENDING CUSTOM ORDER DETAIL' ||
      routeName === 'STORE ACCEPTED CUSTOM ORDER DETAIL' ||
      routeName === 'STORE ONGOING CUSTOM ORDER DETAIL' ||
      routeName === 'STORE PICKUP CUSTOM ORDER DETAIL' ||
      routeName === 'STORE COLLECTED CUSTOM ORDER DETAIL' ||
      routeName === 'STORE CANCELLED CUSTOM ORDER DETAIL'
    ) {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);
  return (
    <TailorNotifiationStack.Navigator>
      <TailorNotifiationStack.Screen
        name="TAILOR NOTIFICATION"
        component={TailorNotification}
        options={{
          headerTintColor: 'black',
          headerTitle: 'NOTIFICATIONS',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE PREMADE ORDERS"
        component={StoreOrderStatusTopTabNavigator}
        options={{
          headerTitle: 'PREMADE ORDERS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE PREMADE ORDERS DETAILS"
        component={StoreOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAILS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE REQUEST"
        component={StoreRequestTopTabNavigator}
        options={{
          headerTitle: 'CUSTOM ORDERS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE PENDING CUSTOM ORDER DETAIL"
        component={PendingCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE ACCEPTED CUSTOM ORDER DETAIL"
        component={CustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE ONGOING CUSTOM ORDER DETAIL"
        component={OngoingCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE PICKUP CUSTOM ORDER DETAIL"
        component={ToPickupCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorStack.Screen
        name="STORE COLLECTED CUSTOM ORDER DETAIL"
        component={CollectedCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />

      <TailorStack.Screen
        name="STORE CANCELLED CUSTOM ORDER DETAIL"
        component={CancelledCustomOrderDetailScreen}
        options={{
          headerTitle: 'ORDER DETAIL',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </TailorNotifiationStack.Navigator>
  );
};
const TailorSettingsStack = createNativeStackNavigator();
export const TailorSettingsStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'STORE EDIT' ||
      routeName === 'CHANGE STORE NAME' ||
      routeName === 'CHANGE OWNER NAME' ||
      routeName === 'CHANGENUMBER' ||
      routeName === 'EMAILLOGINVERIFICATION' ||
      routeName === 'CHANGEEMAIL' ||
      routeName === 'APPLICATION OVERVIEW' ||
      routeName === 'APPLICATION FORM' ||
      routeName === 'APPLICATION HISTORY'
    ) {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);
  return (
    <TailorSettingsStack.Navigator initialRouteName="STORE SETTINGS">
      <TailorSettingsStack.Screen
        name="STORE SETTINGS"
        component={StoreSettingScreen}
        options={{
          headerTitle: 'SETTINGS',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorSettingsStack.Screen
        name="STORE EDIT"
        component={EditStoreScreen}
        options={{
          headerTitle: 'EDIT STORE',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorSettingsStack.Screen
        name="CHANGE STORE NAME"
        component={ChangeStoreNameScreen}
        options={{
          headerTitle: 'EDIT STORE NAME',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorSettingsStack.Screen
        name="CHANGE OWNER NAME"
        component={ChangeOwnerNameScreen}
        options={{
          headerTitle: 'EDIT OWNER NAME',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGENUMBER"
        component={ChangeNumberScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Phone Number',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="EMAILLOGINVERIFICATION"
        component={EmailLoginVerificationScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Verification',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGEEMAIL"
        component={ChangeEmailScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Change Email',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorSettingsStack.Screen
        name="APPLICATION OVERVIEW"
        component={ApplicationOverviewScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'STORE STATUS',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorSettingsStack.Screen
        name="APPLICATION FORM"
        component={ApplicationFormScreen}
        options={{
          headerTintColor: 'black',
          headerTitle: 'VERIFICATION FORM',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <TailorSettingsStack.Screen
        name="APPLICATION HISTORY"
        component={ApplicationHistoryScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </TailorSettingsStack.Navigator>
  );
};
const AdminStack = createNativeStackNavigator();
export const AdminStackNavigator = () => {
  return (
    <AdminStack.Navigator initialRouteName="ADMIN">
      <AdminStack.Screen
        name="ADMIN"
        component={AdminMainScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ADMIN SETTINGS');
              }}>
              <View>
                <Ionicons
                  name={'md-settings-outline'}
                  size={24}
                  color="black"
                />
              </View>
            </TouchableOpacity>
          ),
        })}
      />

      <AdminStack.Screen
        name="STORE VERIFICATION"
        component={StoreVerificationScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AdminStack.Screen
        name="APPROVED STORE SCREEN"
        component={ApprovedScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: 'Approved stores',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AdminStack.Screen
        name="VERIFICATION DETAIL"
        component={VerificationFormDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AdminStack.Screen
        name="APPROVED STORE DETAIL"
        component={ApprovedDetailScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AdminStack.Screen
        name="ADMIN SETTINGS"
        component={AdminSettingsScreen}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
    </AdminStack.Navigator>
  );
};

const MainLoginBottomTab = createBottomTabNavigator();
export const MainLoginNavigator = () => {
  const userToken = useSelector(state => state.auth.token);
  return (
    <MainLoginBottomTab.Navigator
      initialRouteName="HOMEBOTTOM"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
      }}>
      <MainLoginBottomTab.Screen
        name="HOMEBOTTOM"
        component={HomeStackNavigator}
        options={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerShown: false,
          tabBarLabel: 'HOME',

          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused ? 'md-home' : 'md-home-outline';
            return <Ionicons name={iconName} size={24} color="black" />;
          },
        }}
      />
      <MainLoginBottomTab.Screen
        name="CHATBOTTOM"
        component={LoginStackNavigator}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerTitle: 'LOG IN',
          /*          headerLeft: () => (
            <TouchableOpacity
              style={{marginLeft: 15}}
              onPress={() => {
                navigation.navigate('HOMEBOTTOM');
              }}>
              <View>
                <Ionicons name={'arrow-back'} size={24} color="black" />
              </View>
            </TouchableOpacity>
          ),
         */ tabBarStyle: {
            display: 'none',
          },
          headerShown: false,
          tabBarLabel: 'CHAT',
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused
              ? 'chatbox-ellipses'
              : 'chatbox-ellipses-outline';
            return <Ionicons name={iconName} size={24} color="black" />;
          },
        })}
        /*    listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            <View></View>;
            if (!!userToken) {
              navigation.navigate('CHATBOTTOM');
            } else {
              navigation.navigate('CHATBOTTOM', {
                screen: 'LOG IN',
              });
            }
                     Alert.alert(
                'Log In Required',
                'Please Log In First',
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: true},
              );  
         
          },
        })} */
      />
      <MainLoginBottomTab.Screen
        name="NOTIFICATIONBOTTOM"
        component={LoginStackNavigator}
        options={{
          headerTintColor: 'black',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          tabBarLabel: 'NOTIFICATION',
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused
              ? 'md-notifications'
              : 'md-notifications-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
          tabBarStyle: {
            display: 'none',
          },
        }}
        /*  listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            if (!!userToken) {
              navigation.navigate('NOTIFICATIONBOTTOM');
            } else {
              navigation.navigate('NOTIFICATIONBOTTOM', {
                screen: 'NOTIFICATIONLOGIN',
              });
            }
          },
        })} */
      />
      <MainLoginBottomTab.Screen
        name="BOTTOMLOGINACCOUNT"
        component={LoginStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'ACCOUNT',
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused ? 'md-person' : 'md-person-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
        }}
      />
    </MainLoginBottomTab.Navigator>
  );
};
const MainUserBottomTab = createBottomTabNavigator();
export const MainUserNavigator = () => {
  const activeNotification = useSelector(
    state => state.notification.activeNotification,
  );
  const numberOfActiveNotification = activeNotification.length;

  return (
    <MainUserBottomTab.Navigator
      initialRouteName="HOMEBOTTOM"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
      }}>
      <MainUserBottomTab.Screen
        name="HOMEBOTTOM"
        component={HomeStackNavigator}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerShown: false,
          tabBarLabel: 'HOME',
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused ? 'md-home' : 'md-home-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
        }}
      />
      <MainUserBottomTab.Screen
        name="CHATSTACK"
        component={ChatStackNavigation}
        options={{
          headerTintColor: 'black',

          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          tabBarLabel: 'CHAT',
          headerShown: false,
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused
              ? 'chatbox-ellipses'
              : 'chatbox-ellipses-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
        }}
        /*    listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            if (!!userToken) {
              navigation.navigate('CHAT');
            } else {
              navigation.navigate('LOG IN');
            }
          },
        })} */
      />

      <MainUserBottomTab.Screen
        name="NOTIFICATION BOTTOM"
        component={NotificationStackNavigator}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF ',
          },
          tabBarBadge:
            numberOfActiveNotification != 0
              ? numberOfActiveNotification
              : undefined,
          headerTitle: 'NOTIFICATIONS',
          tabBarLabel: 'NOTIFICATIONS',
          headerShown: false,
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused
              ? 'md-notifications'
              : 'md-notifications-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
        }}
        /*       listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            if (!!userToken) {
              navigation.navigate('NOTIFICATION');
            } else {
              navigation.navigate('LOG IN');
            }
          },
        })} */
      />
      <MainUserBottomTab.Screen
        name="BOTTOMACCOUNT"
        component={AccountStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'ACCOUNT',
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused ? 'md-person' : 'md-person-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
        }}
      />
    </MainUserBottomTab.Navigator>
  );
};
const MainTailorBottomTab = createBottomTabNavigator();
export const MainTailorNavigator = () => {
  const activeNotification = useSelector(
    state => state.notification.activeTailorNotification,
  );
  const numberOfActiveNotification = activeNotification.length;

  return (
    <MainTailorBottomTab.Navigator initialRouteName="STORE HOME">
      <MainTailorBottomTab.Screen
        name="STORE HOME"
        component={TailorStackNavigator}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          tabBarLabel: 'My Store',
          headerShown: false,
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused ? 'store' : 'store-outline';
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={24}
                color="#000000"
              />
            );
          },
        }}
      />
      <MainTailorBottomTab.Screen
        name="Tailor Chat"
        component={TailorChatStackNavigator}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          tabBarLabel: 'Chat',
          headerShown: false,
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused
              ? 'chatbox-ellipses'
              : 'chatbox-ellipses-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
        }}
      />
      <MainTailorBottomTab.Screen
        name="TAILOR NOTIFICATION BOTTOM"
        component={TailorNotificationStackNavigator}
        options={{
          headerTintColor: 'black',
          headerTitle: 'NOTIFICATIONS',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerShown: false,
          tabBarLabel: 'Notifications',
          tabBarBadge:
            numberOfActiveNotification != 0
              ? numberOfActiveNotification
              : undefined,
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused
              ? 'md-notifications'
              : 'md-notifications-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
        }}
      />
      <MainTailorBottomTab.Screen
        name="TAILOR SETTINGS"
        component={TailorSettingsStackNavigator}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Settings',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          tabBarLabel: 'Settings',
          headerShown: false,
          tabBarIcon: ({focused}) => {
            let iconName;
            iconName = focused ? 'md-settings' : 'md-settings-outline';
            return <Ionicons name={iconName} size={24} color="#000000" />;
          },
        }}
      />
    </MainTailorBottomTab.Navigator>
  );
};

const PurchaseStatusTopTab = createMaterialTopTabNavigator();
export const PurchaseStatusTopTabNavigator = () => {
  const topickupPremadeOrder = useSelector(
    state => state.order.userToPickupItems,
  );
  const collectedPremadeOrder = useSelector(
    state => state.order.userCollectedItems,
  );
  const refundedPremadeOrder = useSelector(
    state => state.order.userRefundedItems,
  );

  const userTopickupLength = topickupPremadeOrder.filter(
    item => !item.isUserSeen,
  ).length;

  const userCollectedLength = collectedPremadeOrder.filter(
    item => !item.isUserSeen,
  ).length;

  const userRefundedLength = refundedPremadeOrder.filter(
    item => !item.isUserSeen,
  ).length;

  return (
    <PurchaseStatusTopTab.Navigator
      initialRouteName="TOPICKUP"
      screenOptions={{
        swipeEnabled: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
        tabBarScrollEnabled: true,
      }}>
      <PurchaseStatusTopTab.Screen
        name="TOPICKUP"
        component={ToPickupScreen}
        options={{
          tabBarBadge: () => {
            return (
              userTopickupLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{userTopickupLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <PurchaseStatusTopTab.Screen
        name="COLLECTED"
        component={CollectedScreen}
        options={{
          tabBarBadge: () => {
            return (
              userCollectedLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{userCollectedLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <PurchaseStatusTopTab.Screen
        name="REFUNDED"
        component={RefundedScreen}
        options={{
          tabBarBadge: () => {
            return (
              userRefundedLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{userRefundedLength}</Text>
                </View>
              )
            );
          },
        }}
      />
    </PurchaseStatusTopTab.Navigator>
  );
};
const UserCustomOrderTopTab = createMaterialTopTabNavigator();
export const UserCustomOrderTopTabNavigator = () => {
  const pendingOrderRequest = useSelector(
    state => state.order.userPendingRequest,
  );
  const acceptedOrderRequest = useSelector(
    state => state.order.userAcceptedRequest,
  );
  const ongoingOrderRequest = useSelector(
    state => state.order.userOngoingRequest,
  );
  const pickupOrderRequest = useSelector(
    state => state.order.userPickupRequest,
  );
  const collectedOrderRequest = useSelector(
    state => state.order.userCollectedRequest,
  );
  const cancelledOrderRequest = useSelector(
    state => state.order.userCancelledRequest,
  );

  const userPendingLength = pendingOrderRequest.filter(
    item => !item.isUserSeen,
  ).length;

  const userAcceptedLength = acceptedOrderRequest.filter(
    item => !item.isUserSeen,
  ).length;
  const userAcceptedStatusLength = acceptedOrderRequest.filter(
    item => item.status == 'accepted/topay',
  ).length;

  const userOngoingLength = ongoingOrderRequest.filter(
    item => !item.isUserSeen,
  ).length;
  const userOngoingStatusLength = ongoingOrderRequest.filter(
    item => item.status == 'ongoing/topay',
  ).length;
  const userPickupLength = pickupOrderRequest.length;

  const userCollectedLength = collectedOrderRequest.filter(
    item => !item.isUserSeen,
  ).length;
  const userCancelledLength = cancelledOrderRequest.filter(
    item => !item.isUserSeen,
  ).length;

  return (
    <UserCustomOrderTopTab.Navigator
      initialRouteName="Pending User Custom Order"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
        tabBarScrollEnabled: true,
      }}>
      <UserCustomOrderTopTab.Screen
        name="Pending User Custom Order"
        component={UserPendingCustomOrderScreen}
        options={{
          tabBarLabel: 'PENDING',
          tabBarBadge: () => {
            return (
              userPendingLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{userPendingLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <UserCustomOrderTopTab.Screen
        name="Accepted User Custom Order"
        component={UserAcceptedCustomOrderScreen}
        options={{
          tabBarLabel: 'Accepted/To Pay',
          tabBarBadge: () => {
            return (
              (userAcceptedLength !== 0 || userAcceptedStatusLength !== 0) && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>
                    {userAcceptedStatusLength}
                  </Text>
                </View>
              )
            );
          },
        }}
      />
      <UserCustomOrderTopTab.Screen
        name="Ongoing User Custom Order"
        component={UserOngoingCustomOrderScreen}
        options={{
          tabBarLabel: 'Ongoing',
          tabBarBadge: () => {
            return (
              userOngoingLength != 0 ||
              (userOngoingStatusLength !== 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>
                    {userOngoingStatusLength}
                  </Text>
                </View>
              ))
            );
          },
        }}
      />
      <UserCustomOrderTopTab.Screen
        name="Pickup User Custom Order"
        component={UserToPickupCustomOrderScreen}
        options={{
          tabBarLabel: 'To pickup',
          tabBarBadge: () => {
            return (
              userPickupLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{userPickupLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <UserCustomOrderTopTab.Screen
        name="Collected User Custom Order"
        component={UserCollectedCustomOrderScreen}
        options={{
          tabBarLabel: 'Collected',
          tabBarBadge: () => {
            return (
              userCollectedLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{userCollectedLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <UserCustomOrderTopTab.Screen
        name="Cancelled User Custom Order"
        component={UserCancelledCustomOrderScreen}
        options={{
          tabBarLabel: 'Cancelled',
          tabBarBadge: () => {
            return (
              userCancelledLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{userCancelledLength}</Text>
                </View>
              )
            );
          },
        }}
      />
    </UserCustomOrderTopTab.Navigator>
  );
};
const StoreOrderStatusTopTab = createMaterialTopTabNavigator();
export const StoreOrderStatusTopTabNavigator = () => {
  const topickupStorePremadeOrder = useSelector(
    state => state.order.storeToPickupItems,
  );
  const storeTopickupLength = topickupStorePremadeOrder.filter(
    item => !item.isStoreSeen,
  ).length;

  const collectedStorePremadeOrder = useSelector(
    state => state.order.storeCollectedItems,
  );
  const storeCollectedLength = collectedStorePremadeOrder.filter(
    item => !item.isStoreSeen,
  ).length;

  const refundedStorePremadeOrder = useSelector(
    state => state.order.storeRefundedItems,
  );
  const storeRefundedLength = refundedStorePremadeOrder.filter(
    item => !item.isStoreSeen,
  ).length;
  return (
    <StoreOrderStatusTopTab.Navigator
      initialRouteName="STORETOPICKUP"
      screenOptions={{
        swipeEnabled: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
        tabBarScrollEnabled: true,
      }}>
      <StoreOrderStatusTopTab.Screen
        name="STORETOPICKUP"
        component={StoreToPickupScreen}
        options={{
          tabBarLabel: 'To Pickup',
          tabBarBadge: () => {
            return (
              storeTopickupLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storeTopickupLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <StoreOrderStatusTopTab.Screen
        name="STORECOLLECTED"
        component={StoreCollectedOrdersScreen}
        options={{
          tabBarLabel: 'COLLECTED',
          tabBarBadge: () => {
            return (
              storeCollectedLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storeCollectedLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <StoreOrderStatusTopTab.Screen
        name="STOREREFUNDED"
        component={StoreRefundedOrdersScreen}
        options={{
          tabBarLabel: 'REFUNDED',
          tabBarBadge: () => {
            return (
              storeRefundedLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storeRefundedLength}</Text>
                </View>
              )
            );
          },
        }}
      />
    </StoreOrderStatusTopTab.Navigator>
  );
};
const StoreRequestTopTab = createMaterialTopTabNavigator();
export const StoreRequestTopTabNavigator = () => {
  const pendingStoreOrderRequest = useSelector(
    state => state.order.storePendingRequest,
  );
  const acceptedStoreOrderRequest = useSelector(
    state => state.order.storeAcceptedRequest,
  );
  const ongoingStoreOrderRequest = useSelector(
    state => state.order.storeOngoingRequest,
  );
  const topickupStoreOrderRequest = useSelector(
    state => state.order.storeToPickupRequest,
  );
  const collectedStoreOrderRequest = useSelector(
    state => state.order.storeCollectedRequest,
  );
  const cancelledStoreOrderRequest = useSelector(
    state => state.order.storeCancelledRequest,
  );
  const storePendingLength = pendingStoreOrderRequest.filter(
    item => !item.isStoreSeen,
  ).length;
  const storeAcceptedLength = acceptedStoreOrderRequest.filter(
    item => !item.isStoreSeen,
  ).length;
  const storeOngoingLength = ongoingStoreOrderRequest.filter(
    item => item,
  ).length;
  const storeToPickupLength = topickupStoreOrderRequest.filter(
    item => item,
  ).length;
  const storeCollectedLength = collectedStoreOrderRequest.filter(
    item => !item.isStoreSeen,
  ).length;
  const storeCancelledLength = cancelledStoreOrderRequest.filter(
    item => !item.isStoreSeen,
  ).length;
  return (
    <StoreRequestTopTab.Navigator
      initialRouteName="Pending Custom Order"
      screenOptions={{
        swipeEnabled: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
        tabBarScrollEnabled: true,
      }}>
      <StoreRequestTopTab.Screen
        name="Pending Custom Order"
        component={PendingCustomOrderScreen}
        options={{
          tabBarLabel: 'PENDING',
          tabBarBadge: () => {
            return (
              storePendingLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storePendingLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <StoreRequestTopTab.Screen
        name="Accepted Custom Order"
        component={AcceptedToPayOrderScreen}
        options={{
          tabBarLabel: 'Accepted/To Pay',
          tabBarBadge: () => {
            return (
              storeAcceptedLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storeAcceptedLength}</Text>
                </View>
              )
            );
          },
        }}
      />

      <StoreRequestTopTab.Screen
        name="Ongoing Custom Order"
        component={OngoingCustomOrderScreen}
        options={{
          tabBarLabel: 'ongoing',
          tabBarBadge: () => {
            return (
              storeOngoingLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storeOngoingLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <StoreRequestTopTab.Screen
        name="Pickup Custom Order"
        component={ToPickupCustomOrderScreen}
        options={{
          tabBarLabel: 'To Pickup',
          tabBarBadge: () => {
            return (
              storeToPickupLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storeToPickupLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <StoreRequestTopTab.Screen
        name="Collected Custom Order"
        component={CollectedCustomOrderScreen}
        options={{
          tabBarLabel: 'Collected',
          tabBarBadge: () => {
            return (
              storeCollectedLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storeCollectedLength}</Text>
                </View>
              )
            );
          },
        }}
      />
      <StoreRequestTopTab.Screen
        name="Cancelled Custom Order"
        component={CancelledCustomOrderScreen}
        options={{
          tabBarLabel: 'Cancelled',
          tabBarBadge: () => {
            return (
              storeCancelledLength != 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    padding: 1,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: 'white'}}>{storeCancelledLength}</Text>
                </View>
              )
            );
          },
        }}
      />
    </StoreRequestTopTab.Navigator>
  );
};
/* const ApplicationStatusTopTab = createMaterialTopTabNavigator();
export const ApplicationStatusTopTabNavigator = () => {
  return (
    <ApplicationStatusTopTab.Navigator
      initialRouteName="APPLICATIONS"
      screenOptions={{
        swipeEnabled: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
        tabBarScrollEnabled: true,
      }}>
      <ApplicationStatusTopTab.Screen
        name="VERIFICATION FORMS"
        component={VerificationFormsScreen}
      />
      <ApplicationStatusTopTab.Screen
        name="APPROVED"
        component={ApprovedScreen}
      />
    </ApplicationStatusTopTab.Navigator>
  );
}; */
const ProductStatusTopTab = createMaterialTopTabNavigator();
export const ProductStatusTopTabNavigator = () => {
  return (
    <ProductStatusTopTab.Navigator
      initialRouteName="LIVE"
      screenOptions={{
        swipeEnabled: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
        tabBarScrollEnabled: true,
      }}>
      <ProductStatusTopTab.Screen name="LIVE" component={LiveProductScreen} />
      <ProductStatusTopTab.Screen
        name="DELISTED"
        component={DelistedProductScreen}
      />
    </ProductStatusTopTab.Navigator>
  );
};
const SalesReportTopTab = createMaterialTopTabNavigator();
export const SalesReportTopTabNavigator = () => {
  return (
    <SalesReportTopTab.Navigator
      initialRouteName="DAILY SALES"
      screenOptions={{
        swipeEnabled: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarHideOnKeyboard: true,
        tabBarScrollEnabled: true,
      }}>
      <SalesReportTopTab.Screen
        name="DAILY SALES"
        component={DailySalesScreen}
      />
      <SalesReportTopTab.Screen
        name="MONTHLY SALES"
        component={MonthlySalesScreen}
      />
      <SalesReportTopTab.Screen
        name="YEARLY SALES"
        component={YearlySalesScreen}
      />
    </SalesReportTopTab.Navigator>
  );
};
const MyRatingTopTab = createMaterialTopTabNavigator();
export const MyRatingTopTabNavigator = () => {
  return (
    <MyRatingTopTab.Navigator>
      <MyRatingTopTab.Screen
        name="TORATE"
        options={{tabBarLabel: 'TO RATE'}}
        component={ToRateScreen}
      />
      <MyRatingTopTab.Screen
        name="MY REVIEWS"
        options={{tabBarLabel: 'MY REVIEWS'}}
        component={RatingScreen}
      />
    </MyRatingTopTab.Navigator>
  );
};
const RegistrationTopTab = createMaterialTopTabNavigator();
/* export const RegistrationTopTabNavigator = () => {
  return (
    <RegistrationTopTab.Navigator
      initialRouteName="USER REGISTRATION"
      screenOptions={{
        swipeEnabled: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}>
      <RegistrationTopTab.Screen
        name="USER REGISTRATION"
        options={{tabBarLabel: 'USER REGISTRATION'}}
        component={SignupScreen}
      />
      <RegistrationTopTab.Screen
        name="TAILOR REGISTRATION"
        options={{tabBarLabel: 'TAILOR REGISTRATION'}}
        component={TailorRegistrationScreen}
      />
    </RegistrationTopTab.Navigator>
  );
}; */

/* const AccountLoginStack = createNativeStackNavigator();
export const AccountLoginStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'MY ORDERS' || routeName === 'ACCOUNTSTACKLOGIN') {
      navigation.setOptions({
        tabBarStyle: {display: 'none', backgroundColor: '#FFFFFF'},
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex', backgroundColor: '#FFFFFF'},
      });
    }
  }, [navigation, route]);
  const userToken = useSelector(state => state.auth.token);
  return (
    <AccountLoginStack.Navigator initialRouteName="ACCOUNT">
      <AccountLoginStack.Screen
        name="ACCOUNT"
        component={MyAccountScreen}
        options={({navigation}) => ({
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ACCOUNTSTACKLOGIN');
              }}>
              <View>
                <Ionicons name={'log-in-outline'} size={24} color="black" />
              </View>
            </TouchableOpacity>
          ),
        })}
      />
      <AccountLoginStack.Screen
        name="MY ORDERS"
        component={PurchaseStatusTopTabNavigator}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountLoginStack.Screen
        name="SETTINGS"
        component={AccountSettingsScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountLoginStack.Screen
        name="APPLICATION OVERVIEW"
        component={ApplicationOverviewScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <AccountLoginStack.Screen
        name="ACCOUNTSTACKLOGIN"
        component={LoginStackNavigator}
        options={{
          headerTintColor: 'black',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#D9DDDC',
          },
        }}
      />

        <AccountStack.Screen
        name="ACCOUNT AND SECURITY"
        component={AccountAndSecurityScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#D9DDDC',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGE NUMBER"
        component={ChangeNumberScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#D9DDDC',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGE EMAIL"
        component={ChangeEmailScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#D9DDDC',
          },
        }}
      />
      <AccountStack.Screen
        name="CHANGE PASSWORD"
        component={ChangePasswordScreen}
        options={{
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#D9DDDC',
          },
        }}
      />
    </AccountLoginStack.Navigator>
  );
};
 */
