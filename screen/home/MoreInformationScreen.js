import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const MoreInfomationScreen = () => {
  const Latlng = {
    latitude: 7.063293878285977,
    longitude: 125.59594255427733,
  };
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: 7.063293878285977,
          longitude: 125.59594255427733,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        style={{width: '100%', height: 250}}>
        <Marker
          draggable
          coordinate={Latlng}

          onDragEnd={e => {
            console.log('dragEnd', e.nativeEvent.coordinate);
          }}
        />
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
});

export default MoreInfomationScreen;
