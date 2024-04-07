import React, {useReducer, useState, useCallback} from 'react';
import {
  StyleSheet,
  Keyboard,
  useWindowDimensions,
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';

import * as authActions from '../../store/actions/authentication';
import Card from '../../Components/UI/Card';
import SecondButton from '../../Components/UI/CustomButton/SecondButton';
const AdminSettingsScreen = () => {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(authActions.logout());
  };
  return (
    <View style={styles.AdminSettingsScreen}>
      <Card style={styles.cardContainer}>
        <SecondButton
          customTextStyle={styles.textStyle}
          label="LOGOUT"
          onPress={() => {
            logout();
          }}
        />
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  AdminSettingsScreen: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 2,
  },
  textStyle: {
    color: 'red',
  },
});

export default AdminSettingsScreen;
