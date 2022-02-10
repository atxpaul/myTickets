import { createTransport } from 'nodemailer';
import config from '../config/config.js';
import logger from '../config/logger.js';

class Mailer {
  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: config.gmail.sender,
        pass: config.gmail.password,
      },
    });
  }

  async sendSignupNotification(newUser) {
    const mailOptions = {
      from: 'myTickets',
      to: config.adminMail,
      subject: 'New Signup',
      html: `<h1>Notice</h1>
<p>There is a new signup in myTickets, welcome new user ${newUser.username}</p>`,
    };
    this.sendEmail(mailOptions);
  }

  async sendNewOrderNotification(user, products) {
    let htmlForProductList = `<ul>`;
    for (let product of products) {
      htmlForProductList = htmlForProductList.concat(
        `<li>${product.title} - ${product.price}</li>`
      );
    }
    htmlForProductList = htmlForProductList.concat(`</ul>`);
    const mailOptions = {
      from: 'myTickets',
      to: config.adminMail,
      subject: `New order by ${user.name} - ${user.username}`,
      html: `<h1>New Order Notification</h1>

${htmlForProductList}`,
    };
    this.sendEmail(mailOptions);
  }

  async sendEmail(mailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(info);
    } catch (error) {
      logger.error(error);
    }
  }
}

export default Mailer;
