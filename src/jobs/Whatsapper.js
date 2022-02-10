import twilio from 'twilio';
import config from '../config/config.js';
import logger from '../config/logger.js';

class Whatsapper {
  constructor() {
    this.accountSid = config.twilio.accountSid;
    this.authToken = config.twilio.authToken;

    this.client = twilio(accountSid, authToken);
  }

  async sendOrderNoticeToAdministrator(user) {
    try {
      const message = await client.messages.create({
        body: `New order by ${user.name} - ${user.username}`,
        from: config.twilio.numberFrom,
        to: config.adminPhone,
      });
      logger.info(message);
    } catch (error) {
      logger.error(error);
    }
  }

  async sendOrderNoticeToCustomer(user) {
    try {
      const message = await client.messages.create({
        body: 'Hola soy un SMS desde Node.js!',
        from: config.twilio.numberFrom,
        to: '+541199998888',
      });
      logger.info(message);
    } catch (error) {
      logger.error(error);
    }
  }
}

export default Whatsapper;
