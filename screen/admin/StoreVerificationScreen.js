import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Card from '../../Components/UI/Card';
import TwoLabelButton from '../../Components/UI/CustomButton/TwoLabelButton';

const StoreVerificationScreen = props => {
  const dispatch = useDispatch();
  const pendingVerificationForms = useSelector(
    state => state.admin.allPendingVerificationForms,
  );
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  }, [pendingVerificationForms]);
  if (isLoading) {
    return (
      <View style={styles.Centered}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const renderItem = ({item}) => (
    <Card style={styles.cardContainer}>
      <TwoLabelButton
        firstLabel={item.storeName}
        secondLabel={'>'}
        onPress={() => {
          props.navigation.navigate('VERIFICATION DETAIL', {
            pendingVerificationForms: item,
          });
        }}
      />
    </Card>
  );
  return (
    <View style={styles.container}>
      {pendingVerificationForms.length === 0 && (
        <Card style={styles.cardContainer2}>
          <Text style={styles.textStyle}>No pending verification</Text>
        </Card>
      )}
      {pendingVerificationForms.length != 0 && (
        <FlatList
          style={styles.FlatListStyle}
          data={pendingVerificationForms}
          keyExtractor={item => item.id}
          key={item => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 5,
    backgroundColor: '#E8E8E8',
  },
  cardContainer: {
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 2,
  },
  cardContainer2: {
    flex: 1,
    width: '97%',
    maxHeight: 146,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FlatListStyle: {
    width: '100%',
  },

  textStyle: {
    color: 'black',
  },
});

export default StoreVerificationScreen;
