import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import SecondButton from '../../../Components/UI/CustomButton/SecondButton';
import Card from '../../../Components/UI/Card';
import * as authActions from '../../../store/actions/authentication';

const StoreSettingScreen = props => {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(authActions.logout());
  };
  return (
    <View style={styles.container}>
      <View style={styles.AccountSettingsScreenContainer}>
        <Card style={styles.cardContainer}>
          <SecondButton
            label="STORE PROFILE"
            onPress={() => {
              props.navigation.navigate('STORE EDIT');
            }}
          />
        </Card>
        <Card style={styles.cardContainer}>
          <SecondButton
            onPress={() => {
              props.navigation.navigate('APPLICATION OVERVIEW');
            }}
            label="Store Status"
          />
        </Card>
        <Card style={styles.cardContainer}>
          <SecondButton
            customTextStyle={styles.AccountSettingsLogoutTextStyle}
            label="LOGOUT"
            onPress={logout}
          />
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  AccountSettingsScreenContainer: {
    width: '100%',
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  AccountSettingsLogoutTextStyle: {
    color: 'red',
  },
});

export default StoreSettingScreen;
