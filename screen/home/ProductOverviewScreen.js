import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Text,
  StatusBar,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import SkeletonPlaceHolder from 'react-native-skeleton-placeholder';
import TwoColProductItem from '../../Components/Item/TwoColProductItem';
import RecommendedItem from '../../Components/Item/RecommendedItem';
import * as productActions from '../../store/actions/product';

const ProductOverviewScreen = props => {
  const dispatch = useDispatch();
  const [productRecommendation, setProductRecommendation] = useState([]);
  const [recommendedProduct, setRecommendedProduct] = useState([]);
  const [productImage, setProductImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const allProducts = useSelector(state => state.products.allProducts);
  const userToken = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.userId);

  useEffect(() => {
    const fetchReco = async () => {
      try {
        const response = await axios.get(
          `https://patahi-dev.as.r.appspot.com/ItemBasedAlgo/${userId}`,
        );

        setProductRecommendation(response.data);
      } catch (error) {
        console.log('Error fetching recommendation:', error);
      }
    };
    if (userToken) {
      fetchReco();
    }
  }, []);
  useEffect(() => {
    try {
      const unsubcribe = dispatch(productActions.fetchAllProducts);
      return unsubcribe;
    } catch (error) {
      console.log('Error at ProductOverviewScreen: ' + error);
    }
  }, []);
  useEffect(() => {
    if (productRecommendation.length != 0) {
      const matchingProducts = productRecommendation
        .map(product1 =>
          allProducts.find(product2 => product2.id === product1.productId),
        )
        .filter(product => product !== undefined);

      setRecommendedProduct(matchingProducts);
    }
  }, [productRecommendation, allProducts]);

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
  const renderRecommendedProduct = (details, index) => {
    return (
      <RecommendedItem
        key={details.id}
        title={details.productTitle}
        price={parseInt(details.productPrice).toFixed(2)}
        images={details.productPrimaryImage}
        onPress={() => {
          props.navigation.navigate('PRODUCT DETAIL', {
            productId: details.id,
            storeId: details.storeId,
          });
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <FlatList
          data={allProducts}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View>
              {productRecommendation.length != 0 && (
                <View style={styles.textContainer}>
                  <Text style={styles.text}>Recommended for you</Text>
                </View>
              )}
              <ScrollView horizontal={true}>
                {recommendedProduct.map((details, index) => {
                  return renderRecommendedProduct(details, index);
                })}
              </ScrollView>
              <View style={styles.textContainer}>
                <Text style={styles.text}>All Products</Text>
              </View>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  itemContainer: {
    width: '100%',
  },
  textContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 2,
    padding: 10,
  },
  text: {
    color: 'black',
  },
  recommendedContainer: {
    flexGrow: 0,
    flexShrink: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 193,
    height: 350,
    margin: 2,
    marginTop: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  infoContainer: {
    width: '100%',
    height: 150,
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: 'black',
    flexShrink: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  price: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  reviewContainer: {
    justifyContent: 'flex-start',
  },
  review: {
    flexDirection: 'row',
  },
  reviewTextStyle: {
    color: 'black',
  },
});

export default ProductOverviewScreen;
/* const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item And its too long',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-47f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-1455e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f5571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f5571e9d72',
    title: 'Third Item',
  },
]; */
