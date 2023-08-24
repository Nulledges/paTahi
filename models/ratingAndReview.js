class ratingAndReview {
  constructor(
    id,
    customerId,
    dateReviewed,
    productId,
    productPrice,
    productPrimaryImage,
    productRating,
    productReview,
    productTitle,
    profileIcon,
    quantity,
    storeId,
    username,
  ) {
    this.id = id;
    this.customerId = customerId;
    this.dateReviewed = dateReviewed;
    this.productId = productId;
    this.productPrice = productPrice;
    this.productPrimaryImage = productPrimaryImage;
    this.productRating = productRating;
    this.productReview = productReview;
    this.productTitle = productTitle;
    this.profileIcon = profileIcon;
    this.quantity = quantity;
    this.storeId = storeId;
    this.username = username;
  }
}

export default ratingAndReview;
