class order {
  constructor(
    id,
    storeId,
    storeName,
    userId,
    status,
    items,
    totalPrice,
    dateOrdered,
    dateCollected,
    isRated,
  ) {
    this.id = id;
    this.storeId = storeId;
    this.storeName = storeName;
    this.userId = userId;
    this.status = status;
    this.items = items;
    this.totalPrice = totalPrice;
    this.dateOrdered = dateOrdered;
    this.dateCollected = dateCollected;
    this.isRated = isRated;
  }
}

export default order;
