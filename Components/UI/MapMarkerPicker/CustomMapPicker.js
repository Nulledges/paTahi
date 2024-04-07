import React, {useState, useReducer, useEffect} from 'react';

import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

import ErrorText from '../CustomText/ErrorText';
import MainButton from '../CustomButton/MainButton';
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
  const [isVisible, setIsVisible] = useState(false);
  const [mapPickerState, dispatch] = useReducer(latlngReducer, {
    latitude: 7.063293878285977,
    longitude: 125.59594255427733,
    isValid: false,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: mapPickerState.latitude,
    longitude: mapPickerState.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
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
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Text style={(styles.textStyle, {color: '#000'})}>{props.label}</Text>
        <Text style={(styles.textStyle, {color: 'red'})}>
          TAP THE MAP TO CHANGE
        </Text>
      </View>

      <MapView
        onPress={() => {
          setIsVisible(true);
        }}
        initialRegion={mapRegion}
        region={mapRegion}
        zoomEnabled={false}
        scrollEnabled={false}
        style={styles.mapView}>
        <Marker
          onPress={() => {
            setIsVisible(true);
          }}
          coordinate={{
            latitude: mapPickerState.latitude,
            longitude: mapPickerState.longitude,
          }}
        />
      </MapView>
      {!mapPickerState.isValid && props.isError && (
        <ErrorText
          style={{marginRight: 10, marginVertical: 5}}
          errorText={'Please drag the marker on your store location.'}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(false);
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.buttonModalContainer}>
                  <Text
                    style={{
                      color: 'red',

                      alignSelf: 'center',
                    }}>
                    TAP MAP OR DRAG MARKER TO UPDATE
                  </Text>
                  <MapView
                    onPress={e => {
                      const latitude = e.nativeEvent.coordinate.latitude;
                      const longitude = e.nativeEvent.coordinate.longitude;

                      setMapRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      });

                      dispatch({
                        type: LATLNG_CHANGE,
                        lat: latitude,
                        long: longitude,
                      });
                      dispatch({type: LATLNG_VALIDITY_CHANGE, isValid: true});
                    }}
                    
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
                        dispatch({
                          type: LATLNG_CHANGE,
                          lat: latitude,
                          long: longitude,
                        });
                        dispatch({type: LATLNG_VALIDITY_CHANGE, isValid: true});
                      }}
                    />
                  </MapView>
                  <MainButton
                    style={styles.blackButton}
                    label="Confirm"
                    onPress={() => {
                      setIsVisible(!isVisible);
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    textTransform: 'uppercase',
  },
  mapView: {
    width: '100%',
    height: 250,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonModalContainer: {
    width: '95%',
    padding: 5,
  },
  blackButton: {
    width: '100%',
    borderRadius: 10,
    marginTop: 5,
  },
});
export default CustomMapPicker;
