/**
 * @fileoverview Email service for sending issue reports and surveys
 * @author Marwa
 * 
 * @NOTES
 * 1. Service Setup:
 *    - Uses Nodemailer with Gmail SMTP
 *    - Configuration loaded from config.js
 *    - Auto-verifies connection on startup
 * 
 * 2. Features:
 *    - Sends issue reports with photos
 *    - Sends survey reports with CSV
 *    - HTML templates with responsive design
 * 
 * 3. Error Handling:
 *    - Connection verification
 *    - Detailed error logging
 *    - Error propagation to caller
 */

const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/config');
const { createIssueHTML } = require('../config/issue-email-template');
const { createSurveyHTML } = require('../config/survey-email-template');

/**
 * @constant {Object} transporter
 * @description Nodemailer transport instance configured with email settings
 */
const transporter = nodemailer.createTransport(emailConfig);

/**
 * @function verifyEmailConnection
 * @description Verifies the email service connection is working
 * @returns {Promise<boolean>} True if connection is successful
 */
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

/**
 * @function sendIssueReport
 * @description Sends an issue report email with optional photo attachment
 * @param {Object} mailOptions - Email options including recipients and content
 * @returns {Promise<boolean>} True if email sent successfully
 * @throws {Error} If email sending fails
 */
const sendIssueReport = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending issue report:', error);
    throw error;
  }
};

/**
 * @function sendSurveyReport
 * @description Sends a survey report email with CSV attachment
 * @param {Object} mailOptions - Email options including recipients and content
 * @returns {Promise<boolean>} True if email sent successfully
 * @throws {Error} If email sending fails
 */
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
