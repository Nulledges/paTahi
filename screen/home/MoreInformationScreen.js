import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import storeIcon from '../../icons/store.png';

const MoreInfomationScreen = props => {
  const lat = props.route.params.latitude;
  const long = props.route.params.longitude;
  const Latlng = {
    latitude: lat,
    longitude: long,
  };

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        zoomEnabled={false}
        scrollEnabled={false}
        style={styles.mapSize}>
        <Marker
          draggable={false}
          coordinate={Latlng}
          onDragEnd={e => {
            console.log('dragEnd', e.nativeEvent.coordinate);
          }}
          title={props.route.params.storeName}>
          <Image source={storeIcon} style={{width: 50, height: 50}} />
        </Marker>
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
  mapSize: {
    width: '100%',
    height: 250,
  },
});

export default MoreInfomationScreen;
