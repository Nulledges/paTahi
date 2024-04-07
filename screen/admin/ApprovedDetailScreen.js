import React, {useReducer, useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Keyboard,
  useWindowDimensions,
  View,
  Text,
  FlatList,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {encode} from 'base-64';
import {useDispatch, useSelector} from 'react-redux';
import * as storeActions from '../../store/actions/store';

import Card from '../../Components/UI/Card';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';

const ApprovedDetailScreen = props => {
  const storeInformation = props.route.params.approvedStore;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState();
  const [subscriptionStatus, setSubscriptionStatus] = useState();

  console.log(storeInformation);
  useEffect(() => {
    try {
      const getData = async () => {
        if (storeInformation.subscriptionId != '') {
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
            `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${storeInformation.subscriptionId}`,
            {
              headers: {
                Authorization: `Bearer ` + accessToken,
                'Content-Type': 'application/json',
              },
            },
          );

          const dateObject = new Date(
            getDetails.data.billing_info.next_billing_time,
          );

          const options = {year: 'numeric', month: 'short', day: 'numeric'};
          const formattedDate = dateObject.toLocaleDateString('en-US', options);
          setExpiryDate(formattedDate);
          setSubscriptionStatus(getDetails.data.status);

          if (getDetails.data.status === 'APPROVAL_PENDING') {
            dispatch(
              storeActions.eraseStoreSubscriptionId(storeInformation.storeId),
            );
          }
          if (
            getDetails.data.status === 'ACTIVE' &&
            storeInformation.isSubscribed == false
          ) {
            dispatch(storeActions.updateIsSubscribe(storeInformation.storeId));
          }
        }
      };
      getData();
      console.log('hghh');
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: storeInformation.storeName.toUpperCase() + ' STATUS',
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
    });
  }, [storeInformation]);
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.cardContainer}>
        <Text style={styles.centeredText}>Store information</Text>
        <TwoLabelButton
          firstLabel="Store ID"
          secondLabel={storeInformation.storeId}
          onPress={() => {}}
        />
        <TwoLabelButton
          firstLabel="Store Name"
          secondLabel={storeInformation.storeName}
          onPress={() => {}}
        />
        <TwoLabelButton
          firstLabel={'Phone number'}
          secondLabel={storeInformation.phoneNumber}
          onPress={() => {}}
        />
      </Card>
      <Card style={styles.cardContainer}>
        <Text style={styles.centeredText}>Store Status</Text>
        <TwoLabelButton
          firstLabel="Store Status"
          secondLabel={storeInformation.status}
          onPress={() => {}}
        />
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
      </Card>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 2,
  },
  blackText: {
    color: 'black',
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
});
export default ApprovedDetailScreen;
