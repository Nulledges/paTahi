import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';

const SelectPaymentMethodScreen = props => {
  const paymentMethods = ['GCash e-Wallet', 'PayPal'];
  return (
    <View style={styles.container}>
      <Text style={styles.textPaddingStyle}>Payment Methods</Text>
      {paymentMethods.map((value, index) => {
        return (
          <View key={index} style={styles.paymentMethodContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('CHECKOUT', {
                  paymentMethod: value,
                  uniqueStoreId: props.route.params.uniqueStoreId,
                });
              }}>
              <View style={styles.paymentMethodItemContainer}>
                <Text style={styles.textStyle}>{value}</Text>
                <Text style={styles.textStyle}>{'>'}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        );
      })}
      {/*      <View style={styles.paymentMethodContainer}>
        <View style={styles.paymentMethodItemContainer}>
          <Text style={styles.textStyle}>{'GCash e-Wallet'}</Text>
          <Text style={styles.textStyle}>Select{' >'}</Text>
        </View>
      </View>
      <View style={styles.paymentMethodContainer}>
        <View style={styles.paymentMethodItemContainer}>
          <Text style={styles.textStyle}>{'PayPal'}</Text>
          <Text style={styles.textStyle}>Select{' >'}</Text>
        </View>
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },

  paymentMethodContainer: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 2.5,
    marginBottom: 10,
  },
  paymentMethodItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  textStyle: {
    color: 'black',
  },
  textPaddingStyle: {
    color: 'black',
    marginLeft: 10,
    padding: 10,
  },
});
export default SelectPaymentMethodScreen;
