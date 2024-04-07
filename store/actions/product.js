import product from '../../models/products';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

/* export const CREATE_NEW_PRODUCT = 'CREATE_NEW_PRODUCT'; */

export const SET_USER_PRODUCTS = 'SET_USER_PRODUCTS';
export const SET_STORE_PRODUCTS = 'SET_STORE_PRODUCTS';
export const SET_ALL_PRODUCTS = 'SET_ALL_PRODUCTS';
export const SET_CART_PRODUCTS = 'SET_CART_PRODUCT';
export const SET_SPECIFIC_PRODUCT = 'SET_SPECIFIC_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const addProduct = (
  storeId,
  productTitle,
  productImages,
  primaryImage,
  productCategory,
  productDescription,
  productVariation,
  price,
  isActive,
) => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;

      let primaryImageFilename = '';
      let productFileName = [];
      const ratings = {
        '1Star': 0,
        '2Star': 0,
        '3Star': 0,
        '4Star': 0,
        '5Star': 0,
      };
      primaryImage.map(value => {
        primaryImageFilename = value.imageFileName;
        storage()
          .ref(`products/primary/${value.imageFileName}`)
          .putFile(value.imageUri)
          .on('state_changed', taskSnapshot => {
            console.log(
              `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );
          });
      });

      productImages.map(value => {
        productFileName.push(value.imageFileName);
        storage()
          .ref(`products/${value.imageFileName}`)
          .putFile(value.imageUri)
          .on('state_changed', taskSnapshot => {
            console.log(
              `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );
          });
      });
      const productRef = firestore().collection('Products').doc();
      await productRef.set({
        id: productRef.id,
        storeId: storeId,
        productTitle: productTitle,
        productImages: productFileName,
        productPrimaryImage: primaryImageFilename,
        productCategory: productCategory,
        productDescription: productDescription,
        productVariation: productVariation,
        productPrice: price,
        isActive: isActive,
        status: 'approved',
        ratings: ratings,
      });
    } catch (error) {
      console.log('error at addProduct at product.js' + error);
    }
  };
};
export const publishProduct = productId => {
  return (dispatch, getState) => {
    firestore()
      .collection('Products')
      .doc(productId)
      .update({
        isActive: true,
      })
      .then(() => {
        console.log('Product  updated!');
      });
  };
};
export const delistProduct = productId => {
  return (dispatch, getState) => {
    firestore()
      .collection('Products')
      .doc(productId)
      .update({
        isActive: false,
      })
      .then(() => {
        console.log('Product updated!');
      });
  };
};
export const updateProduct = (
  productId,
  productTitle,
  initialImages,
  productImages,
  initialPrimaryImage,
  primaryImage,
  productCategory,
  productDescription,
  productVariation,
  productPrice,
  isActive,
) => {
  let productFileName = [];
  let primaryProductFilename = '';
  productImages.map(value => {
    productFileName.push(value.imageFileName);
  });
  primaryImage.map(value => {
    primaryProductFilename = value.imageFileName;
  });
  const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    arr1.sort();
    arr2.sort();
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  };
  if (arraysAreEqual(initialImages, productFileName)) {
    if (primaryProductFilename === initialPrimaryImage) {
      firestore()
        .collection('Products')
        .doc(productId)
        .update({
          productTitle: productTitle,
          productCategory: productCategory,
          productDescription: productDescription,
          productPrice: productPrice,
          productVariation: productVariation,
          productPrimaryImage: primaryProductFilename,
          isActive: isActive,
        })
        .then(() => {
          console.log('Product updated!');
        });
    } else {
      primaryImage.map(value => {
        const task = storage()
          .ref(`products/primary/${value.imageFileName}`)
          .putFile(value.imageUri);

        task.on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
        task.then(() => {
          firestore()
            .collection('Products')
            .doc(productId)
            .update({
              productTitle: productTitle,
              productCategory: productCategory,

              productDescription: productDescription,
              productPrice: productPrice,
              productVariation: productVariation,
              productPrimaryImage: primaryProductFilename,
              isActive: isActive,
            })
            .then(() => {
              console.log('Product updated/image uploaded!');
            });
        });
      });
      storage().ref(`products/primary/${initialPrimaryImage}`).delete();
    }
  } else {
    if (primaryProductFilename != initialPrimaryImage) {
      primaryImage.map(value => {
        const task = storage()
          .ref(`products/primary/${value.imageFileName}`)
          .putFile(value.imageUri);

        task.on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
        task.then(() => {
          firestore()
            .collection('Products')
            .doc(productId)
            .update({
              productTitle: productTitle,
              productCategory: productCategory,

              productDescription: productDescription,
              productPrice: productPrice,
              productVariation: productVariation,
              productPrimaryImage: primaryProductFilename,
              isActive: isActive,
            })
            .then(() => {
              console.log('Product updated/image uploaded!');
            });
        });
      });
      storage().ref(`products/primary/${initialPrimaryImage}`).delete();
    }
    //upload image
    productImages.map(value => {
      const a = initialImages.find(prod => prod === value.imageFileName);
      if (a) {
      } else {
        const task = storage()
          .ref(`products/${value.imageFileName}`)
          .putFile(value.imageUri);

        task.on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
        task.then(() => {
          firestore()
            .collection('Products')
            .doc(productId)
            .update({
              productTitle: productTitle,
              productImages: productFileName,
              productCategory: productCategory,

              productDescription: productDescription,
              productPrice: productPrice,
              productVariation: productVariation,
              isActive: isActive,
            })
            .then(() => {
              console.log('Product updated/image uploaded!');
            });
        });
        if (productFileName[0] != initialImages[0]) {
          console.log('not equal');
        }
        if (productFileName[0] != initialImages[0]) {
          console.log('equal');
        }
      }
    });

    //delete image
    initialImages.map(value => {
      const a = productFileName.find(prod => prod === value);
      if (a) {
      } else {
        storage()
          .ref(`products/${value}`)
          .delete()
          .then(() => {
            firestore()
              .collection('Products')
              .doc(productId)
              .update({
                productTitle: productTitle,
                productImages: productFileName,
                productCategory: productCategory,

                productDescription: productDescription,
                productPrice: productPrice,
                productVariation: productVariation,
                isActive: isActive,
              })
              .then(() => {
                console.log('Product updated/image deleted!');
              });
          });
      }
    });
  }
};
export const updateProductStock = (productId, quantity, chosenSize) => {
  // Retrieve the current product data
  return dispatch => {
    firestore()
      .collection('Products')
      .doc(productId)
      .get()
      .then(doc => {
        // Get the current product stock
        for (const key in doc.data().productVariation) {
          if (chosenSize == key) {
            const stock = doc.data().productVariation[key];
            let currentStock = doc.data().productVariation;
            const newStock = +stock - quantity;
            currentStock[key] = newStock;
            firestore()
              .collection('Products')
              .doc(productId)
              .update({
                productVariation: currentStock,
              })
              .then(() => {
                console.log('Product updated!');
              })
              .catch(error => {
                console.error('Error updating product:', error);
              });
          }

          /*   */
        }
        /*  switch (chosenSize) {
          case 'small':
            const smallStock = doc.data().smallStock;
           
            const newSmallStock = +smallStock - quantity;


            firestore()
              .collection('Products')
              .doc(productId)
              .update({
                smallStock: newSmallStock,
              })
              .then(() => {
                console.log('Product updated!');
              })
              .catch(error => {
                console.error('Error updating product:', error);
              });
            break;
          case 'medium':
            const mediumStock = doc.data().mediumStock;
         
            const newMediumStock = +mediumStock - quantity;

          
            firestore()
              .collection('Products')
              .doc(productId)
              .update({
                mediumStock: newMediumStock,
              })
              .then(() => {
                console.log('Product updated!');
              })
              .catch(error => {
                console.error('Error updating product:', error);
              });
            break;
          case 'large':
            const largeStock = doc.data().largeStock;
          
            const newLargeStock = +largeStock - quantity;

          
            firestore()
              .collection('Products')
              .doc(productId)
              .update({
                largeStock: newLargeStock,
              })
              .then(() => {
                console.log('Product updated!');
              })
              .catch(error => {
                console.error('Error updating product:', error);
              });
            break;
        } */
      })
      .catch(error => {
        console.error('Error getting document:', error);
      });
  };
};
export const fetchUserStoreProducts = storeId => {
  //FOR USER STORE
  return (dispatch, getState) => {
    const userId = getState().auth.userId;
    firestore()
      .collection('Products')
      .where('storeId', '==', storeId)
      .onSnapshot(documentSnapshot => {
        const storeProducts = [];
        documentSnapshot.docs.forEach(item => {
          const productData = item.data();
          storeProducts.push(productData);
        });

        dispatch({
          type: SET_USER_PRODUCTS,
          userStoreProducts: storeProducts,
        });
      });
  };

  /*  const url = storage()
    .ref(
      'products/rn_image_picker_lib_temp_fbc49940-0e52-4119-aced-dfffe066919e.jpg',
    )
    .getDownloadURL();
  console.log(url); */
  /*   firestore()
    .collection('Products')
    .get()
    .then(documentSnapshot => {
      let data = [];
      documentSnapshot.docs.forEach(item => {
        for (let i = 0; i < item.data().uri.length; i++) {
          data.push({uri: item.data().uri[i]});
          console.log('data: ' + item.data().uri[i] + 'i: ' + i);
        }
      });
      console.log(data);
    }); */
};

