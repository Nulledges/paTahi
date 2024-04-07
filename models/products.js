class products {
  constructor(
    id,
    storeId,
    productTitle,
    productImages,
    productCategory,
    bodyMeasurementNeeded,
    productDescription,
    productPrice,
    productStock,
    //productRating,
    productPrimaryImage,
    isActive,
    status,
    largeStock,
    mediumStock,
    smallStock,
    productVariation,
  ) {
    this.id = id;
    this.storeId = storeId;
    this.productTitle = productTitle;
    this.productImages = productImages;
    this.productCategory = productCategory;
    this.bodyMeasurementNeeded = bodyMeasurementNeeded;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productStock = productStock;
    this.productPrimaryImage = productPrimaryImage;
    //this.productRating = productRating
    this.isActive = isActive;
    this.status = status;
    this.largeStock = largeStock;
    this.mediumStock = mediumStock;
    this.smallStock = smallStock;
    this.productVariation = productVariation;
  }
}

export default products;

/* 
class products {
  constructor(
    id,
    storeId,
    productTitle,
    productImages,
    productCategory,
    bodyMeasurementNeeded,
    productDescription,
    productPrice,
    productStock,

    productPrimaryImage,
    isActive,
    status,
  ) {
    this.id = id;
    this.storeId = storeId;
    this.productTitle = productTitle;
    this.productImages = productImages;
    this.productCategory = productCategory;
    this.bodyMeasurementNeeded = bodyMeasurementNeeded;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productStock = productStock;
    this.productPrimaryImage = productPrimaryImage;


    this.isActive = isActive;
    this.status = status;
  }
}

export default products; */
