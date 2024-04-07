class notification {
  constructor(
    dateReceived,
    notificationBody,
    notificationId,
    notificationStatus,
    notificationTitle,
    userId,
    storeId,
    mainScreen,
    secondaryScreen,
  ) {
    this.dateReceived = dateReceived;
    this.notificationBody = notificationBody;
    this.notificationId = notificationId;
    this.notificationStatus = notificationStatus;
    this.notificationTitle = notificationTitle;
    this.userId = userId;
    this.storeId = storeId;
    this.mainScreen = mainScreen;
    this.secondaryScreen = secondaryScreen;
  }
}

export default notification;
