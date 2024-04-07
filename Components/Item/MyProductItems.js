import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

import storage from '@react-native-firebase/storage';
import Card from '../UI/Card';
import MainButton from '../UI/CustomButton/MainButton';

const MyProductItems = props => {
  const [productImage, setProductImage] = useState();
  useEffect(() => {
    const downloadProductImage = async () => {
      setTimeout(async () => {
        const fromStorage = await storage()
          .ref(`products/primary/` + props.images)
          .getDownloadURL();
        setProductImage(fromStorage);
      }, 3000);
    };
    downloadProductImage();
  }, [props.images]);
  console.log();
  return (
    <Card style={styles.MyProductItems}>
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          {productImage && (
            <Image style={styles.imageStyle} source={{uri: productImage}} />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {props.title}
          </Text>
          <Text numberOfLines={1} style={styles.category}>
            {props.category}
          </Text>
          <Text numberOfLines={1} style={styles.price}>
            ₱{props.price}
          </Text>
          <Text numberOfLines={1} style={styles.price}>
            Stocks:
          </Text>
          <View style={styles.stockRowContainer}>
            {Object.entries(props.productVariation).map(([key, value]) => {
              return (
                <Text key={key} numberOfLines={1} style={styles.stockRowText}>
                  {key}:{value}
                </Text>
              );
            })}
            {/*  {(props.smallStock != '' || props.smallStock != 0) && (
              <Text numberOfLines={1} style={styles.stockRowText}>
                Small:{props.smallStock}
              </Text>
            )}
            {(props.mediumStock != '' || props.mediumStock != 0) && (
              <Text numberOfLines={1} style={styles.stockRowText}>
                Medium:{props.mediumStock}
              </Text>
            )}
            {(props.largeStock != '' || props.largeStock != 0) && (
              <Text numberOfLines={1} style={styles.stockRowText}>
                Large:{props.largeStock}
              </Text>
            )} */}
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <MainButton
          style={styles.button}
          label={props.publishLabel}
          onPress={props.onPressPublish}
        />
        <MainButton
          style={styles.editButton}
          textStyleProp={{color: 'black'}}
          label={props.editLabel}
          onPress={props.onPressEdit}
        />
      </View>
    </Card>
  );
};
const styles = StyleSheet.create({
  MyProductItems: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  imageContainer: {
    width: '20%',
    height: 75,
    borderRadius: 10,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  infoContainer: {
    width: '80%',
    padding: 5,
  },
  title: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  category: {
    color: 'black',
    fontSize: 12,
    textTransform: 'lowercase',
  },
  price: {
    color: 'black',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  stock: {
    color: 'black',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  stockRowContainer: {
    flexDirection: 'row',
  },
  stockRowText: {
    color: 'black',
    marginRight: 5,
    textTransform: 'capitalize',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'space-between',
  },
  button: {
    width: '47%',
    margin: 5,
    height: 40,
    borderRadius: 10,
  },
  editButton: {
    width: '47%',
    margin: 5,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
});
export default MyProductItems;
