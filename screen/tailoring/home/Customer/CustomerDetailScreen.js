import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Card from '../../../../Components/UI/Card';
import TwoLabelButton from '../../../../Components/UI/CustomButton/TwoLabelButton';
import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import * as customerActions from '../../../../store/actions/customer';

const CustomerDetailScreen = props => {
  const dispatch = useDispatch();
  const customerId = props.route.params?.customerId;
  const storeId = props.route.params.storeId;
  const specificCustomer = useSelector(
    state => state.customer.customerDetailInfo,
  );

  useEffect(() => {
    const unsubcribe = dispatch(
      customerActions.fetchSpecificCustomer(customerId),
    );
    return unsubcribe;
  }, []);
  useEffect(() => {
    //headerRight
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('EDIT CUSTOMER', {
              storeId: storeId,
              customerId: customerId,
              specificCustomer: specificCustomer,
            });
          }}>
          <View>
            <Feather name="edit" size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  });
  return (
    <View style={styles.container}>
      <ScrollView
        style={{width: '100%', height: '90%', marginBottom: '19%'}}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <Card style={styles.cardContainer}>
          <TwoLabelButton
            firstLabel="Name"
            secondLabel={specificCustomer.customerName}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Phone Number"
            secondLabel={specificCustomer.phoneNumber}
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
          style={styles.publishButton}
          label={'New Order'}
          onPress={() => {
            props.navigation.navigate('ADD WALKIN ORDER', {
              name: specificCustomer.customerName,
              phoneNumber: specificCustomer.phoneNumber,
              storeId: storeId,
            });
          }}
        />
      </ScrollView>
      {/*  <Card style={styles.cardContainer}>
        <Text
          style={{
            color: 'black',
            textTransform: 'uppercase',
            paddingHorizontal: 20,
            paddingVertical: 10,
            fontWeight: 'bold',
            borderBottomWidth: 1,
          }}>
          Measurements
        </Text>
        {specificCustomer.measurement == undefined
          ? ''
          : Object.keys(specificCustomer.measurement).map(item => {
              return (
                <TwoLabelButton
                  key={item}
                  FirstTextStyle={{paddingLeft: 25}}
                  firstLabel={item}
                  secondTextStyle={{paddingRight: 25}}
                  secondLabel={specificCustomer.measurement[item] + ' inches'}
                />
              );
            })}
      </Card> */}
    </View>
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
  },
  buttonContainer: {
    width: '100%',
    height: '10%',
    bottom: 0,
    position: 'absolute',
  },
  publishButton: {
    width: '95%',
    margin: 5,
    borderRadius: 10,
  },
});
export default CustomerDetailScreen;
