const dotenv = require('dotenv');

dotenv.config();

exports.getReorderAlertEmailConfig = () => {
  return {
    mailConfig: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    },
    fromEmail: process.env.EMAIL_FROM,
    toEmail: process.env.EMAIL_TO
  };
};
