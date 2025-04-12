const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();

// Client Email Configuration
// Add or modify email addresses here
const CLIENT_EMAILS = [
  'pathlabs99@gmail.com',
  'waelttfphone@gmail.com', // Main recipient
  // Add more email addresses below
  // 'person@bibbulmun.org.au',
  // 'another@bibbulmun.org.au'
];

// Use the detailed CORS configuration
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for photo attachments

// Create rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all routes
app.use(limiter);

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'pathlabs99@gmail.com',
    pass: 'xcgb ofay htnb ulim'
  }
});

// Helper function to get color for issue type
const getIssueTypeColor = (issueType) => {
  const colorMap = {
    'Fallen Tree': '#8D6E63',
    'Damaged Trail/Erosion': '#795548',
    'Damaged/Missing Sign': '#FF9800',
    'Damaged Shelter/Facility': '#F57C00',
    'Water Source Issue': '#03A9F4',
    'Wildlife Concern': '#4CAF50',
    'Overgrown Vegetation': '#8BC34A',
    'Other': '#9E9E9E'
  };
  
  return colorMap[issueType] || '#9E9E9E';
};

// Helper function to get color for urgency level
const getUrgencyColor = (urgency) => {
  const colorMap = {
    'low': '#4CAF50',
    'medium': '#FF9800',
    'high': '#F44336'
  };
  
  return colorMap[urgency] || '#FF9800';
};

// Helper function to generate random alphanumeric string
const generateRandomString = (length = 4) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length },
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

// Get issue type code for report ID
const getIssueTypeCode = (issueType) => {
  const codeMap = {
    'Wildlife Concern': 'WILD',
    'Water Source Issue': 'WATR',
    'Fallen Tree': 'TREE',
    'Damaged/Missing Sign': 'SIGN',
    'Damaged Trail/Erosion': 'EROS',
    'Damaged Shelter/Facility': 'SHEL',
    'Overgrown Vegetation': 'VEGE',
    'Other': 'OTHR'
  };
  return codeMap[issueType] || 'OTHR';
};

// Generate report ID function with new format
const generateReportId = (type, issueType = null, urgency = null) => {
  const now = new Date();
  
  // Format date as YYYYMMDD
  const datePart = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  
  // Format time as HHMMSS
  const timePart = now.getHours().toString().padStart(2, '0') + 
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  
  const randomPart = generateRandomString();
  
  if (type === 'ISSUE') {
    const typeCode = getIssueTypeCode(issueType);
    const urgencyUpper = urgency ? urgency.toUpperCase() : 'MEDIUM';
    return `ISSUE-${typeCode}-${urgencyUpper}-${datePart}-${timePart}-${randomPart}`;
  } else {
    return `SURVEY-${datePart}-${timePart}-${randomPart}`;
  }
};

// Function to convert issue report data to CSV - kept for backward compatibility
const convertReportToCSV = (reportData, coordinates = null) => {
  // Define all possible headers - remove photo as it's handled separately
  const headers = [
    "ReportID",
    "Name",
    "Email",
    "Telephone",
    "DateObserved",
    "IssueType", 
    "Urgency",
    "Latitude",
    "Longitude",
    "Accuracy",
    "LocationDescription",
    "Comments",
    "SubmissionDate",
    "HasPhoto"
  ];
  
  // Create values array matching the headers
  const values = [
    reportData.reportId || "",
    reportData.name || "",
    reportData.email || "",
    reportData.telephone || "",
    reportData.dateObserved || "",
    reportData.issueType || "",
    reportData.urgency || "",
    coordinates ? coordinates.latitude : "",
    coordinates ? coordinates.longitude : "",
    coordinates ? coordinates.accuracy : "",
    reportData.location || "",
    reportData.comments || "",
    new Date().toLocaleString('en-AU', {
      timeZone: 'Australia/Perth',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }) + ' AWST',
    reportData.photo ? "Yes" : "No"
  ];
  
  // Escape commas, quotes, and newlines in CSV values
  const escapedValues = values.map((value) => {
    // Convert to string first
    let str = String(value);

    // Check if value needs to be quoted
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      // Replace quotes with double quotes for escaping
      str = str.replace(/"/g, '""');
      // Enclose in quotes
      return `"${str}"`;
    }

    return str;
  });
  
  // Combine into CSV
  return `${headers.join(",")}\n${escapedValues.join(",")}`;
};

