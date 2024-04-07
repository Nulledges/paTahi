import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import storage from '@react-native-firebase/storage';
import SecondButton from '../../Components/UI/CustomButton/SecondButton';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';
import Card from '../../Components/UI/Card';
import * as userActions from '../../store/actions/user';
import * as orderActions from '../../store/actions/order';
const MyAccountScreen = props => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user.myInformation);
  const unseenInfo = useSelector(state => state.order.userUnseenRequest);
  const unseenOrderinfo = useSelector(state => state.order.userUnseenOrder);
  const [profileBanner, setProfileBanner] = useState();
  const [profileIcon, setProfileIcon] = useState();

  //fetching Data
  useEffect(() => {
    try {
      const unsubcribe = dispatch(userActions.fetchUserData);
      return unsubcribe;
    } catch (error) {
      console.log('Error at MyAccountScreen: ' + error);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      dispatch(orderActions.fetchOneUnseen);
      dispatch(orderActions.fetchOneOrderUnseen);
    }, [dispatch]),
  );
  //images
  useEffect(() => {
    if (userInfo === null) {
      return;
    } else {
      const downloadProfiletURI = async () => {
        setTimeout(async () => {
          const icon = await storage()
            .ref(`profile/` + userInfo.profileIcon)
            .getDownloadURL()
            .catch(error => {
              console.log('Error on profile Icon:' + error);
            });
          const banner = await storage()
            .ref(`profile/` + userInfo.profileBanner)
            .getDownloadURL()
            .catch(error => {
              console.log('Error on banner Icon:' + error);
            });
          setProfileIcon(icon);
          setProfileBanner(banner);
        }, 2000);
      };

      downloadProfiletURI();
    }
  }, [userInfo]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTintColor: 'black',
      headerTransparent: true,
      headerTitle: '',
      headerStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerLeft: () => {
        return userInfo === null
          ? ''
          : userInfo.isTailor && (
              <TouchableOpacity
                style={styles.headerLeftButtonContainer}
                onPress={() => {
                  props.navigation.navigate('MYSTORE');
                }}>
                <View style={styles.headerLeftButtonItems}>
                  <MaterialIcons name={'store'} size={24} color="black" />
                  <Text style={styles.headerLeftButtonText}>
                    My Store {'>'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
      },

      headerRight: () => (
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            width: 40,
            height: 40,
            borderRadius: 50,
          }}
          onPress={() => {
            props.navigation.navigate('SETTINGS');
          }}>
          <View>
            <Ionicons name={'md-settings-outline'} size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  });
  return (
    <View style={styles.myAccountScreen}>
      <View style={styles.ProfileContainer}>
        <View style={styles.ProfileBannerContainer}>
          {profileBanner && (
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('EDITPROFILE');
              }}>
              <Image
                resizeMode="stretch"
                style={styles.ProfileBannerImage}
                source={{uri: profileBanner}}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
        <View style={styles.ProfileImageContainer}>
          {profileIcon && (
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('EDITPROFILE');
              }}>
              <Image
                resizeMode="stretch"
                style={styles.ProfileImage}
                source={{uri: profileIcon}}
              />
            </TouchableWithoutFeedback>
          )}
          <View>
            <View style={styles.nameContainer}>
              <TouchableWithoutFeedback
                onPress={() => {
                  props.navigation.navigate('ACCOUNTANDSECURITY');
                }}>
                <Text style={styles.NameTextStyle}>
                  {userInfo === null ? '' : userInfo.username}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>

      {/*  {userInfo === null
        ? ''
        : !userInfo.isTailor && (
            <Card>
              <SecondButton
                label="BECOME A TAILOR"
                onPress={() => {
                  props.navigation.navigate('BECOME A TAILOR');
                }}
              />
            </Card>
          )} */}
      {/* <Card style={styles.cardContainer}>
        <SecondButton
          label="MY ORDERS"
          onPress={() => {
            props.navigation.navigate('MY ORDERS');
          }}
        />
      </Card> */}
      {/*   <Card style={styles.orderContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>Custom Orders</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('USER CUSTOM ORDERS', {
                screen: 'Collected User Custom Order',
              });
            }}>
            <Text style={styles.textStyle}>{`View Sales History >`} </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.boxContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('USER CUSTOM ORDERS');
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>pending</Text>
              <View style={styles.notificationIndicator} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('USER CUSTOM ORDERS', {
                screen: 'Accepted User Custom Order',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>Accepted</Text>
              <View style={styles.notificationIndicator} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('USER CUSTOM ORDERS', {
                screen: 'Ongoing User Custom Order',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>ONGOING</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('USER CUSTOM ORDERS', {
                screen: 'Pickup User Custom Order',
              });
            }}>
            <View style={styles.square}>
              <Text style={styles.squareText}>TO PICKUP</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Card> */}
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel="Order Status"
          secondLabel=">"
          onPress={() => {
            props.navigation.navigate('USER ORDERS SCREEN');
          }}
          numberOfNotification={unseenInfo.length + unseenOrderinfo.length}
          customStyle={
            unseenInfo.length >= 1 || unseenOrderinfo.length >= 1
              ? styles.notificationIndicator
              : ''
          }
        />
      </Card>

      {/*  <Card style={styles.cardContainer}>
        <SecondButton
          label="MY MEASUREMENT"
          onPress={() => {
            props.navigation.navigate('MY MEASUREMENT');
          }}
        />
      </Card> */}
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel="Purchase History"
          secondLabel=">"
          onPress={() => {
            props.navigation.navigate('USER CUSTOM ORDERS', {
              screen: 'Collected User Custom Order',
            });
          }}
        />
      </Card>
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel="MY RATINGS"
          secondLabel=">"
          onPress={() => {
            props.navigation.navigate('MY RATING');
          }}
        />
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  myAccountScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8E8',
  },
  ProfileContainer: {
    height: 125,
  },
  ProfileBannerContainer: {
    width: '100%',
    height: 125,
    position: 'absolute',
    zIndex: -1000,
  },
  ProfileBannerImage: {
    height: '100%',
    width: '100%',
  },
  ProfileImageContainer: {
    marginTop: 45,
    padding: 10,
    flexDirection: 'row',
  },
  ProfileImage: {
    backgroundColor: '#ffffff',
    borderRadius: 200,
    height: 55,
    width: 55,
  },
  nameContainer: {
    marginLeft: 10,
    padding: 1,
    borderRadius: 10,
    backgroundColor: 'rgb(255,255,255)',
  },
  NameTextStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  MyAccountScreenCustomButton: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  MyAccountScreenCustomButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  MyAccountTextStyle: {
    padding: 4,
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerLeftButtonContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    height: 30,
    borderRadius: 10,
    width: 125,
  },
  headerLeftButtonItems: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  headerLeftButtonText: {
    color: 'black',
    textAlignVertical: 'center',
    textTransform: 'uppercase',
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  orderContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 2,
  },
  textStyle: {
    color: 'black',
    textTransform: 'uppercase',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },

  square: {
    width: 75,
    height: 75,
    borderWidth: 1,

    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareText: {
    textTransform: 'uppercase',
    color: 'black',
    fontSize: 10,
  },
  notificationIndicator: {
    position: 'absolute',
    top: 10,
    right: 25,
    padding: 1,
    borderRadius: 50,
    backgroundColor: 'red',
    fontWeight: 'bold',
  },
});

/* export const screenOptions = navigationData => {
  return {
    headerTintColor: 'black',
    headerTransparent: true,
    headerTitle: '',
    headerStyle: {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },

    headerLeft: () => (
      <TouchableOpacity
        style={styles.headerLeftButtonContainer}
        onPress={() => {
          navigationData.navigation.navigate('MYSTORE');
        }}>
        <View style={styles.headerLeftButtonItems}>
          <MaterialIcons name={'store'} size={24} color="black" />
          <Text style={styles.headerLeftButtonText}>My Store {'>'}</Text>
        </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          navigationData.navigation.navigate('SETTINGS');
        }}>
        <View>
          <Ionicons name={'md-settings-outline'} size={24} color="white" />
        </View>
      </TouchableOpacity>
    ),
  };
}; */
export default MyAccountScreen;
