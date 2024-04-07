import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from '@reduxjs/toolkit';
import Feather from 'react-native-vector-icons/Feather';

import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import TwoLabelButton from '../../../../Components/UI/CustomButton/TwoLabelButton';
import Card from '../../../../Components/UI/Card';
import * as categoryActions from '../../../../store/actions/category';
const CustomizeCategoryDetailScreen = props => {
  const categoryId = props.route.params?.categoryId;
  const storeId = props.route.params.storeId;
  const specificCategory = useSelector(
    state => state.category.categoryDetailInfo,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const unsubcribe = dispatch(
        categoryActions.fetchSpecificCategory(categoryId),
      );
      return unsubcribe;
    } catch (error) {
      console.log('Error at MyMeasurementBookScreen: ' + error);
    }
  }, []);
  useEffect(() => {
    //headerRight
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('EDIT CUSTOMIZE CATEGORY', {
              storeId: storeId,
              categoryId: categoryId,
              specificCategory: specificCategory,
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
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel="Category"
          secondLabel={specificCategory.category}
          onPress={() => {}}
        />
      </Card>
      <Card style={styles.cardContainer}>
        <Text
          style={{
            color: 'black',
            textTransform: 'uppercase',
            paddingHorizontal: 20,
            paddingVertical: 10,
            fontWeight: 'bold',
            borderBottomWidth: 1,
          }}>
          Measurements needed
        </Text>
        {specificCategory.length != 0 &&
          specificCategory.measurements.map((item, index) => {
            return (
              <TwoLabelButton
                key={index}
                FirstTextStyle={{paddingLeft: 25}}
                firstLabel={item}
              />
            );
          })}
      </Card>
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
export default CustomizeCategoryDetailScreen;