// Create clean HTML content for issue reports
const createIssueHTML = (issueData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>TrackMate Issue Report</title>
      <style>
        @keyframes dash {
          to {
            stroke-dashoffset: -500;
          }
        }

        .decorative-path {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          opacity: 0.5;
        }

        .decorative-path path {
          stroke: rgb(255, 99, 71);
          stroke-width: 1.5;
          fill: none;
          vector-effect: non-scaling-stroke;
        }

        .decorative-path .trail {
          opacity: 0.15;
          stroke-dasharray: 8;
          animation: dash 60s linear infinite;
        }

        .decorative-path .trail-markers {
          opacity: 0.25;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 1 20;
          animation: dash 45s linear infinite reverse;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4; color: #1a1a1a;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px; position: relative; overflow: hidden;">
            <svg class="decorative-path" viewBox="0 0 600 400" preserveAspectRatio="none">
              <path class="trail" d="M0,300 Q150,280 300,200 T600,100" />
              <path class="trail-markers" d="M0,300 Q150,280 300,200 T600,100" />
            </svg>

            <!-- Header -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="vertical-align: middle;">
                        <img src="https://i.imgur.com/ZKb7ZrE.png" alt="TrackMate Logo" width="24" height="24" style="display: block;" />
                      </td>
                      <td style="vertical-align: middle; padding-left: 8px;">
                        <span style="font-size: 16px; font-weight: 600; color: #1a1a1a;">TrackMate Issue Report</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Title Section -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
              <tr>
                <td style="padding-bottom: 4px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1a1a;">Issue Report</h1>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #64748b;">A new issue has been reported via the TrackMate app</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin: 0; font-family: monospace; font-size: 12px; color: #64748b;">${issueData.reportId || 'Not specified'}</p>
                </td>
              </tr>
            </table>

            <!-- Issue Type & Urgency -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; margin-right: 8px;">
                    <tr>
                      <td style="background-color: #fee2e2; padding: 2px 10px; border-radius: 9999px;">
                        <span style="color: #991b1b; font-size: 12px; font-weight: 500;">${issueData.issueType || 'Not specified'}</span>
                      </td>
                    </tr>
                  </table>
                  <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block;">
                    <tr>
                      <td style="background-color: #fef3c7; padding: 2px 10px; border-radius: 9999px;">
                        <span style="color: #92400e; font-size: 12px; font-weight: 500;">${issueData.urgency || 'Not specified'}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Reporter Details -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
              <tr>
                <td style="padding: 16px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 12px;">
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Reporter Details</h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding-bottom: 6px;">
                              <span style="color: #64748b; font-size: 14px;">Name:</span>
                              <span style="color: #1a1a1a; margin-left: 8px; font-size: 14px;">${issueData.name || 'Not provided'}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 6px;">
                              <span style="color: #64748b; font-size: 14px;">Email:</span>
                              <span style="color: #1a1a1a; margin-left: 8px; font-size: 14px;">${issueData.email || 'Not provided'}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span style="color: #64748b; font-size: 14px;">Date Observed:</span>
                              <span style="color: #1a1a1a; margin-left: 8px; font-size: 14px;">${issueData.dateObserved || 'Not provided'}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Location Details -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px;">
              <tr>
                <td style="padding: 16px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 12px;">
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Location Details</h3>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 8px;">
                        <a href="${issueData.locationUrl || '#'}" style="color: #2563eb; text-decoration: underline; font-size: 14px;">${issueData.locationUrl ? 'View on Google Maps' : 'Location not available'}</a>
                        ${issueData.location ? `<p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">${issueData.location}</p>` : ''}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin: 0; color: #64748b; font-size: 12px;">GPS Accuracy: ${issueData.accuracy ? `±${Math.round(issueData.accuracy)}m` : 'Not available'}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Issue Description -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 12px;">
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Issue Description</h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin: 0; color: #1a1a1a; font-size: 14px;">${issueData.description || 'No description provided'}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
              <tr>
                <td style="text-align: center; color: #64748b; font-size: 12px;">
                  <p style="margin: 0; margin-bottom: 4px;">Thank you for helping us maintain and protect the Bibbulmun Track.</p>
                  <p style="margin: 0; opacity: 0.7;">Bibbulmun Track Foundation &copy; ${new Date().getFullYear()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Create clean HTML content for survey emails
const createSurveyHTML = (surveyData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>TrackMate Survey Report</title>
      <style>
        @keyframes dash {
          to {
            stroke-dashoffset: -500;
          }
        }

        .decorative-path {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          opacity: 0.5;
        }

        .decorative-path path {
          stroke: rgb(255, 99, 71);
          stroke-width: 1.5;
          fill: none;
          vector-effect: non-scaling-stroke;
        }

        .decorative-path .trail {
          opacity: 0.15;
          stroke-dasharray: 8;
          animation: dash 60s linear infinite;
        }

        .decorative-path .trail-markers {
          opacity: 0.25;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 1 20;
          animation: dash 45s linear infinite reverse;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4; color: #1a1a1a;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px; position: relative; overflow: hidden;">
            <svg class="decorative-path" viewBox="0 0 600 400" preserveAspectRatio="none">
              <path class="trail" d="M0,300 Q150,280 300,200 T600,100" />
              <path class="trail-markers" d="M0,300 Q150,280 300,200 T600,100" />
            </svg>

            <!-- Header -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="vertical-align: middle;">
                        <img src="https://i.imgur.com/ZKb7ZrE.png" alt="TrackMate Logo" width="24" height="24" style="display: block;" />
                      </td>
                      <td style="vertical-align: middle; padding-left: 8px;">
                        <span style="font-size: 16px; font-weight: 600; color: #1a1a1a;">TrackMate Survey Report</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Title Section -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
              <tr>
                <td style="padding-bottom: 4px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1a1a;">Survey Submission</h1>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #64748b;">A new survey has been submitted via the TrackMate app</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin: 0; font-family: monospace; font-size: 12px; color: #64748b;">${surveyData.reportId || 'Not specified'}</p>
                </td>
              </tr>
            </table>

            <!-- Survey Data Section -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 12px;">
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Survey Data</h3>
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center;">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik05IDE3di0ybTMgMnYtNG0zIDR2LTZtMiAxMEg3YTIgMiAwIDAxLTItMlY1YTIgMiAwIDAxMi0yaDUuNTg2YTEgMSAwIDAxLjcwNy4yOTNsNS40MTQgNS40MTRhMSAxIDAgMDEuMjkzLjcwN1YxOWEyIDIgMCAwMS0yIDJ6IiBzdHJva2U9IiM2NDc0OGIiLz48L3N2Zz4=" alt="CSV" style="margin-bottom: 8px;" />
                        <p style="margin: 0; color: #64748b; font-size: 14px;">The full survey data is available in the attached CSV file.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
              <tr>
                <td style="text-align: center; color: #64748b; font-size: 12px;">
                  <p style="margin: 0; margin-bottom: 4px;">Thank you for helping us maintain and protect the Bibbulmun Track.</p>
                  <p style="margin: 0; opacity: 0.7;">Bibbulmun Track Foundation &copy; ${new Date().getFullYear()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Test the email connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with email setup:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Handle issue report submission
app.post('/send-report', async (req, res) => {
  console.log('Received report request');
  
  try {
    // Check if it's the old format (CSV) or new format (JSON object)
    if (req.body.csvData && req.body.fileName) {
      // Old CSV format
      const { csvData, fileName } = req.body;
      
      // Generate a report ID for old-format submissions
      const reportId = generateReportId('ISSUE');
      
      const mailOptions = {
        from: 'TrackMate <pathlabs99@gmail.com>',
        to: CLIENT_EMAILS.join(', '),
        subject: `${reportId} - TrackMate Issue Report`,
        text: 'Please find attached the issue report.',
        attachments: [
          {
            filename: fileName,
            content: csvData,
            contentType: 'text/csv'
          }
        ]
      };
      
      // Add photo if available (old format)
      if (req.body.photo) {
        const matches = req.body.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const type = matches[1];
          const data = matches[2];
          const buffer = Buffer.from(data, 'base64');
          
          mailOptions.attachments.push({
            filename: `${reportId}_photo.${type.split('/')[1] || 'jpg'}`,
            content: buffer,
            contentType: type
          });
        }
      }
      
      await transporter.sendMail(mailOptions);
    } else {
      // New JSON format
      const reportData = req.body;
      
      // Get or generate report ID
      const reportId = reportData.reportId || generateReportId('ISSUE', reportData.issueType, reportData.urgency);
      reportData.reportId = reportId; // Ensure reportId is set
      
      // Extract coordinates if present
      const coordinates = reportData.coordinates || null;
      
      // Create HTML content
      const htmlContent = createIssueHTML({
        reportId: reportData.reportId,
        issueType: reportData.issueType,
        urgency: reportData.urgency,
        name: reportData.name,
        email: reportData.email,
        dateObserved: reportData.dateObserved,
        location: coordinates ? `${coordinates.latitude}, ${coordinates.longitude}` : reportData.location,
        locationUrl: coordinates ? `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}` : null,
        accuracy: coordinates ? coordinates.accuracy : null,
        description: reportData.comments
      });
      
      // Create plain text fallback for email clients that don't support HTML
      const textContent = `
TrackMate Issue Report
Report ID: ${reportId}

Reporter: ${reportData.name} (${reportData.email})
Phone: ${reportData.telephone || 'Not provided'}
Date Observed: ${reportData.dateObserved || 'Not specified'}
Issue Type: ${reportData.issueType || 'Not specified'}
Urgency: ${reportData.urgency || 'Medium'}

Location Details:
${coordinates ? `GPS: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)} (±${Math.round(coordinates.accuracy)}m)` : 'No GPS coordinates provided'}
Description: ${reportData.location || 'Not provided'}

Issue Description:
${reportData.comments}

Photo: ${reportData.photo ? 'Included as attachment' : 'No photo provided'}
Submission Date: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })} AWST
`;
      
      // Create mail options
      const mailOptions = {
        from: 'TrackMate <pathlabs99@gmail.com>',
        to: CLIENT_EMAILS.join(', '),
        subject: `${reportId} - TrackMate Issue Report`,
        text: textContent,
        html: htmlContent,
        attachments: []
      };

      // Add photo if available
      if (reportData.photo) {
        // Extract base64 data
        const matches = reportData.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const type = matches[1];
          const data = matches[2];
          const buffer = Buffer.from(data, 'base64');
          
          mailOptions.attachments.push({
            filename: `${reportId}_photo.${type.split('/')[1] || 'jpg'}`,
            content: buffer,
            contentType: type
          });
        }
      }
      
      await transporter.sendMail(mailOptions);
    }
    
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Report sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Failed to send report', 
      error: error.message 
    });
  }
});

