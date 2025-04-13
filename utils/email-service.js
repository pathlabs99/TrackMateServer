const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/config');
const { createIssueHTML } = require('../config/issue-email-template');
const { createSurveyHTML } = require('../config/survey-email-template');

const transporter = nodemailer.createTransport(emailConfig);

// Verify email connection
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email connection verified successfully');
    return true;
  } catch (error) {
    console.log('Error with email setup:', error);
    return false;
  }
};

// Send issue report email
const sendIssueReport = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending issue report:', error);
    throw error;
  }
};

// Send survey report email
const sendSurveyReport = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending survey report:', error);
    throw error;
  }
};

module.exports = {
  verifyEmailConnection,
  sendIssueReport,
  sendSurveyReport
};
