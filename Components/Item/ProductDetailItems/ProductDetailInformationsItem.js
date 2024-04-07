import React, {useRef, useState, useEffect, useCallback} from 'react';
import {AirbnbRating} from 'react-native-ratings';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import MainButton from '../../UI/CustomButton/MainButton';
const ProductDetailInformationItem = props => {
  let totalStocks = 0;
  {
    props.specificProduct.productVariation &&
      Object.values(props.specificProduct.productVariation).map(value => {
        totalStocks += parseInt(value);
      });
  }

  return (
    <View>
      <View style={styles.productBasicContainer}>
        <View style={styles.infoContainer}>
          <View style={{margin: 5}}>
            <Text style={styles.name}>{props.productName}</Text>
          </View>
          <View style={{margin: 5}}>
            <Text style={styles.price}>₱ {props.productPrice}</Text>
          </View>
          <View style={{margin: 5}}>
            <Text
              style={totalStocks <= 0 ? styles.outOfStocks : styles.inStocks}>
              {totalStocks <= 0 ? 'Out of stock' : 'In Stock'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.productDescriptionTextContainer}>
        <View style={styles.productDescriptionInfoTextContainer}>
          <Text style={styles.productDescriptionText}>Category</Text>
        </View>
      </View>
      <View style={styles.productDescriptionContainer}>
        <View style={styles.productDescriptionInfoTextContainer}>
          <Text style={styles.productDescriptionOverviewText}>
            {props.specificProduct.productCategory}
          </Text>
        </View>
      </View>
      <View style={styles.productDescriptionTextContainer}>
        <View style={styles.productDescriptionInfoTextContainer}>
          <Text style={styles.productDescriptionText}>Description</Text>
        </View>
      </View>
      <View style={styles.productDescriptionContainer}>
        <View style={styles.productDescriptionInfoContainer}>
          <Text style={styles.productDescriptionOverviewText}>
            {props.productDescription}
          </Text>
        </View>
      </View>

      <View style={styles.productDescriptionTextContainer}>
        <View style={styles.productDescriptionInfoTextContainer}>
          <Text style={styles.productDescriptionText}>Variation Stock</Text>
        </View>
      </View>
      <View style={styles.productDescriptionContainer}>
        <View style={styles.productDescriptionInfoTextContainer}>
          {props.specificProduct.productVariation &&
            Object.entries(props.specificProduct.productVariation).map(
              ([key, value]) => {
                return (
                  <Text key={key} style={styles.productDescriptionOverviewText}>
                    {key.toUpperCase()}:{value}
                  </Text>
                );
              },
            )}
        </View>
      </View>

      {/*       <View style={styles.productDescriptionTextContainer}>
        <View style={styles.productDescriptionInfoTextContainer}>
          <Text style={styles.productDescriptionText}>
            Required Measurements
          </Text>
        </View>
      </View>
      <View style={styles.productDescriptionContainer}>
        <View style={styles.productDescriptionInfoContainer}>
          {props.productBodyMeasurementNeeded.map((measurement, index) => {
            return (
              <Text style={styles.productDescriptionOverviewText} key={index}>
                {measurement}
              </Text>
            );
          })}
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  productBasicContainer: {
    backgroundColor: '#FFFFFF',
  },
  infoContainer: {
    width: '100%',
    padding: 10,
  },
  name: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  price: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  inStocks: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  outOfStocks: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  productDescriptionTextContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 5,
  },
  productDescriptionInfoTextContainer: {
    width: '100%',
    padding: 10,
  },
  productDescriptionText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  productDescriptionContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  productDescriptionInfoContainer: {
    width: '100%',
    padding: 10,
  },
  productDescriptionOverviewText: {
    color: 'black',
  },
});
export default ProductDetailInformationItem;
