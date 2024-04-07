class chatMessages {
  constructor(id, chatId, senderId, message, dateCreated, seen) {
    this.id = id;
    this.chatId = chatId;
    this.senderId = senderId;
    this.message = message;
    this.dateCreated = dateCreated;
    this.seen = seen;
  }
}

export default chatMessages;
