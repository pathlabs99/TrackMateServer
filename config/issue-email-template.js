// Replace your current createIssueHTML function with this updated version
// that implements the new HTML template design

/**
 * Creates a modern HTML email template for issue reports
 * @param {Object} issueData The issue report data
 * @returns {string} HTML content for the email
 */
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
    <body style="margin: 0; padding: 16px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4; color: #1a1a1a;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 540px; margin: 0 auto;">
        <tr>
          <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 0; position: relative; overflow: hidden;">
            
            <!-- Header Strip -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="background-color: #FFA725; height: 8px;"></td>
              </tr>
            </table>

            <!-- Content Container -->
            <div style="position: relative; z-index: 1; padding: 16px;">
              <!-- Header -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td width="60%" align="left" style="vertical-align: middle;">
                    <img src="https://example.com/new-logo.png" alt="TrackMate Logo" width="100" style="display: block;" />
                  </td>
                  <td width="40%" align="right" style="vertical-align: middle;">
                    <span style="font-size: 18px; font-weight: 500; color: #333333;">TrackMate</span>
                  </td>
                </tr>
              </table>

              <!-- Title Section - Centered style -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px; text-align: center;">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1a1a;">Issue Report</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px;">
                    <p style="margin: 0; font-size: 15px; color: #64748b;">A new issue has been reported via the TrackMate app</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; font-family: monospace; font-size: 13px; padding: 5px 10px; background-color: rgba(237, 242, 247, 0.6); border-radius: 4px; display: inline-block; color: #64748b;">${reportId}</p>
                  </td>
                </tr>
              </table>

              <!-- Issue Type & Urgency - Modern style with urgency first, no emoji in issue type -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <!-- Urgency Level - First and more prominent -->
                    <div style="display: inline-block; vertical-align: middle; margin-right: 12px;">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background-color: ${urgencyBgColor}; padding: 6px 12px; border-radius: 6px; border: 1px solid ${urgencyBorderColor}; box-shadow: 0 2px 4px ${urgencyShadowColor};">
                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="vertical-align: middle; padding-right: 6px;">
                                  <span style="font-size: 14px;">${urgencyEmoji}</span>
                                </td>
                                <td style="vertical-align: middle;">
                                  <span style="color: ${urgencyTextColor}; font-size: 14px; font-weight: 600; letter-spacing: 0.02em;">${urgencyDisplay}</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- Issue Category - Second with no emoji -->
                    <div style="display: inline-block; vertical-align: middle;">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background-color: ${issueTypeBgColor}; padding: 6px 12px; border-radius: 6px; box-shadow: 0 2px 4px ${issueTypeShadowColor};">
                            <span style="color: ${issueTypeTextColor}; font-size: 14px; font-weight: 500;">${issueType}</span>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Reporter Details -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 12px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px; border-bottom: 1px solid #edf2f7;">
                          <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #333333;">Reporter Details</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 4px;">
                                <span style="color: #64748b; font-size: 13px;">Name:</span>
                                <span style="color: #1a1a1a; margin-left: 8px; font-size: 13px;">${issueData.name || 'Not provided'}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 4px;">
                                <span style="color: #64748b; font-size: 13px;">Email:</span>
                                <span style="color: #1a1a1a; margin-left: 8px; font-size: 13px;">${issueData.email || 'Not provided'}</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style="color: #64748b; font-size: 13px;">Date Observed:</span>
                                <span style="color: #1a1a1a; margin-left: 8px; font-size: 13px;">${issueData.dateObserved || 'Not provided'}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Location Details - Modernized without external images -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 12px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px; border-bottom: 1px solid #edf2f7;">
                          <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #333333;">Location Details</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px; padding-bottom: 8px;">
                          <!-- Map Button -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 8px;">
                            <tr>
                              <td>
                                <a href="${googleMapsUrl}" style="background-color: #f0f4f8; color: #2563eb; text-decoration: none; font-size: 13px; font-weight: 500; padding: 6px 10px; border-radius: 4px; display: inline-block; border: 1px solid #e2e8f0;">
                                  <span style="vertical-align: middle; margin-right: 4px; color: #2563eb; font-weight: bold;">📍</span>
                                  View on Google Maps
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Location Description -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 6px;">
                            <tr>
                              <td style="vertical-align: top; width: 16px; padding-right: 4px;">
                                <span style="font-size: 13px;">📌</span>
                              </td>
                              <td style="vertical-align: top;">
                                <p style="margin: 0; color: #374151; font-size: 13px; line-height: 1.4;">
                                  ${issueData.location || 'Location not specified'}
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- GPS Accuracy -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="vertical-align: top; width: 16px; padding-right: 4px;">
                                <span style="font-size: 13px;">📡</span>
                              </td>
                              <td style="vertical-align: top;">
                                <p style="margin: 0; color: #64748b; font-size: 13px;">
                                  GPS: <span style="color: #374151; font-family: monospace;">${coordsDisplay}</span> (${accuracyDisplay})
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Issue Description -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 12px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px; border-bottom: 1px solid #edf2f7;">
                          <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #333333;">Issue Description</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px;">
                          <p style="margin: 0; color: #1a1a1a; font-size: 13px; line-height: 1.5;">${issueData.comments || 'No description provided'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Footer -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; padding: 16px; border-top: 1px solid #edf2f7; position: relative; z-index: 1;">
              <tr>
                <td style="text-align: center; color: #4a5568; font-size: 12px;">
                  <p style="margin: 0 0 3px 0; font-weight: 500;">Thank you for helping us maintain and protect the Bibbulmun Track.</p>
                  <p style="margin: 0; color: #718096;">Bibbulmun Track Foundation &copy; ${new Date().getFullYear()}</p>
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

module.exports = { createIssueHTML };