import nodemailer from 'nodemailer';
import { getReorderAlertEmailConfig } from '../configuration.js';

export async function sendEmailWithAttachment(toEmail, subject, body, attachmentPath) {
  const { mailConfig, fromEmail } = getReorderAlertEmailConfig();

  const transporter = nodemailer.createTransport(mailConfig);

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    text: body,
    attachments: [
      {
        filename: 'workorder.pdf',
        path: attachmentPath,
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}

