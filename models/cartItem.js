class cartItem {
  constructor(
    id,
    productId,
    quantity,
    storeId,
    productCategory,
    productDescription,
    productPrimaryImage,
    productPrice,
    productTitle,
    reqMeasurements,
    myMeasurements,
    isRated,
  ) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.storeId = storeId;
    this.productCategory = productCategory;
    this.productDescription = productDescription;
    this.productPrimaryImage = productPrimaryImage;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.reqMeasurements = reqMeasurements;
    this.myMeasurements = myMeasurements;
    this.isRated = isRated;
  }
}

export default cartItem;
