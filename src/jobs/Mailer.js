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

    async sendNewOrderNotification(username, products) {
        let total = 0;
        let htmlForProductList = '';
        for (let product of products) {
            htmlForProductList = htmlForProductList.concat(
                `<tr><td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td></tr>`
            );
            total = total + product.price * product.quantity;
        }
        const mailOptionsToAdmin = {
            from: 'myTickets',
            to: config.adminMail,
            subject: `New order by ${username}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
            <style>
            table, th, td {
            border: 1px solid;
            }
            </style>
            </head>
            <body>
            <h1>New Order Notification</h1>
            <table>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Units</th>
            </tr>
            <tr>

            ${htmlForProductList}
            </tr>
            <tr>
            </tr>
            <tr>
              <td>Total</td>
              <td>${total.toFixed(2)}$</td>
              </tr>
              </table>`,
        };
        this.sendEmail(mailOptionsToAdmin);

        const mailOptionsToCustomer = {
            from: 'myTickets',
            to: username,
            subject: `Your order is on the way, ${username}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
            <style>
            table, th, td {
              border: 1px solid;
            }
            </style>
            </head>
            <body>
            
            <h1>Thanks for your purchase!</h1>

            <p>Your order is on the way, ${username}, in a few days you will recive more updates, stay alert!</p>
            <table>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Units</th>
            </tr>
            <tr>

            ${htmlForProductList}
            </tr>
            <tr>
            </tr>
            <tr>
              <td>Total</td>
              <td>${total.toFixed(2)}$</td>
              </tr>
              </table>`,
        };
        this.sendEmail(mailOptionsToCustomer);
    }

    async sendEmail(mailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Mail has been sent`);
        } catch (error) {
            logger.error(error);
        }
    }
}

export default Mailer;
