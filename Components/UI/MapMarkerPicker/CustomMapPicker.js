import React, {useReducer, useEffect} from 'react';

import {View, Text, StyleSheet} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

import ErrorText from '../CustomText/ErrorText';
const LATLNG_CHANGE = 'LATLNG_CHANGE';
const LATLNG_VALIDITY_CHANGE = 'LATLNG_VALIDITY_CHANGE';
const latlngReducer = (state, action) => {
  switch (action.type) {
    case LATLNG_CHANGE:
      return {
        ...state,
        latitude: action.lat,
        longitude: action.long,
      };
    case LATLNG_VALIDITY_CHANGE:
      return {
        ...state,
        isValid: action.isValid,
      };
    default:
      return state;
  }
};
const CustomMapPicker = props => {
  const [mapPickerState, dispatch] = useReducer(latlngReducer, {
    latitude: 7.063293878285977,
    longitude: 125.59594255427733,
    isValid: false,
  });
  const {id, onPickerChange} = props;
  useEffect(() => {
    onPickerChange(
      id,
      mapPickerState.latitude,
      mapPickerState.longitude,
      mapPickerState.isValid,
    );
  }, [id, onPickerChange, mapPickerState]);
  return (
    <View style={styles.container}>
      <Text style={(styles.textStyle, {color: '#000'})}>
        {props.label}
      </Text>
      <MapView
        initialRegion={{
          latitude: mapPickerState.latitude,
          longitude: mapPickerState.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        style={styles.mapView}>
        <Marker
          draggable
          coordinate={{
            latitude: mapPickerState.latitude,
            longitude: mapPickerState.longitude,
          }}
          onDragEnd={e => {
            const longitude = e.nativeEvent.coordinate.longitude;
            const latitude = e.nativeEvent.coordinate.latitude;
            dispatch({type: LATLNG_CHANGE, lat: latitude, long: longitude});
            dispatch({type: LATLNG_VALIDITY_CHANGE, isValid: true});
          }}
        />
      </MapView>
      {!mapPickerState.isValid && props.isError && (
        <ErrorText
          style={{marginRight: 10, marginVertical: 5}}
          errorText={'Please drag the marker on your store location.'}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
    marginLeft: '2%',
  },
  mapView: {
    width: '100%',
    height: 250,
  },
});
export default CustomMapPicker;
