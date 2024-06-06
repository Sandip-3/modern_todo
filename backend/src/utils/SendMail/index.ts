import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import env from '../../config/env';

const sendMail = async (req: Request, res: Response, email : string , code : string) => {
  try {


    const transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: 465,
      secure: true,
      auth: {
        user: env.emailUsername,
        pass: env.emailPassword,
      },
    });

    const mailOptions = {
      from: '"TODO Application" <mail@todo.com>',
      to: `${email}`,
      subject: 'Login Code',
      text: `Your Login Code is: ${code}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);


    res.send(`Email sent successfully use email code to verify.`);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
};

export default sendMail;
