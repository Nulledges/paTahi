import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  Button,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import storage from '@react-native-firebase/storage';

import Card from '../UI/Card';
import TwoLabelButton from '../UI/CustomButton/TwoLabelButton';
const ChatListItem = props => {
  const [profileImage, setProfileImage] = useState();
  useEffect(() => {
    const downloadProductImage = async () => {
      const fromStorage = await storage()
        .ref(
          props.storeIcon == undefined
            ? `profile/` + props.profileIcon
            : `stores/icons/` + props.storeIcon,
        )
        .getDownloadURL();
      setProfileImage(fromStorage);
    };
    downloadProductImage();
  }, [props.profileIcon, props.storeIcon]);

  return (
    <View style={styles.infoContainer}>
      {profileImage && (
        <Image
          resizeMode="stretch"
          style={styles.ProfileImage}
          source={{uri: profileImage}}
        />
      )}
      <Text style={styles.textStyle}>
        {props.storeName === undefined ? props.customerName : props.storeName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
  },
  ProfileImage: {
    backgroundColor: '#ffffff',
    borderRadius: 200,
    height: 55,
    width: 55,
  },
  textStyle: {
    color: 'black',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: 10,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChatListItem;
