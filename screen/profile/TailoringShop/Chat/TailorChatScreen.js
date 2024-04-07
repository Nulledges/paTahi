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

import * as chatActions from '../../../../store/actions/chat';

import Card from '../../../../Components/UI/Card';

const TailorChatScreen = props => {
  const tailorChatList = useSelector(state => state.chat.tailorChatList);
  const storeId = props.route.params.storeId;
  const userId = useSelector(state => state.auth.userId);
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const unsubcribe = dispatch(chatActions.fetchTailorChat(storeId));
      return unsubcribe;
    } catch (error) {
      console.log('Error at chat Screen: ' + error);
    }
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('CHATROOM', {
              chatId: item.id,
              customerName: item.customerName,
            });
          }}>
          <View style={styles.infoContainer}>
            <Image
              resizeMode="stretch"
              style={styles.ProfileImage}
              source={{uri: 'https://wallpaperaccess.com/full/317501.jpg'}}
            />
            <Text
              style={{
                color: 'black',
                justifyContent: 'center',
                alignSelf: 'center',
                marginLeft: 10,
                textTransform: 'capitalize',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              {item.customerName}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {tailorChatList.length === 0 && (
        <Card style={styles.cardContainer}>
          <Text style={styles.textStyle}>Nothing to chat.</Text>
        </Card>
      )}
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={tailorChatList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#E8E8E8',
  },
  itemContainer: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 5,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  ProfileImage: {
    backgroundColor: '#ffffff',
    borderRadius: 200,
    height: 55,
    width: 55,
  },
  cardContainer: {
    flex: 1,
    width: '97%',
    maxHeight: 146,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'black',
  },
});
export default TailorChatScreen;

/* const chat = [
  {id: '1', chatName: 'John Doe'},
  {id: '2', chatName: 'Jane Doe'},
  {id: '3', chatName: 'Bob Smith'},
]; */
