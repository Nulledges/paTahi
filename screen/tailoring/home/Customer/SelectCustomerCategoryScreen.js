import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SecondButton from '../../../../Components/UI/CustomButton/SecondButton';
import * as categoryActions from '../../../../store/actions/category';
const SelectCustomerCategoryScreen = props => {
  const dispatch = useDispatch();
  const myStore = useSelector(state => state.store.myStore);
  const categoryList = useSelector(state => state.category.categoryList);
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
  console.log(categoryList);
  return (
    <View>
      <Text style={{color: 'black', padding: 10, textTransform: 'uppercase'}}>
        All Categories
      </Text>
      {categoryList.length != 0 &&
        categoryList.map(value => {

          return (
            <SecondButton
              label={value.category}
              key={value.id}
              onPress={() => {
                props.navigation.navigate('ADD WALKIN ORDER', {
                  category: value.category,
                  measurement: value.measurement,
                  name: props.route.params.name,
                  phoneNumber: props.route.params.phoneNumber,
                  storeId: props.route.params.storeId,
                });
              }}
            />
          );
        })}
    </View>
  );
};

export default SelectCustomerCategoryScreen;
