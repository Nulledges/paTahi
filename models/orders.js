class orders {
  constructor(
    id,
    storeId,
    storeName,
    userId,
    username,
    userPhone,
    dateOrdered,
    datePickedup,
    status,
    totalPrice,
    items,
    balance,
    orderType,
    isUserSeen,
    isStoreSeen,
  ) {
    this.id = id;
    this.storeId = storeId;
    this.storeName = storeName;
    this.userId = userId;
    this.username = username;
    this.userPhone = userPhone;
    this.dateOrdered = dateOrdered;
    this.datePickedup = datePickedup;
    this.status = status;
    this.totalPrice = totalPrice;
    this.items = items;
    this.balance = balance;
    this.orderType = orderType;
    this.isUserSeen = isUserSeen;
    this.isStoreSeen = isStoreSeen;
  }
}

export default orders;
