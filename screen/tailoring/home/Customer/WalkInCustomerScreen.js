import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Card from '../../../../Components/UI/Card';
import TwoLabelButton from '../../../../Components/UI/CustomButton/TwoLabelButton';
import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import * as customerActions from '../../../../store/actions/customer';
const WalkInCustomerScreen = props => {
  const dispatch = useDispatch();
  const storeId = props.route.params.storeId;
  const customerInfo = useSelector(state => state.customer.customerList);

  useEffect(() => {
    try {
      const unsubcribe = dispatch(customerActions.fetchCustomers(storeId));
      return unsubcribe;
    } catch (error) {
      console.log('Error at MyMeasurementBookScreen: ' + error);
    }
  }, []);

  const renderItem = ({item}) => {
    return (
      <Card style={styles.cardContainer} key={item.measurementId}>
        <TwoLabelButton
          firstLabel={item.customerName}
          secondLabel={'>'}
          onPress={() => {
            props.navigation.navigate('CUSTOMER DETAIL', {
              customerId: item.id,
              storeId: storeId,
            });
          }}
        />
      </Card>
    );
  };
  /*  , {
    customerId: item.id,
  } */
  return (
    <View style={styles.container}>
      {customerInfo == '' && (
        <View style={styles.noItemContainer}>
          <Text style={styles.textStyle}>No Walk-in Customer</Text>
        </View>
      )}
      {customerInfo != '' && (
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
          }}
          data={customerInfo}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}

      <MainButton
        style={styles.circularButton}
        label={<Feather name={'plus'} size={50} color="white" />}
        onPress={() => {
          props.navigation.navigate('ADD CUSTOMER', {
            storeId: storeId,
          });
        }}
      />
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
  itemContainer: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 5,
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },

  noItemContainer: {
    flex: 1,
    width: '97%',
    maxHeight: 146,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'black',
  },
  circularButton: {
    alignSelf: 'flex-end',
    width: 75,
    height: 75,
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 2,
  },
});
export default WalkInCustomerScreen;
