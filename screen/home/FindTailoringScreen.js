import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as storeActions from '../../store/actions/store';
import {useDispatch, useSelector} from 'react-redux';
import youArehereIcon from '../../icons/youAreHere.png';
import storeIcon from '../../icons/store.png';

import FindTailoringItem from '../../Components/Item/FindTailoringItem';

const FindTailoringScreen = props => {
  const dispatch = useDispatch();
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStore, setNearestStore] = useState(null);
  const [radius, setRadius] = useState(4000);
  const approvedStores = useSelector(state => state.store.approvedStores);
  useEffect(() => {
    try {
      dispatch(storeActions.fetchAllApprovedStore);
    } catch (error) {
      console.log('Error on FindTailoringScreen: ' + error);
    }
  }, []);
  useEffect(() => {
    try {
      if (userLocation != null && approvedStores.length != 0) {
        const nearbyStores = [];
        const maxDistance = 4;
        approvedStores.forEach(store => {
          const storeLat = store.latitude;
          const storeLon = store.longitude;
          const userLat = userLocation.latitude;
          const userLon = userLocation.longitude;
          const distance = calculateDistance(
            userLat,
            userLon,
            storeLat,
            storeLon,
          );

          if (distance <= maxDistance) {
            nearbyStores.push({...store});
          }
        });
        setNearestStore(nearbyStores);
      }
    } catch (error) {
      console.log('Error on FindTailoringScreen: ' + error);
    }
  }, [approvedStores, userLocation]);
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  function toRad(deg) {
    return deg * (Math.PI / 180);
  }
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation({latitude, longitude});
      },
      error => {
        console.log(error);
        Alert.alert('Location needed', 'Location is needed to work', [
          {
            text: 'OK',
            onPress: () => {
              props.navigation.goBack();
            },
          },
        ]);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);
  const renderItem = ({item}) => (
    <FindTailoringItem
      storeName={item.storeName}
      storeImage={item.storeImage}
      onPress={() => {
        props.navigation.navigate('STORE DETAIL', {
          storeId: item.storeId,
        });
      }}
    />
  );

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
          }}
          style={styles.mapSize}>
          {userLocation && (
            <Circle
              center={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              radius={radius}
              fillColor="rgba(0, 128, 255, 0.2)"
              strokeColor="rgba(0, 128, 255, 0.8)"
            />
          )}
          {nearestStore != null &&
            nearestStore.map(store => (
              <Marker
                key={store.storeId}
                coordinate={{
                  latitude: parseFloat(store.latitude),
                  longitude: parseFloat(store.longitude),
                }}
                title={store.storeName}>
                <Image source={storeIcon} style={{width: 50, height: 50}} />
              </Marker>
            ))}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here">
            <Image source={youArehereIcon} style={{width: 50, height: 50}} />
          </Marker>
        </MapView>
      )}

      {userLocation && (
        <FlatList
          data={nearestStore}
          horizontal={true}
          renderItem={renderItem}
          keyExtractor={item => item.storeId}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
  mapSize: {
    width: '100%',
    height: '60%',
  },
  itemsContainer: {
    height: '40%',
    width: '100%',
    backgroundColor: '#E8E8E8',
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    margin: 15,
  },
  items: {
    width: '48%',
    height: '30%',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
export default FindTailoringScreen;
