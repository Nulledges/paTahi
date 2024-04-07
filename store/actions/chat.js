import chatMembers from '../../models/chatMembers';
import chatMessages from '../../models/chatMessages';
import firestore from '@react-native-firebase/firestore';
export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_CHAT_MEMBERS = 'SET_CHAT_MEMBERS';
export const SET_TAILOR_CHAT_MEMBERS = 'SET_TAILOR_CHAT_MEMBERS';
/* export const createChat = (tailorsId,userId) => {
  return (dispatch, getState) => {
    const fromTailor = userId
    const userId = getState().auth.userId;

    const chatRef = firestore().collection('chat').doc();
    chatRef.set({
      id: chatRef,
    });
  };
}; */
export const createNewMessage = (
  message,
  chatId,
  storeId,
  storeName,
  customerName,
  storeIcon,
  profileIcon,
) => {
  return (dispatch, getState) => {
    try {
      const currentDate = new Date();

      const userId = getState().auth.userId;
      const array1 = [storeId, userId];

      const chatRef = firestore().collection('chat').doc();

      chatRef.set({
        id: chatRef.id,
        memberIds: array1,
        storeName: storeName,
        customerName: customerName,
        storeIcon: storeIcon,
        profileIcon: profileIcon,
      });
      firestore()
        .collection('chat')
        .doc(chatRef.id)
        .collection('messages')
        .add({
          dateCreated: currentDate,
          chatId: chatRef.id,
          message: message,
          senderId: userId,
          seen: false,
        });
    } catch (error) {
      console.log('error at createNewMessage' + error);
    }
  };
};
export const createMessage = (message, chatId) => {
  return (dispatch, getState) => {
    const currentDate = new Date();
    const userId = getState().auth.userId;

    firestore().collection('chat').doc(chatId).collection('messages').add({
      dateCreated: currentDate,
      message: message,
      chatId: chatId,
      senderId: userId,
      seen: false,
    });
  };
};
export const createTailorMessage = (message, chatId, tailorsId) => {
  return (dispatch, getState) => {
    const currentDate = new Date();
    firestore().collection('chat').doc(chatId).collection('messages').add({
      dateCreated: currentDate,
      message: message,
      chatId: chatId,
      senderId: tailorsId,
      seen: false,
    });
  };
};
export const fetchProductDetailChat = storeId => {
  return (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const array1 = [storeId, userId];

      firestore()
        .collection('chat')
        .where('memberIds', '==', array1)
        .onSnapshot(docSnapShot => {
          if (docSnapShot.docs.length != 0) {
            docSnapShot.docs.forEach(chatDoc => {
              const chatData = chatDoc.data();
              const chatId = chatDoc.id;
              firestore()
                .collection('chat')
                .doc(chatId)
                .collection('messages')
                .orderBy('dateCreated', 'desc')
                .limit(5)
                .onSnapshot(documentSnapshot => {
                  const messages = [];
                  documentSnapshot.docs.forEach(item => {
                    const messagedata = item.data();
                    messages.push(
                      new chatMessages(
                        item.id,
                        chatId,
                        messagedata.senderId,
                        messagedata.message,
                        messagedata.dateCreated.toDate(),
                        messagedata.seen,
                      ),
                    );
                  });

                  dispatch({
                    type: SET_MESSAGES,
                    messageList: messages,
                  });
                });
            });
          }

          dispatch({
            type: SET_MESSAGES,
            messageList: [],
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
};
export const fetchChatMembers = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('chat')
    .where('memberIds', 'array-contains', userId)
    .onSnapshot(documentSnapshot => {
      const chatMembersInfo = [];
      documentSnapshot.docs.forEach(item => {
        const chatid = item.id;
        const chatMembersData = item.data();

        chatMembersInfo.push(
          new chatMembers(
            chatid,
            chatMembersData.memberIds,
            chatMembersData.storeName,
            chatMembersData.customerName,
            chatMembersData.storeIcon,
            chatMembersData.profileIcon,
          ),
        );
      });
      dispatch({
        type: SET_CHAT_MEMBERS,
        memberList: chatMembersInfo,
      });
    });
};
export const fetchTailorChat = tailorId => {
  return (dispatch, getState) => {
    firestore()
      .collection('chat')
      .where('memberIds', 'array-contains', tailorId)
      .onSnapshot(documentSnapshot => {
        const chatMembersInfo = [];
        documentSnapshot.docs.forEach(item => {
          const chatid = item.id;
          const chatMembersData = item.data();
          console.log(chatMembersData);
          chatMembersInfo.push(
            new chatMembers(
              chatid,
              chatMembersData.memberIds,
              chatMembersData.storeName,
              chatMembersData.customerName,
              chatMembersData.storeIcon,
              chatMembersData.profileIcon,
            ),
          );
        });
        dispatch({
          type: SET_TAILOR_CHAT_MEMBERS,
          tailorChatList: chatMembersInfo,
        });
      });
  };
};
export const fetchChatMessages = chatId => {
  return (dispatch, getState) => {
    firestore()
      .collection('chat')
      .doc(chatId)
      .collection('messages')
      .orderBy('dateCreated', 'desc')
      .limit(5)
      .onSnapshot(documentSnapshot => {
        const messages = [];
        documentSnapshot.docs.forEach(item => {
          const messagedata = item.data();
          messages.push(
            new chatMessages(
              item.id,
              chatId,
              messagedata.senderId,
              messagedata.message,
              messagedata.dateCreated.toDate(),
              messagedata.seen,
            ),
          );
        });

        dispatch({
          type: SET_MESSAGES,
          messageList: messages,
        });
      });
  };
};