// Route to handle survey submission
app.post('/send-survey', async (req, res) => {
  console.log('Received survey submission request');
  
  try {
    // Check if it's the new format with reportId field
    if (req.body.reportId) {
      const surveyData = req.body;
      const reportId = surveyData.reportId;
      
      // Get CSV data if it exists
      const csvData = surveyData.csvData || '';
      
      // Create HTML content for email
      const htmlContent = createSurveyHTML({
        reportId: reportId
      });
      
      const mailOptions = {
        from: 'TrackMate <pathlabs99@gmail.com>',
        to: CLIENT_EMAILS.join(', '),
        subject: `${reportId} - TrackMate Survey Submission`,
        text: `Survey submission from TrackMate app on ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })} AWST.`,
        html: htmlContent,
        attachments: [
          {
            filename: `${reportId}_survey.csv`,
            content: csvData,
            contentType: 'text/csv'
          }
        ]
      };
      
      await transporter.sendMail(mailOptions);
    } else {
      // Legacy format
      const { csvData, fileName } = req.body;
      const reportId = generateReportId('SURVEY');
      
      // Create basic HTML content
      const htmlContent = createSurveyHTML({ reportId });
      
      const mailOptions = {
        from: 'TrackMate <pathlabs99@gmail.com>',
        to: CLIENT_EMAILS.join(', '),
        subject: `${reportId} - TrackMate Survey Submission`,
        text: `Survey submission from TrackMate app on ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })} AWST.`,
        html: htmlContent,
        attachments: [
          {
            filename: fileName || `${reportId}_survey.csv`,
            content: csvData,
            contentType: 'text/csv'
          }
        ]
      };
      
      await transporter.sendMail(mailOptions);
    }
    
    console.log('Survey email sent successfully');
    res.status(200).json({ message: 'Survey sent successfully' });
  } catch (error) {
    console.error('Error sending survey email:', error);
    res.status(500).json({ 
      message: 'Failed to send survey', 
      error: error.message 
    });
  }
});

// Test endpoint to verify server is running
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
  console.log(`Server running on port ${PORT}`);
});