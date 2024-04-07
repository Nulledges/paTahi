import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import SecondButton from '../../../Components/UI/CustomButton/SecondButton';
const UserPaymentTypeCategoryScreen = props => {
  const categories = ['full payment', 'down payment'];
  return (
    <View>
      <Text style={{color: 'black', padding: 10, textTransform: 'uppercase'}}>
        Payment type
      </Text>
      {categories.map((value, index) => {
        return (
          <SecondButton
            key={index}
            label={value}
            onPress={() => {
              props.navigation.navigate('USER ACCEPTED CUSTOM ORDERS DETAIL', {
                category: value,
                orderItems: props.route.params.orderItems,
              });
            }}
          />
        );
      })}
    </View>
  );
};

export default UserPaymentTypeCategoryScreen;
