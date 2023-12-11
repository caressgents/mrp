import nodemailer from 'nodemailer';

export const alertInventoryReorderLevel = (config, items) => {
  const transporter = nodemailer.createTransport(config.mailConfig);

  const mailOptions = {
    from: config.fromEmail,
    to: config.toEmail,
    subject: 'Reorder Alert For Inventory Items',
    text: generateEmailText(items)
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending reorder alert email:', err);
    } else {
      console.log('Reorder alert email sent successfully:', info);
    }
  });
};

const generateEmailText = (items) => {
  return 'The following inventory items have reached or fallen below their reorder level:\n' +
    items.map(item => ` - ${item.name}: ${item.quantity}`).join('\n');
};

