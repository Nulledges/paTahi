import firestore from '@react-native-firebase/firestore';
import category from '../../models/category';

export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_SPECIFIC_CATEGORY = 'SET_SPECIFIC_CATEGORY';
export const addCategory = (storeId, category, measurements) => {
  return async (dispatch, getState) => {
    try {
      const categoryRef = firestore().collection('storecategories').doc();
      await categoryRef.set({
        id: categoryRef.id,
        storeId: storeId,
        category: category,
        measurements: measurements,
      });
    } catch (error) {
      console.log('error at addCustomer in category.js' + error);
    }
  };
};
export const updateCategory = (categoryId, category, measurements) => {
  return async (dispatch, getState) => {
    try {
      const categoryRef = firestore()
        .collection('storecategories')
        .doc(categoryId);
      await categoryRef.update({
        category: category,
        measurements: measurements,
      });
    } catch (error) {
      console.log('error at addCustomer in category.js' + error);
    }
  };
};
export const fetchCategory = storeId => {
  return (dispatch, getState) => {
    firestore()
      .collection('storecategories')
      .where('storeId', '==', storeId)
      .onSnapshot(documentSnapshot => {
        const storeCategory = [];
        documentSnapshot.docs.forEach(item => {
          const categoryData = item.data();
          storeCategory.push(
            new category(
              item.id,
              categoryData.storeId,
              categoryData.category,
              categoryData.measurements,
            ),
          );
        });

        dispatch({
          type: SET_CATEGORY,
          storeCategory: storeCategory,
        });
      });
  };
};
export const fetchSpecificCategory = categoryId => {
  return (dispatch, getState) => {
    firestore()
      .collection('storecategories')
      .where('id', '==', categoryId)
      .onSnapshot(documentSnapshot => {
        let specificCategory = '';
        documentSnapshot.docs.forEach(item => {
          const categoryData = item.data();
          specificCategory = categoryData;
          /*  specificCategory.push(
            new category(
              item.id,
              categoryData.storeId,
              categoryData.category,
              categoryData.subcategory,
            ),
          ); */
        });

        dispatch({
          type: SET_SPECIFIC_CATEGORY,
          specificCategory: specificCategory,
        });
      });
  };
};
