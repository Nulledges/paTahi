import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import SecondButton from '../../../Components/UI/CustomButton/SecondButton';
import Card from '../../../Components/UI/Card';
import TwoLabelButton from '../../../Components/UI/CustomButton/TwoLabelButton';
import {encode} from 'base-64';
import WebView from 'react-native-webview';
import * as storeActions from '../../../store/actions/store';
const ApplicationOverviewScreen = props => {
  const dispatch = useDispatch();
  const myStoreInformation = useSelector(state => state.store.myStore);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [paymentLink, setPaymentLink] = useState();
  const [subscriptionId, setSubscriptionId] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [subscriptionStatus, setSubscriptionStatus] = useState();
  //paypal token

  /*   const handleWebViewMessage = event => {
    console.log('Received message from WebView:', event.nativeEvent.data);
  }; */
  useEffect(() => {
    try {
      const getData = async () => {
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
            dispatch(
              storeActions.eraseStoreSubscriptionId(myStoreInformation.storeId),
            );
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
            const dateObject = new Date(
              getDetails.data.billing_info.next_billing_time,
            );

            const options = {year: 'numeric', month: 'short', day: 'numeric'};
            const formattedDate = dateObject.toLocaleDateString(
              'en-US',
              options,
            );
            setExpiryDate(formattedDate);
            setSubscriptionStatus(getDetails.data.status);
          }
        }
      };
      getData();

    } catch (error) {
      console.log(error);
    }
  }, []);
  const getToken = async () => {
    try {
      if (myStoreInformation.subscriptionId == '') {
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
        const subscriptionsResponse = await axios.post(
          'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
          {
            plan_id: 'P-83C61781G8501634CMXMVN2I',
            application_context: {
              brand_name: 'patahi',
              locale: 'en-US',
              user_action: 'SUBSCRIBE_NOW',
              payment_method: {
                payer_selected: 'PAYPAL',
                payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ` + accessToken,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log(subscriptionsResponse.data);
        dispatch(
          storeActions.updateSubscriptionId(
            myStoreInformation.storeId,
            subscriptionsResponse.data.id,
          ),
        );
        setPaymentLink(subscriptionsResponse.data.links[0].href);
      }
    } catch (error) {
      console.log('Error Occur: ' + error);
    }
  };
  const getSubscriptionDetail = async () => {
    try {
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
      /*   const dateObject = new Date(
        getDetails.data.billing_info.next_billing_time,
      );

      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      const formattedDate = dateObject.toLocaleDateString('en-US', options);
      setExpiryDate(formattedDate);
      setSubscriptionStatus(getDetails.data.status); */
      if (
        getDetails.data.status === 'ACTIVE' &&
        myStoreInformation.isSubscribed == false
      ) {
        dispatch(storeActions.updateIsSubscribe(myStoreInformation.storeId));
      }

      if (getDetails.data.status === 'ACTIVE') {
        const dateObject = new Date(
          getDetails.data.billing_info.next_billing_time,
        );

        const options = {year: 'numeric', month: 'short', day: 'numeric'};
        const formattedDate = dateObject.toLocaleDateString('en-US', options);
        setExpiryDate(formattedDate);
        setSubscriptionStatus(getDetails.data.status);
      }
      console.log(myStoreInformation.subscriptionId);
      console.log(getDetails.data);
    } catch (error) {
      console.log('Error Occur ' + error);
    }
  };
  /*  console.log(myStoreInformation); */
  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <Text style={styles.centeredText}>Store Status</Text>
        <TwoLabelButton
          firstLabel="Store Status"
          secondLabel={myStoreInformation.status}
          onPress={() => {}}
        />
        <View
          style={{
            borderBottomWidth: 1,
            marginVertical: 5,
            width: '90%',
            alignSelf: 'center',
          }}
        />
        <View style={styles.buttonContainer}>
          <Card style={styles.cardContainer2}>
            <SecondButton
              customTextStyle={{alignSelf: 'center'}}
              label="Verification FORM"
              onPress={() => {
                if (myStoreInformation.status == 'pending') {
                  Alert.alert('Pending', 'Application is being reviewed.', [
                    {text: 'OK'},
                  ]);
                } else if (myStoreInformation.status == 'approved') {
                  Alert.alert('Approved', 'Application is approved', [
                    {text: 'OK'},
                  ]);
                } else {
                  props.navigation.navigate('APPLICATION FORM');
                }
              }}
            />
          </Card>
          <Card style={{...styles.cardContainer3}}>
            <SecondButton
              customTextStyle={{alignSelf: 'center'}}
              label="Verification History"
              onPress={() => {
                props.navigation.navigate('APPLICATION HISTORY', {
                  storeInfo: myStoreInformation,
                });
              }}
            />
          </Card>
        </View>
      </Card>
      <Card style={styles.cardContainer}>
        <Text style={styles.centeredText}>Subscription</Text>
        <TwoLabelButton
          firstLabel="Subsrciption Status"
          secondLabel={
            subscriptionStatus == 'ACTIVE' ? 'Subscribed' : 'Not Subscribed'
          }
          onPress={() => {}}
        />

        <TwoLabelButton
          firstLabel="Subscription Expiry"
          secondLabel={expiryDate == undefined ? 'N/A' : expiryDate}
          onPress={() => {}}
        />
        <View
          style={{
            borderBottomWidth: 1,
            marginVertical: 5,
            width: '90%',
            alignSelf: 'center',
          }}
        />
        <View style={styles.buttonContainer}>
          <Card
            style={{
              ...styles.cardContainer3,
              opacity:
                subscriptionStatus == 'ACTIVE' ||
                myStoreInformation.status == 'verification needed' ||
                myStoreInformation.status == 'pending' ||
                myStoreInformation.status == 'rejected'
                  ? 0.1
                  : 1,
            }}>
            <SecondButton
              customTextStyle={{alignSelf: 'center'}}
              label="Subscribe here"
              onPress={() => {
                if (
                  myStoreInformation.status == 'verification needed' ||
                  myStoreInformation.status == 'pending' ||
                  myStoreInformation.status == 'rejected'
                ) {
                } else {
                  getToken().then(() => {
                    if (subscriptionStatus != 'ACTIVE') {
                      setShowPaymentWebView(true);
                    }
                  });
                }
              }}
            />
          </Card>
          <Card
            style={{
              ...styles.cardContainer3,
              opacity: subscriptionStatus == 'ACTIVE' ? 1 : 0.1,
            }}>
            <SecondButton
              customTextStyle={{alignSelf: 'center'}}
              label="Cancel"
              onPress={() => {}}
            />
          </Card>
          {/*  <Card style={{...styles.cardContainer3}}>
            <SecondButton
              customTextStyle={{alignSelf: 'center'}}
              label="Show"
              onPress={() => {
                getSubscriptionDetail();
              }}
            />
          </Card> */}
        </View>
      </Card>
      <Modal
        animationType="slide"
        visible={showPaymentWebView}
        onRequestClose={!setShowPaymentWebView}>
        <TouchableOpacity
          onPress={() => {
            setShowPaymentWebView(false);
            getSubscriptionDetail();
          }}
          style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <WebView
          source={{uri: paymentLink != undefined ? paymentLink : ''}}
          cacheEnabled={false}
          javaScriptEnabled={true}
          /*  onMessage={handleWebViewMessage} */
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },

  outsideTextStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    marginLeft: '2%',
    color: 'black',
  },
  insideTextStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    alignSelf: 'center',
    color: 'black',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },

  centeredText: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
    margin: 5,
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 2,
  },
  cardContainer2: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
    width: '90%',
    marginVertical: 5,
  },
  cardContainer3: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
    width: '90%',
    marginTop: 5,
    marginBottom: 10,
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
    margin: 10,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ApplicationOverviewScreen;
