class request {
  constructor(
    id,
    storeId,
    customerId,
    customerName,
    customerPhone,
    category,
    measurements,
    photos,
    fabric,
    description,
    dateRequested,
    status,
    price,
    name,
    quantity,
    balance,
  ) {
    this.id = id;
    this.storeId = storeId;
    this.customerId = customerId;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.category = category;
    this.measurements = measurements;
    this.photos = photos;
    this.fabric = fabric;
    this.description = description;
    this.dateRequested = dateRequested;
    this.status = status;
    this.price = price;
    this.name = name;
    this.quantity = quantity;
    this.balance;
  }
}

export default request;
