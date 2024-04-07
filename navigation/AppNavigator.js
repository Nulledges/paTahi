import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  AdminStackNavigator,
  MainUserNavigator,
  MainLoginNavigator,
  MainTailorNavigator,
} from './navigation';
import {useSelector, useDispatch} from 'react-redux';

const AppNavigator = () => {
  const userToken = useSelector(state => !!state.auth.token);
  const userType = useSelector(state => state.auth.userType);
  const isTailor = useSelector(state => state.auth.isTailor);
  const dispatch = useDispatch();

  const navigation = () => {
    if (userToken) {
      if (userType == 'Admin') {
        return (
          <NavigationContainer>
            <AdminStackNavigator />
          </NavigationContainer>
        );
      } else if (userType == 'User') {
        if (isTailor == true) {
          return (
            <NavigationContainer>
              <MainTailorNavigator />
            </NavigationContainer>
          );
        } else {
          return (
            <NavigationContainer>
              <MainUserNavigator />
            </NavigationContainer>
          );
        }
      }
    } else {
      return (
        <NavigationContainer>
          {!userToken && <MainLoginNavigator />}
        </NavigationContainer>
      );
    }
  };

  return navigation();
};

export default AppNavigator;
