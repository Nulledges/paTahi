import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Image, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from '@reduxjs/toolkit';
import Feather from 'react-native-vector-icons/Feather';

import MainButton from '../../Components/UI/CustomButton/MainButton';
import Card from '../../Components/UI/Card';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';
import * as categoryActions from '../../store/actions/category';
const SelectCategoryCustomOrderScreen = props => {
  const storeId = props.route.params?.storeId;
  const categoryList = useSelector(state => state.category.categoryList);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const unsubcribe = dispatch(categoryActions.fetchCategory(storeId));
      return unsubcribe;
    } catch (error) {
      console.log('Error at MyMeasurementBookScreen: ' + error);
    }
  }, []);

  const renderItem = ({item}) => {
    return (
      <Card style={styles.cardContainer} key={item.id}>
        <TwoLabelButton
          firstLabel={item.category}
          secondLabel={'>'}
          onPress={() => {
            props.navigation.navigate('CUSTOM ORDER', {
              categoryId: item.id,
            });
          }}
        />
      </Card>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={categoryList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => {
          return (
            <Card
              style={{
                margin: 1,
                borderRadius: 10,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text
                style={{
                  ...styles.textStyle,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}>
               Category available for customization
              </Text>
            </Card>
          );
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
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },

  textStyle: {
    color: 'black',
  },
});
export default SelectCategoryCustomOrderScreen;