export const fetchStoreProduct = storeId => {
  //FOR STORE DETAIL

  return (dispatch, getState) => {
    firestore()
      .collection('Products')
      .where('isActive', '==', true)
      .where('storeId', '==', storeId)
      .where('status', '==', 'approved')
      .onSnapshot(documentSnapshot => {
        const storeProducts = [];
        documentSnapshot.docs.forEach(item => {
          const productData = item.data();
          storeProducts.push(
            new product(
              item.id,
              productData.storeId,
              productData.productTitle,
              productData.productImages,
              productData.productCategory,
              productData.bodyMeasurementNeeded,
              productData.productDescription,
              productData.productPrice,
              productData.productStock,
              productData.productPrimaryImage,
              productData.isActive,
              productData.status,
              productData.largeStock,
              productData.mediumStock,
              productData.smallStock,
              productData.productVariation,
            ),
          );
        });
        dispatch({
          type: SET_STORE_PRODUCTS,
          storeProducts: storeProducts,
        });
      });
  };
};
//used in ProfuctOveriewScreen.js at home folder
export const fetchAllProducts = (dispatch, getState) => {
  //FOR PRODUCT OVERVIEWS
  firestore()
    .collection('Products')
    .where('isActive', '==', true)
    .where('status', '==', 'approved')
    .onSnapshot(documentSnapshot => {
      const allProducts = [];
      documentSnapshot.docs.forEach(item => {
        const productData = item.data();
        allProducts.push(
          new product(
            item.id,
            productData.storeId,
            productData.productTitle,
            productData.productImages,
            productData.productCategory,
            productData.bodyMeasurementNeeded,
            productData.productDescription,
            productData.productPrice,
            productData.productStock,
            productData.productPrimaryImage,
            productData.isActive,
            productData.status,
            productData.largeStock,
            productData.mediumStock,
            productData.smallStock,
            productData.productVariation,
          ),
        );
      });
      dispatch({
        type: SET_ALL_PRODUCTS,
        allStoreProduct: allProducts,
      });
    });
};
//used in ProductDDetailScreen.js at home folder
export const fetchSpecificProduct = productId => {
  return (dispatch, getState) => {
    const unsubscribe = firestore()
      .collection('Products')
      .doc(productId)
      .onSnapshot(documentSnapshot => {
        const specificId = documentSnapshot.id;
        let productData = documentSnapshot.data();
        productData.id = specificId;
        dispatch({
          type: SET_SPECIFIC_PRODUCT,
          specificProduct: productData,
        });
      });
    return () => unsubscribe();
  };
};
export const fetchCartProducts = storeId => {
  //FOR CART NOT TO ERROR WHILE ADDING NEW PRODUCT
  return (dispatch, getState) => {
    firestore()
      .collection('Products')
      .where('storeId', 'in', storeId)
      .onSnapshot(documentSnapshot => {
        const storeProducts = [];
        documentSnapshot.docs.forEach(item => {
          const productData = item.data();

          storeProducts.push(
            new product(
              item.id,
              productData.storeId,
              productData.productTitle,
              productData.productImages,
              productData.productCategory,
              productData.bodyMeasurementNeeded,
              productData.productDescription,
              productData.productPrice,
              productData.productStock,
              productData.productPrimaryImage,
              productData.isActive,
              productData.status,
              productData.largeStock,
              productData.mediumStock,
              productData.smallStock,
              productData.productVariation,
            ),
          );
        });
        dispatch({
          type: SET_CART_PRODUCTS,
          cartProducts: storeProducts,
        });
      });
  };
};
