class cartItem {
  constructor(
    id,
    variantId,
    productId,
    quantity,
    storeId,
    productCategory,
    productDescription,
    productPrimaryImage,
    productPrice,
    productTitle,
    /*    reqMeasurements,
    myMeasurements, */
    isRated,
    chosenSize,
    isSelected,
  ) {
    this.id = id;
    this.variantId = variantId;
    this.productId = productId;
    this.quantity = quantity;
    this.storeId = storeId;
    this.productCategory = productCategory;
    this.productDescription = productDescription;
    this.productPrimaryImage = productPrimaryImage;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    /*     this.reqMeasurements = reqMeasurements;
    this.myMeasurements = myMeasurements; */
    this.isRated = isRated;
    this.chosenSize = chosenSize;
    this.isSelected = isSelected;
  }
}

export default cartItem;
