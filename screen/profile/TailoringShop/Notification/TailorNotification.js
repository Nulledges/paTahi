import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableNativeFeedbackBase,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MainButton from '../../../../Components/UI/CustomButton/MainButton';
import Card from '../../../../Components/UI/Card';
import * as notificationActions from '../../../../store/actions/notification';
const TailorNotification = props => {
  const notificationInfo = useSelector(
    state => state.notification.tailorNotifications,
  );
  const store = useSelector(state => state.store.myStore);
  const dispatch = useDispatch();
  console.log(store.storeId);
  useEffect(() => {
    dispatch(notificationActions.fetchTailorNotification(store.storeId));
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={styles.notification}>
        <View>
          <Text style={styles.notificationTitle}>{item.notificationTitle}</Text>
          <Text style={styles.notificationBody}>{item.notificationBody}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {notificationInfo.length === 0 && (
        <Card style={styles.noItemContainer}>
          <Text style={styles.textStyle}>No Notifications</Text>
        </Card>
      )}
      <FlatList
        data={notificationInfo}
        renderItem={renderItem}
        keyExtractor={item => item.notificationId}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8E8',
  },
  noItemContainer: {
    width: '100%',
    height: 250,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noItemButton: {
    width: 175,
    height: 35,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  notification: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  notificationTitle: {
    color: 'black',
    fontSize: 18,
  },
  notificationBody: {
    color: 'black',
    fontSize: 14,
  },
  textStyle: {
    color: 'black',
  },
});
export default TailorNotification;
