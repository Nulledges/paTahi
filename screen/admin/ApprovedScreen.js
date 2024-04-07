import React, {useReducer, useState, useCallback, useEffect} from 'react';

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
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import * as adminActions from '../../store/actions/admin';

import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';
import Card from '../../Components/UI/Card';
const ApprovedScreen = props => {
  const approvedStores = useSelector(state => state.admin.approvedStores);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    dispatch(adminActions.fetchAllApprovedStore);
  }, []);

  if (!isLoading && approvedStores.length === 0) {
    return (
      <View style={styles.Centered}>
        <Text style={styles.CenteredStyle}>No approved stores</Text>
      </View>
    );
  }
  const renderItem = ({item}) => (
    <Card style={styles.CardContainer}>
      <TwoLabelButton
        firstLabel={item.storeName}
        secondLabel={item.isSubscribed ? 'Subscribe >' : 'Not subscribe >'}
        onPress={() => {
          props.navigation.navigate('APPROVED STORE DETAIL', {
            approvedStore: item,
          });
        }}
      />
    </Card>
  );
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.FlatListStyle}
        data={approvedStores}
        keyExtractor={item => item.storeId}
        key={item => item.id}
        renderItem={renderItem}
      />
      {/* 
      <WebView
        source={{
          uri: 'https://www.sandbox.paypal.com/webapps/billing/subscriptions?ba_token=BA-8LC43800FM7955843',
        }}
        scrollEnabled={false}
      /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 5,
    backgroundColor: '#E8E8E8',
  },
  FlatListStyle: {
    width: '100%',
  },
  CardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 2,
  },
  Centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CenteredStyle: {
    color: 'black',
  },
});
export default ApprovedScreen;

/*  const getAuthenticationToken = async () => {
    try {
    
    

      

      const subscriptionsResponse = await axios.post(
        'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
        {
          plan_id: 'P-4A0945780D780941MMXMU2NY',
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
      const responseSub = subscriptionsResponse.data;
      console.log('response:', responseSub);
    } catch (error) {
      console.log('error' + error);
    }
  }; */
