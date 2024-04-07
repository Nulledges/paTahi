import React, {useEffect, useReducer, useCallback, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  Keyboard,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as chatActions from '../../store/actions/chat';
import Card from '../../Components/UI/Card';
import NormalCustomInput from '../../Components/UI/Inputs/NormalCustomInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
const UPDATE_TEXT = 'UPDATE_TEXT';

const ChatRoomScreen = props => {
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState();
  const [message, setMessage] = useState('');
  const userId = useSelector(state => state.auth.userId);
  const messageList = useSelector(state => state.chat.messages);

  const messageHandler = async () => {
    if (message != '') {
      dispatch(
        chatActions.createMessage(
          message,
          props.route.params.chatId,
        ),
      );
      setMessage('')
    }
  };
  useEffect(() => {
    const downloadProductImage = async () => {
      const fromStorage = await storage()
        .ref(
          props.route.params.storeIcon == undefined
            ? `profile/` + props.route.params.profileIcon
            : `stores/icons/` + props.route.params.storeIcon,
        )
        .getDownloadURL();
      setProfileImage(fromStorage);
    };
    downloadProductImage();
  }, [props.route.params.profileIcon, props.route.params.storeIcon]);
  //fetch messages
  useEffect(() => {
    try {
      const unsubcribe = dispatch(
        chatActions.fetchChatMessages(props.route.params.chatId),
      );
      return unsubcribe;
    } catch (error) {
      console.log('Error at chat Screen: ' + error);
    }
  }, []);
  const handleMessageChange = text => {
    setMessage(text);
  };
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle:
        props.route.params.storeName == undefined
          ? props.route.params.customerName
          : props.route.params.storeName,
      headerTintColor: 'black',

      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
    });
  }, []);
  const renderItem = ({item}) => {
    const currentUser = userId;
    const isCurrentUser = item.senderId === currentUser;
    return (
      <View>
        <View
          style={
            isCurrentUser ? '' : {flexDirection: 'row', alignItems: 'center'}
          }>
          {isCurrentUser
            ? ''
            : profileImage && (
                <Image
                  resizeMode="stretch"
                  style={{
                    borderRadius: 50,
                    width: 50,
                    height: 50,
                    backgroundColor: '#E8E8E8',
                  }}
                  source={{uri: profileImage}}
                />
              )}
          <View
            style={
              isCurrentUser
                ? styles.messageContainer
                : styles.otherMessageContainer
            }>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
        }}
        style={styles.itemContainer}
        data={messageList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Card style={styles.CardContainer}>
        <View style={{width: '85%'}}>
          <TextInput
            placeholderTextColor={'#545454'}
            style={{
              padding: 10,
              marginBottom: 5,
              borderBottomWidth: 1,
              height: 50,
              fontSize: 14,
              backgroundColor: '#E8E8E8',
              color: 'black',
            }}
            placeholder="Aa"
            value={message}
            onChangeText={handleMessageChange}
          />
        </View>
        <ScrollView style={{width: '10%', marginLeft: '3%'}}>
          <Ionicons
            onPress={messageHandler}
            name="md-send-sharp"
            size={40}
            color="black"
          />
        </ScrollView>
      </Card>
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
    elevation: 2,
    height: '87%',
  },
  messageContainer: {
    maxWidth: '80%',
    margin: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'flex-end',
  },

  otherMessageContainer: {
    maxWidth: '80%',
    margin: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  CardContainer: {
    borderRadius: 5,
    padding: 5,
    margin: 5,
    height: '10%',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default ChatRoomScreen;

/* const users = [
  {id: '1', name: 'John Doe'},
  {id: '2', name: 'Jane Doe'},
  {id: '3', name: 'Bob Smith'},
];

const messages = [
  {id: '1', senderId: '1', text: 'Hello, how are you?'},
  {id: '2', senderId: '2', text: "I'm good, thanks for asking!"},
  {id: '3', senderId: '2', text: "What's up?"},
  {id: '4', senderId: '1', text: 'Not much, just chatting with you guys'},
  {id: '5', senderId: '1', text: 'Not much, just chatting with you guys'},
  {id: '6', senderId: '1', text: 'Not much, just chatting with you guys'},
  {id: '7', senderId: '1', text: 'Not much, just chatting with you guys'},
  {id: '8', senderId: '1', text: 'Not much, just chatting with you guys'},
  {id: '11', senderId: '2', text: 'Not much, jting with you guys'},
  {id: '22', senderId: '1', text: 'Not much, just chatting with you guys'},
  {id: '433', senderId: '1', text: 'Not much, just ch you guys'},
  {id: '45444', senderId: '1', text: 'Not much, just chatting with you guys'},
  {id: '4432344', senderId: '1', text: 'Not much, justing with you guys'},
  {id: '4444', senderId: '1', text: 'Not much, jtting with you guys'},
]; */
