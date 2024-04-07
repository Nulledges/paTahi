import React, {useEffect, useCallback, useState, useReducer} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import {v4 as uuid} from 'uuid';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../../Components/UI/Card';
import MainButton from '../../../Components/UI/CustomButton/MainButton';
import TwoLabelButton from '../../../Components/UI/CustomButton/TwoLabelButton';
import CustomInputWithLabel from '../../../Components/UI/Inputs/CustomInputWithLabel';

const UserPendingCustomOrderDetailScreen = props => {
  const orders = props.route.params.orderItems;
  console.log(orders.items[0].measurements);
  return (
    <View style={styles.container}>
      <ScrollView
        style={{width: '100%', height: '90%', marginBottom: '19%'}}
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: '2%',
          marginTop: '1.5%',
        }}>
        <Card style={styles.cardContainer}>
          <TwoLabelButton
            firstLabel="ORDER ID"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.id}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="ORDER STATUS"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.status}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Customer Detail
          </Text>
          <TwoLabelButton
            firstLabel="Customer name"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.username}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />

          <TwoLabelButton
            firstLabel="Phone Number"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.userPhone}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <Text
            style={{
              color: 'black',
              textTransform: 'uppercase',
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Customize Order Detail
          </Text>
          <TwoLabelButton
            firstLabel="Name"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.items[0].productTitle}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Category"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={orders.items[0].productCategory}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <TwoLabelButton
            firstLabel="Quantity"
            FirstTextStyle={{paddingLeft: 25}}
            secondLabel={`${orders.items[0].quantity}`}
            secondTextStyle={{paddingRight: 25}}
            onPress={() => {}}
          />
          <Text
            style={{
              color: 'black',
              textTransform: 'lowercase',
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: 'bold',
              borderBottomWidth: 1,
            }}>
            Measurements
          </Text>

          {Object.keys(orders.items[0].measurements).map(item => {
            return (
              <TwoLabelButton
                key={item}
                FirstTextStyle={{paddingLeft: 25}}
                firstLabel={item}
                secondTextStyle={{paddingRight: 25}}
                secondLabel={orders.items[0].measurements[item] + ' inches'}
              />
            );
          })}
        </Card>
      </ScrollView>
      {/*   <ScrollView
        style={styles.buttonContainer}
        contentContainerStyle={{
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexGrow: 1,
        }}>
        <MainButton
          label={'Cancel Order'}
          style={styles.buttonStyle}
          onPress={() => {}}
        />
    
      </ScrollView> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  buttonStyle: {
    width: '95%',
    margin: 5,
    borderRadius: 10,
  },
  cardContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    height: '10%',
    bottom: 0,
    position: 'absolute',
  },
  saveButton: {
    width: '95%',
    backgroundColor: 'black',
    margin: 5,
    borderRadius: 10,
  },
  textStyle: {
    color: 'black',
  },
});

export default UserPendingCustomOrderDetailScreen;
