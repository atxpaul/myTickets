import twilio from 'twilio';
import config from '../config/config.js';
import logger from '../config/logger.js';

class Sms {
  constructor() {
    const accountSid = config.twilio.accountSid;
    const authToken = config.twilio.authToken;

    this.client = twilio(accountSid, authToken);
  }

  async sendOrderNoticeToCustomer(user) {
    try {
      const message = await this.client.messages.create({
        body: `New order received for ${user.name} - ${user.username}, in process right now!`,
        from: config.twilio.numberFrom,
        to: user.phone,
      });
      logger.info(message);
    } catch (error) {
      logger.error(error);
    }
  }
}

export default Sms;
