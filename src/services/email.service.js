const sgMail = require('@sendgrid/mail');
const config = require('../config/config');
const logger = require('../config/logger');

sgMail.setApiKey(config.email.sendGridAPIKey);

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = {
    from: {
      email: config.email.sendGridFrom,
      name: config.email.sendGridFromName,
    },
    to,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    const { message, stack } = err;
    console.error('Sending verification email failed', { message, stack });
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendForgotPasswordEmail = async (emailBody) => {
  const subject = 'Reset your password';
  const text = `Reset your password`;
  const html = `<strong>Your verification code is ${emailBody.code} and it is valid for 30 minutes</strong>`;

  await sendEmail(emailBody.email, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};



module.exports = {
  sendEmail,
  sendForgotPasswordEmail,
  sendVerificationEmail,
};
