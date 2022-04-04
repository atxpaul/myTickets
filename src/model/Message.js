class Message {
    #username;
    #timestamp;
    #message;
    constructor(username, timestamp, message) {
        this.setUserName(username);
        this.setTimestamp(timestamp);
        this.setMessage(message);
    }

    setUserName(username) {
        if (username) {
            this.username = username;
        } else {
            throw new Error('Username is required');
        }
    }

    setTimestamp(timestamp) {
        if (timestamp) {
            this.timestamp = timestamp;
        } else {
            throw new Error('Timestamp is required');
        }
    }

    setMessage(message) {
        if (message) {
            this.message = message;
        } else {
            throw new Error('Message is required');
        }
    }
}

export default Message;
