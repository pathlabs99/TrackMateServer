const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/config');
const { createIssueHTML, createSurveyHTML } = require('../config/email-templates');

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
const sendIssueReport = async (reportData, recipients, attachments = []) => {
  const mailOptions = {
    from: emailConfig.auth.user,
    to: recipients,
    subject: `TrackMate Issue Report: ${reportData.reportId}`,
    html: createIssueHTML(reportData),
    attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Issue report email sent successfully');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending issue report email:', error);
    throw error;
  }
};

// Send survey report email
const sendSurveyReport = async (surveyData, recipients, attachments = []) => {
  const mailOptions = {
    from: emailConfig.auth.user,
    to: recipients,
    subject: `TrackMate Survey Report: ${surveyData.reportId}`,
    html: createSurveyHTML(surveyData),
    attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Survey report email sent successfully');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending survey report email:', error);
    throw error;
  }
};

module.exports = {
  verifyEmailConnection,
  sendIssueReport,
  sendSurveyReport
};
