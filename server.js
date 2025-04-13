const express = require('express');
const nodemailer = require('nodemailer');

// Import security modules
const { corsMiddleware, rateLimitMiddleware, helmetMiddleware, validateRequest } = require('./security/middleware');
const { issueReportSchema, surveySchema, VALID_SURVEY_FIELDS } = require('./security/validation-schemas');
const { validatePhoto, sanitizeEmailField, validateSurveyCSV } = require('./security/validation-utils');

// Import email templates
const { createIssueHTML } = require('./config/issue-email-template');
const { createSurveyHTML } = require('./config/survey-email-template');

const app = express();

// Apply security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(rateLimitMiddleware);

const { CLIENT_EMAILS } = require('./config/config');
const { getIssueTypeColor, getUrgencyColor, generateReportId, convertReportToCSV } = require('./utils/helpers');
const { verifyEmailConnection, sendIssueReport, sendSurveyReport } = require('./utils/email-service');

// Verify email connection on startup
verifyEmailConnection();

// Handle issue report submission
app.post('/send-report', async (req, res) => {
  console.log('Received report request');
  
  try {
    // Validate request data
    await validateRequest(req.body, issueReportSchema);
    
    const reportData = req.body;
    const reportId = generateReportId('ISSUE', reportData.issueType, reportData.urgency);
    
    // Create HTML content using the template
    const htmlContent = createIssueHTML({
      reportId,
      issueType: reportData.issueType,
      urgency: reportData.urgency,
      name: reportData.name,
      email: reportData.email,
      dateObserved: reportData.dateObserved,
      location: reportData.location,
      coordinates: reportData.coordinates,
      comments: reportData.comments
    });

    const mailOptions = {
      from: 'TrackMate <pathlabs99@gmail.com>',
      to: CLIENT_EMAILS.join(', '),
      subject: `${reportId} - TrackMate Issue Report`,
      html: htmlContent
    };

    // Send the email
    await sendIssueReport(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ 
      message: 'Report sent successfully',
      reportId 
    });

  } catch (error) {
    console.error('Error processing report:', error);
    res.status(500).json({ 
      message: 'Failed to send report', 
      error: error.message 
    });
  }
});

// Handle survey submission
app.post('/send-survey', async (req, res) => {
  console.log('Received survey request');
  
  try {
    // Validate request data
    await validateRequest(req.body, surveySchema);
    
    const surveyData = req.body;
    const reportId = generateReportId('SURVEY');
    
    // Create HTML content using the template
    const htmlContent = createSurveyHTML({
      reportId,
      csvData: surveyData.csvData
    });

    const mailOptions = {
      from: 'TrackMate <pathlabs99@gmail.com>',
      to: CLIENT_EMAILS.join(', '),
      subject: `${reportId} - TrackMate Survey Response`,
      html: htmlContent,
      attachments: [
        {
          filename: `${reportId}_survey.csv`,
          content: surveyData.csvData,
          contentType: 'text/csv'
        }
      ]
    };

    // Send the email
    await sendSurveyReport(mailOptions);
    console.log('Survey email sent successfully');
    res.status(200).json({ 
      message: 'Survey sent successfully',
      reportId 
    });

  } catch (error) {
    console.error('Error processing survey:', error);
    res.status(500).json({ 
      message: 'Failed to send survey', 
      error: error.message 
    });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Root endpoint with basic info
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>TrackMate Server</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
        </style>
      </head>
      <body>
        <h1>TrackMate API Server</h1>
        <p>This server processes issue reports and surveys from the TrackMate mobile application.</p>
        <p>Status: Running</p>
      </body>
    </html>
  `);
});

// Get port from environment variable or use 3001 as default
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});