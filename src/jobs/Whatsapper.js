import twilio from 'twilio';
import config from '../config/config.js';
import logger from '../config/logger.js';

class Whatsapper {
  constructor() {
    const accountSid = config.twilio.accountSid;
    const authToken = config.twilio.authToken;

    this.client = twilio(accountSid, authToken);
  }

  async sendOrderNoticeToAdministrator(user) {
    try {
      const message = await this.client.messages.create({
        body: `New order by ${user.name} - ${user.username}`,
        from: `whatsapp:${config.twilio.whatsappFrom}`,
        to: `whatsapp:${config.twilio.adminPhone}`,
      });
      logger.info(message);
    } catch (error) {
      logger.error(error);
    }
  }
}

export default Whatsapper;
