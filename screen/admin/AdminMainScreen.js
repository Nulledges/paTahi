import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Card from '../../Components/UI/Card';
import SecondButton from '../../Components/UI/CustomButton/SecondButton';
import * as adminActions from '../../store/actions/admin';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';
const AdminMainScreen = props => {
  const dispatch = useDispatch();
  const pendingVerificationForms = useSelector(
    state => state.admin.allPendingVerificationForms,
  );
  useEffect(() => {
    try {
      const unsubcribe = dispatch(adminActions.fetchPendingTailorApplication);
      return unsubcribe;
    } catch (error) {
      console.log('Error on HomeStoreOverview: ' + error);
    }
  }, []);
  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel={'store verification'}
          secondLabel={'>'}
          onPress={() => {
            props.navigation.navigate('STORE VERIFICATION');
          }}
          numberOfNotification={pendingVerificationForms.length}
          customStyle={
            pendingVerificationForms.length >= 1
              ? styles.notificationIndicator
              : ''
          }
        />
      </Card>
      <Card style={styles.cardContainer}>
        <TwoLabelButton
          firstLabel={'approved stores'}
          secondLabel={'>'}
          onPress={() => {
            props.navigation.navigate('APPROVED STORE SCREEN');
          }}
        />
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 2,
  },
  notificationIndicator: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 1,
    borderRadius: 50,
    backgroundColor: 'red',
  },
});
export default AdminMainScreen;
