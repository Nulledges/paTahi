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
import MainButton from '../../../Components/UI/CustomButton/MainButton';
import Card from '../../../Components/UI/Card';
import * as notificationActions from '../../../store/actions/notification';
const TailorNotification = props => {
  const notificationInfo = useSelector(
    state => state.notification.tailorNotifications,
  );
  const store = useSelector(state => state.store.myStore);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(notificationActions.fetchTailorNotification(store.storeId));
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={
          item.notificationStatus == false
            ? styles.notificationActive
            : styles.notificationInactive
        }
        onPress={() => {
          dispatch(
            notificationActions.updateTailoringOnclickNotification(
              item.notificationId,
            ),
          );

          props.navigation.navigate(item.mainScreen, {
            screen: item.secondaryScreen,
          });
        }}>
        <View>
          <Text style={styles.notificationTitle}>{item.notificationTitle}</Text>
          <Text style={styles.notificationBody}>{item.notificationBody}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      {notificationInfo.length === 0 && (
        <Card style={styles.cardContainer}>
          <Text style={styles.textStyle}>No Notifications</Text>
        </Card>
      )}
      {notificationInfo.length != 0 && (
        <FlatList
          data={notificationInfo}
          renderItem={renderItem}
          keyExtractor={item => item.notificationId}
          ListHeaderComponent={() => {
            return (
              <View style={{alignItems: 'flex-end', margin: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      notificationActions.updateTailoringMarkAsReadNotification(
                        store.storeId,
                      ),
                    );
                  }}
                  style={{
                    backgroundColor: 'white',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Text style={{color: 'black'}}>Mark all as read</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
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
  noItemButton: {
    width: 175,
    height: 35,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  notificationActive: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  notificationInactive: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
    marginBottom: 10,
    opacity: 0.5,
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
