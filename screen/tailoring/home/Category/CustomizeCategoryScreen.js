import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Image, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from '@reduxjs/toolkit';
import Feather from 'react-native-vector-icons/Feather';

import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import Card from '../../../../Components/UI/Card';
import TwoLabelButton from '../../../../Components/UI/CustomButton/TwoLabelButton';
import * as categoryActions from '../../../../store/actions/category';
const CustomizeCategoryScreen = props => {
  const myStore = useSelector(state => state.store.myStore);
  const categoryList = useSelector(state => state.category.categoryList);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const unsubcribe = dispatch(
        categoryActions.fetchCategory(myStore.storeId),
      );
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
            props.navigation.navigate('CUSTOMIZE CATEGORY DETAIL', {
              categoryId: item.id,
              storeId: myStore.storeId,
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
      />
      <MainButton
        style={styles.circularButton}
        label={<Feather name={'plus'} size={50} color="white" />}
        onPress={() => {
          props.navigation.navigate('ADD CUSTOMIZE CATEGORY', {
            storeId: myStore.storeId,
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
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
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
  textStyle: {
    color: 'black',
  },
});
export default CustomizeCategoryScreen;
