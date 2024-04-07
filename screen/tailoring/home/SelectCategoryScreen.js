import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SecondButton from '../../../Components/UI/CustomButton/SecondButton';
import * as categoryActions from '../../../store/actions/category';
const SelectCategoryScreen = props => {
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

  return (
    <View>
      <Text style={{color: 'black', padding: 10, textTransform: 'uppercase'}}>
        All Categories
      </Text>
      {categoryList.length != 0 &&
        categoryList.map(value => {
          return (
            <SecondButton
              key={value.id}
              label={value.category}
              onPress={() => {
                if (props.route.params.edit == 'edit') {
                  props.navigation.navigate('EDIT PRODUCT', {
                    category: value.category,
                    productId: props.route.params.productId,
                    storeId: props.route.params.storeId,
                  });
                } else {
                  props.navigation.navigate('ADD PRODUCT', {
                    category: value.category,
                    productId: props.route.params.productId,
                    storeId: props.route.params.storeId,
                  });
                }
              }}
            />
          );
        })}
    </View>
  );
};

export default SelectCategoryScreen;
