import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import TwoColProductItem from '../../Components/Item/TwoColProductItem';
import * as productActions from '../../store/actions/product';
import * as storeActions from '../../store/actions/store';
import MainButton from '../../Components/UI/CustomButton/MainButton';

const HomeStoreDetailScreen = props => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.auth.token);
  const storeId = props.route.params?.storeId;
  const storeProducts = useSelector(state => state.products.storeProducts);

  const approvedStores = useSelector(state =>
    state.store.approvedSpecificStores.find(store => store.storeId === storeId),
  );

  useEffect(() => {
    try {
      dispatch(storeActions.fetchSpecificStore(storeId));
      dispatch(productActions.fetchStoreProduct(storeId));
    } catch (error) {
      console.log('Error on dsaddsad: ' + error);
    }
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: approvedStores == undefined ? '' : approvedStores.storeName,
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('MORE INFO', {
              latitude: +approvedStores.latitude,
              longitude: +approvedStores.longitude,
              storeName: approvedStores.storeName,
            });
          }}>
          <View>
            <Ionicons name="md-information-circle" size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [approvedStores]);

  const renderItem = ({item}) => (
    <TwoColProductItem
      title={item.productTitle}
      price={parseInt(item.productPrice).toFixed(2)}
      images={item.productPrimaryImage}
      onPress={() => {
        props.navigation.navigate('PRODUCT DETAIL', {
          productId: item.id,
          storeId: item.storeId,
        });
      }}
    />
  );
  return (
    <View style={styles.container}>
      <FlatList
        style={{marginBottom: '16%'}}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={storeProducts}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
        }}
        style={styles.buttonContainer}>
        <MainButton
          style={styles.storeButton}
          label={'Chat Now'}
          onPress={() => {}}
        />
        {!!userToken ? (
          <MainButton
            style={styles.storeButton}
            label="Custom Order"
            onPress={() => {
              props.navigation.navigate('SELECT CATEGORY CUSTOM', {
                storeId: storeId,
              });
            }}
          />
        ) : (
          <MainButton
            style={styles.storeButton}
            label="Custom Order"
            onPress={() => {
              props.navigation.navigate('HOMESTACKLOGIN', {
                storeId: storeId,
              });
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  itemContainer: {
    width: '100%',
  },
  storeButton: {
    width: '49%',
    margin: 1,
    bottom: 0,
  },
  buttonContainer: {
    width: '100%',
    height: '8%',
    backgroundColor: '#FFF ',
    bottom: 0,
    position: 'absolute',
  },
});

export default HomeStoreDetailScreen;
