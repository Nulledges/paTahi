class stores {
  constructor(
    storeId,
    activeProduct,
    email,
    inactiveProduct,
    phoneNumber,
    status,
    storeIcon,
    storeImage,
    storeName,
    storeOwner,
    userId,
    latitude,
    longitude,
    isSubscribed,
    subscriptionId,
  ) {
    this.storeId = storeId;
    this.activeProduct = activeProduct;
    this.email = email;
    this.inactiveProduct = inactiveProduct;
    this.phoneNumber = phoneNumber;
    this.status = status;
    this.storeIcon = storeIcon;
    this.storeImage = storeImage;
    this.storeName = storeName;
    this.storeOwner = storeOwner;
    this.userId = userId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.isSubscribed = isSubscribed;
    this.subscriptionId = subscriptionId;
  }
}

export default stores;
