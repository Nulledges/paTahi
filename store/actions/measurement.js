import firestore from '@react-native-firebase/firestore';

export const SET_USER_MEASUREMENT = 'SET_USER_MEASUREMENT';
export const SET_SPECIFIC_MEASUREMENT = 'SET_SPECIFIC_MEASUREMENT';

export const addMeasurement = (measurements, name) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const measurement = measurements;
    delete measurements.name;

    firestore()
      .collection('measurement')
      .add({
        measurement: measurement,
        name: name,
        userId: userId,
        measurementId: 'none',
      })
      .then(() => {
        firestore()
          .collection('measurement')
          .where('userId', '==', userId)
          .where('measurementId', '==', 'none')
          .get()
          .then(querySnapshot => {
            querySnapshot.docs.forEach(documentSnapshot => {
              console.log(documentSnapshot);
              const measurementId = documentSnapshot.id;
              firestore()
                .collection('measurement')
                .doc(measurementId)
                .update({measurementId: measurementId});
            });
          });
      });
  };
};
export const fetchUserMeasurement = (dispatch, getState) => {
  const userId = getState().auth.userId;
  firestore()
    .collection('measurement')
    .where('userId', '==', userId)
    .onSnapshot(querySnapshot => {
      let myMeasurement = [];
      querySnapshot.docs.forEach(documentSnapshot => {
        const myMeasurementData = documentSnapshot.data();
        myMeasurement.push(myMeasurementData);
      });
      dispatch({
        type: SET_USER_MEASUREMENT,
        myMeasurementInfo: myMeasurement,
      });
    });
};

export const fetchSpecificMeasurement = measurementId => {
  return (dispatch, getState) => {
    const userId = getState().auth.userId;
    firestore()
      .collection('measurement')
      .where('measurementId', '==', measurementId)
      .onSnapshot(querySnapshot => {
        let mySpecificMeasurement = '';
        querySnapshot.docs.forEach(documentSnapshot => {
          const mySpecificMeasurementData = documentSnapshot.data();
          mySpecificMeasurement = mySpecificMeasurementData;
        });
        dispatch({
          type: SET_SPECIFIC_MEASUREMENT,
          specificMeasurementInfo: mySpecificMeasurement,
        });
      });
  };
};
