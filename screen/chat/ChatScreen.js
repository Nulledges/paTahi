import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../Components/UI/Card';
import NormalCustomInput from '../../Components/UI/Inputs/NormalCustomInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as chatActions from '../../store/actions/chat';
import {useState} from 'react';
import ChatListItem from '../../Components/Item/ChatListItem';

const ChatScreen = props => {
  const chatList = useSelector(state => state.chat.chatList);
  const userId = useSelector(state => state.auth.userId);

  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const unsubcribe = dispatch(chatActions.fetchChatMembers);
      return unsubcribe;
    } catch (error) {
      console.log('Error at chat Screen: ' + error);
    }
  }, []);

  const renderItem = ({item}) => {
    console.log(item);
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CHATROOM', {
              chatId: item.id,
              storeName: item.storeName,
              storeIcon: item.storeIcon,
            });
          }}>
          <ChatListItem storeIcon={item.storeIcon} storeName={item.storeName} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {chatList.length === 0 && (
        <Card style={styles.cardContainer}>
          <Text style={styles.textStyle}>Nothing to chat.</Text>
        </Card>
      )}
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={chatList}
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
export default ChatScreen;

/* const chat = [
  {id: '1', chatName: 'John Doe'},
  {id: '2', chatName: 'Jane Doe'},
  {id: '3', chatName: 'Bob Smith'},
]; */
