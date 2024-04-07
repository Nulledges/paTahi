import firestore from '@react-native-firebase/firestore';


export const addCategory = (category, subcategory) => {
    return async (dispatch, getState) => {
        try {
            const categoryRef = firestore().collection('storecategories').doc();
        } catch (error) {
            console.log('error at addCustomer in category.js' + error);
        }
    };
};
