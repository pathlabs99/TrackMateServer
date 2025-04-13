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
  // Format coordinates and build Google Maps URL if coordinates exist
  const coords = issueData.coordinates || {};
  const hasCoords = coords && coords.latitude && coords.longitude;
  
  const googleMapsUrl = hasCoords ? 
    `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}` : 
    '#';
  
  const coordsDisplay = hasCoords ? 
    `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}` : 
    'Not available';
  
  const accuracyDisplay = (coords && coords.accuracy) ?
    `±${Math.round(coords.accuracy)}m` :
    'Not available';
  
  // Get report ID
  const reportId = issueData.reportId || 'Not specified';

  // Get urgency information with fallback
  const urgency = issueData.urgency || 'medium';
  const urgencyDisplay = urgency.toUpperCase();
  
  // Get issue type with fallback  
  const issueType = issueData.issueType || 'Other';
  
  // Determine colors for urgency
  let urgencyBgColor, urgencyTextColor, urgencyBorderColor, urgencyShadowColor, urgencyEmoji;
  
  switch(urgency.toLowerCase()) {
    case 'low':
      urgencyBgColor = '#dcfce7'; // light green background
      urgencyBorderColor = '#86efac'; // green border
      urgencyTextColor = '#166534'; // dark green text
      urgencyShadowColor = 'rgba(22, 101, 52, 0.1)';
      urgencyEmoji = '✅';
      break;
    case 'high':
      urgencyBgColor = '#fee2e2'; // light red background
      urgencyBorderColor = '#fca5a5'; // red border
      urgencyTextColor = '#991b1b'; // dark red text
      urgencyShadowColor = 'rgba(153, 27, 27, 0.1)';
      urgencyEmoji = '🚨';
      break;
    default: // medium or anything else
      urgencyBgColor = '#fef3c7'; // light amber background
      urgencyBorderColor = '#fdba74'; // amber border
      urgencyTextColor = '#92400e'; // dark amber text
      urgencyShadowColor = 'rgba(234, 88, 12, 0.1)';
      urgencyEmoji = '⚠️';
  }
  
  // Determine colors for issue type
  let issueTypeBgColor, issueTypeTextColor, issueTypeShadowColor;
  
  switch(issueType) {
    case 'Fallen Tree':
      issueTypeBgColor = '#fee2e2'; // light red
      issueTypeTextColor = '#991b1b'; // dark red
      issueTypeShadowColor = 'rgba(153, 27, 27, 0.1)';
      break;
    case 'Damaged Trail/Erosion':
      issueTypeBgColor = '#e7e5e4'; // light stone
      issueTypeTextColor = '#44403c'; // dark stone
      issueTypeShadowColor = 'rgba(68, 64, 60, 0.1)';
      break;
    case 'Damaged/Missing Sign':
      issueTypeBgColor = '#fef3c7'; // light amber 
      issueTypeTextColor = '#92400e'; // dark amber
      issueTypeShadowColor = 'rgba(146, 64, 14, 0.1)';
      break;
    case 'Damaged Shelter/Facility':
      issueTypeBgColor = '#ffedd5'; // light orange
      issueTypeTextColor = '#9a3412'; // dark orange
      issueTypeShadowColor = 'rgba(154, 52, 18, 0.1)';
      break;
    case 'Water Source Issue':
      issueTypeBgColor = '#dbeafe'; // light blue
      issueTypeTextColor = '#1e40af'; // dark blue
      issueTypeShadowColor = 'rgba(30, 64, 175, 0.1)';
      break;
    case 'Wildlife Concern':
      issueTypeBgColor = '#d1fae5'; // light green
      issueTypeTextColor = '#065f46'; // dark green
      issueTypeShadowColor = 'rgba(6, 95, 70, 0.1)';
      break;
    case 'Overgrown Vegetation':
      issueTypeBgColor = '#ecfccb'; // light lime
      issueTypeTextColor = '#3f6212'; // dark lime
      issueTypeShadowColor = 'rgba(63, 98, 18, 0.1)';
      break;
    default:
      issueTypeBgColor = '#f3f4f6'; // light gray (default)
      issueTypeTextColor = '#4b5563'; // dark gray
      issueTypeShadowColor = 'rgba(75, 85, 99, 0.1)';
  }
    
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
          <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 0; position: relative; overflow: hidden; border: 1px solid #e2e8f0;">
            
            <!-- Header Strip -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="background-color: #FFA725; height: 8px;"></td>
              </tr>
            </table>

            <!-- Content Container -->
            <div style="position: relative; z-index: 1;">
              <!-- Header -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 24px;">
                <tr>
                  <td align="left" width="60%" style="vertical-align: middle;">
                    <img src="https://i.ibb.co/nqJNfH6Q/Official-Logo-Transparent.png" alt="TrackMate Logo" width="100" style="display: block;" />
                  </td>
                  <td align="right" width="40%" style="vertical-align: middle;">
                    <h1 style="margin: 0; font-size: 20px; font-weight: 500; color: #333333;">Issue Report</h1>
                  </td>
                </tr>
              </table>

              <!-- Main Content -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 0 24px 24px;">
                <!-- Title Section -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #333333;">Issue Report</h2>
                    <p style="margin: 0 0 16px 0; color: #64748b;">A new issue has been reported via the TrackMate app</p>
                    <p style="margin: 0; font-family: monospace; font-size: 14px; padding: 8px 12px; background-color: #f8fafc; border-radius: 6px; display: inline-block; color: #64748b;">${reportId}</p>
                  </td>
                </tr>

                <!-- Issue Type and Urgency -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td>
                          <span style="display: inline-block; padding: 6px 12px; background-color: ${urgencyBgColor}; color: ${urgencyTextColor}; border-radius: 6px; font-weight: 500; font-size: 14px; margin-right: 8px;">
                            ${urgencyEmoji} ${urgencyDisplay}
                          </span>
                          <span style="display: inline-block; padding: 6px 12px; background-color: #f8fafc; color: #64748b; border-radius: 6px; font-weight: 500; font-size: 14px;">
                            ${issueType}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Reporter Details -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      <tr>
                        <td style="padding: 20px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 16px; border-bottom: 1px solid #edf2f7;">
                                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333333;">Reporter Details</h3>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 16px;">
                                <p style="margin: 0 0 8px 0; color: #4a5568;">Name: ${issueData.name || 'Not specified'}</p>
                                <p style="margin: 0 0 8px 0; color: #4a5568;">Email: <a href="mailto:${issueData.email}" style="color: #3182ce; text-decoration: none;">${issueData.email}</a></p>
                                <p style="margin: 0; color: #4a5568;">Date Observed: ${issueData.dateObserved || 'Not specified'}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Location Details -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      <tr>
                        <td style="padding: 20px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 16px; border-bottom: 1px solid #edf2f7;">
                                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333333;">Location Details</h3>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 16px;">
                                <p style="margin: 0 0 12px 0;">
                                  <a href="${googleMapsUrl}" style="color: #3182ce; text-decoration: none;" target="_blank">View on Google Maps</a>
                                </p>
                                <p style="margin: 0 0 8px 0; color: #4a5568;">Location: ${issueData.location || 'Not specified'}</p>
                                <p style="margin: 0; font-family: monospace; font-size: 14px; color: #4a5568;">Coordinates: ${coordsDisplay} (${accuracyDisplay})</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Issue Description -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      <tr>
                        <td style="padding: 20px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 16px; border-bottom: 1px solid #edf2f7;">
                                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333333;">Issue Description</h3>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 16px;">
                                <p style="margin: 0; color: #4a5568;">${issueData.comments || 'No description provided'}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Photo Note -->
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0; color: #64748b; font-size: 14px;">
                            <strong style="color: #4a5568;">Note:</strong> If a photo was submitted with this report, you'll find it attached to this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; padding: 24px; border-top: 1px solid #edf2f7;">
                <tr>
                  <td style="text-align: center; color: #4a5568; font-size: 14px;">
                    <p style="margin: 0 0 4px 0; font-weight: 500;">Thank you for helping us maintain and protect the Bibbulmun Track.</p>
                    <p style="margin: 0; color: #718096;">Bibbulmun Track Foundation &copy; ${new Date().getFullYear()}</p>
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

module.exports = { createIssueHTML };