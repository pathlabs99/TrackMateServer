// Replace your current createIssueHTML function with this updated version
// that implements the new HTML template design

/**
 * Creates a modern HTML email template for issue reports
 * @param {Object} issueData The issue report data
 * @returns {string} HTML content for the email
 */

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

const getUrgencyColor = (urgency) => {
  const colorMap = {
    'low': '#4CAF50',
    'medium': '#FF9800',
    'high': '#F44336'
  };
  return colorMap[urgency.toLowerCase()] || '#FF9800';
};

const createIssueHTML = (issueData) => {
  const issueTypeColor = getIssueTypeColor(issueData.issueType);
  const urgencyColor = getUrgencyColor(issueData.urgency);
  const coordsDisplay = issueData.coordinates ? 
    `${issueData.coordinates.latitude}, ${issueData.coordinates.longitude}` : 
    'Not provided';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>TrackMate Issue Report</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4; color: #1a1a1a;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <!-- Header -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td width="60%" align="left" style="vertical-align: middle;">
                    <img src="https://i.ibb.co/nqJNfH6Q/Official-Logo-Transparent.png" alt="TrackMate Logo" width="100" style="display: block;" />
                  </td>
                  <td width="40%" align="right" style="vertical-align: middle;">
                    <span style="font-size: 18px; font-weight: 500; color: #333333;">TrackMate</span>
                  </td>
                </tr>
              </table>

              <!-- Title Section -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333333;">Issue Report</h1>
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #666666;">A new issue has been reported via the TrackMate app</p>
                    <p style="margin: 0; font-family: monospace; font-size: 12px; color: #666666;">${issueData.reportId}</p>
                  </td>
                </tr>
              </table>

              <!-- Reporter Details -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f5f5f5; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td colspan="2" style="padding-bottom: 12px;">
                          <h3 style="margin: 0; font-size: 16px; color: #333333;">Reporter Details</h3>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding-bottom: 8px;">
                          <strong style="color: #666666;">Name:</strong><br/>
                          <span style="color: #333333;">${issueData.name || 'Not provided'}</span>
                        </td>
                        <td width="50%" style="padding-bottom: 8px;">
                          <strong style="color: #666666;">Email:</strong><br/>
                          <span style="color: #333333;">${issueData.email || 'Not provided'}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Issue Details -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f5f5f5; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="50%" style="padding-bottom: 12px;">
                          <strong style="color: #666666;">Report ID:</strong><br/>
                          <span style="color: #333333;">${issueData.reportId}</span>
                        </td>
                        <td width="50%" style="padding-bottom: 12px;">
                          <strong style="color: #666666;">Date Observed:</strong><br/>
                          <span style="color: #333333;">${issueData.dateObserved || 'Not provided'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding-bottom: 12px;">
                          <strong style="color: #666666;">Issue Type:</strong><br/>
                          <span style="color: #ffffff; background-color: ${issueTypeColor}; padding: 4px 8px; border-radius: 4px;">${issueData.issueType}</span>
                        </td>
                        <td width="50%" style="padding-bottom: 12px;">
                          <strong style="color: #666666;">Urgency:</strong><br/>
                          <span style="color: #ffffff; background-color: ${urgencyColor}; padding: 4px 8px; border-radius: 4px;">${issueData.urgency}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-bottom: 12px;">
                          <strong style="color: #666666;">Location:</strong><br/>
                          <span style="color: #333333;">${issueData.location || 'Not provided'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-bottom: 12px;">
                          <strong style="color: #666666;">Coordinates:</strong><br/>
                          <span style="color: #333333;">${coordsDisplay}</span>
                          ${issueData.coordinates ? 
                            `<br/><a href="https://www.google.com/maps?q=${issueData.coordinates.latitude},${issueData.coordinates.longitude}" 
                                style="color: #007bff; text-decoration: none; font-size: 12px;">View on Google Maps</a>` 
                            : ''}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <strong style="color: #666666;">Comments:</strong><br/>
                          <span style="color: #333333; white-space: pre-wrap;">${issueData.comments || 'No comments provided'}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Photo Note -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f5f5f5; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <p style="margin: 0; color: #666666;">
                      <strong>Photo Attachment:</strong> ${issueData.photo ? 'Included with this report' : 'No photo provided'}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
                <tr>
                  <td style="text-align: center; color: #666666; font-size: 12px;">
                    <p style="margin: 0; margin-bottom: 4px;">Thank you for helping us maintain and protect the Bibbulmun Track.</p>
                    <p style="margin: 0; opacity: 0.7;">Bibbulmun Track Foundation &copy; ${new Date().getFullYear()}</p>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = {
  createIssueHTML
};