class notification {
  constructor(
    dateReceived,
    notificationBody,
    notificationId,
    notificiationStatus,
    notificationTitle,
    userId,
  ) {
    this.dateReceived = dateReceived;
    this.notificationBody = notificationBody;
    this.notificationId = notificationId;
    this.notificiationStatus = notificiationStatus;
    this.notificationTitle = notificationTitle;
    this.userId = userId;
  }
}

export default notification;
