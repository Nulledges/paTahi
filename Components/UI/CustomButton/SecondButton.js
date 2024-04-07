import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const SecondButton = props => {
  return (
    <TouchableOpacity
      
      style={{...styles.SecondButton, ...props.containerStyle}}
      onPress={props.onPress}>
      <Text style={{...styles.TextStyle, ...props.customTextStyle}}>
        {props.label}
        <View style={{...props.customStyle}}>
          <Text>{props.numberOfNotification}</Text>
        </View>
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  SecondButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
  },
  TextStyle: {
    fontSize: 15,
    color: 'black',
    textTransform: 'uppercase',
    padding: 10,
    position: 'relative',
  },
});

export default SecondButton;
