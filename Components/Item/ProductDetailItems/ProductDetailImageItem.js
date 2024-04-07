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
  ActivityIndicator,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import ImageView from 'react-native-image-viewing';
import SkeletonPlaceHolder from 'react-native-skeleton-placeholder';
const {width} = Dimensions.get('screen');
const height = width * 0.8;
const ProductDetailImageItem = props => {
  const flatlistRef = useRef(null);
  const [active, setActive] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [imageViewIsVisible, setImageViewIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const change = ({nativeEvent}) => {
    const slide =
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width;
    if (slide !== active) {
      setActive(slide);
    }
  };
  useEffect(() => {
    let arrayImages = [];
    if (props.images.length === 0) {
      return;
    }

    const primaryImage = async () => {
      setIsLoading(true);

      const primary = await storage()
        .ref(`products/primary/${props.primaryImage}`)
        .getDownloadURL()
        .catch(error => console.log(error + ' at primary'));
      arrayImages.push({uri: primary});

      props.images.map(async (image, index) => {
        const fromStorage = await storage()
          .ref(`products/` + image)
          .getDownloadURL()
          .catch(error => console.log(error + ' at secondary'));
        arrayImages.push({uri: fromStorage});
        setProductImages(arrayImages);
      });
      setTimeout(async () => {
        setIsLoading(false);
      }, 1000);
    };
    primaryImage();
  }, [props.images, props.primaryImage]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <SkeletonPlaceHolder backgroundColor="#a3a3a3">
          <SkeletonPlaceHolder.Item height={'100%'} />
        </SkeletonPlaceHolder>
      ) : (
        productImages && (
          <FlatList
            ref={flatlistRef}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={productImages}
            onScroll={change}
            pagingEnabled
            renderItem={item => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setImageViewIsVisible(true);
                  }}
                  style={styles.imageContainer}>
                  <Image
                    key={item.index}
                    source={{uri: item.item.uri}}
                    style={styles.imageContainer}
                  />
                </TouchableWithoutFeedback>
              );
            }}
          />
        )
      )}

      {!isLoading && (
        <View style={styles.pagination}>
          <Text style={styles.paginationActiveText}>
            {parseInt(Math.round(active + 1))}/{' '}
            {props.images == undefined ? '' : props.images.length + 1}
          </Text>
        </View>
      )}

      <ImageView
        images={productImages}
        onImageIndexChange={index => {
          setActive(index);
        }}
        presentationStyle="formSheet"
        imageIndex={active}
        visible={imageViewIsVisible}
        onRequestClose={() => {
          flatlistRef.current.scrollToIndex({index: active});
          setImageViewIsVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  imageContainer: {
    width,
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end',
  },
  paginationText: {
    fontSize: width / 30,
    color: '#888',
    margin: 5,
  },
  paginationActiveText: {
    fontSize: width / 30,
    color: '#FFF',
    margin: 5,
  },
});

export default ProductDetailImageItem;
