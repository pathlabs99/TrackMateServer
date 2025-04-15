/**
 * @fileoverview Email template for TrackMate survey submissions
 * @author Marwa
 * 
 * @NOTES
 * Developer Handover Notes:
 * 1. Template Structure:
 *    - Responsive HTML email template optimized for survey data
 *    - Uses table-based layout for maximum email client compatibility
 *    - Consistent styling with issue report emails
 * 
 * 2. Maintenance Points:
 *    - Logo URL shared with issue template - update both if changed
 *    - CSV data is automatically formatted and escaped
 *    - Footer year updates dynamically
 */

/**
 * @function createSurveyHTML
 * @description HTML email content for survey submissions
 * @param {Object} surveyData - The survey submission data
 * @returns {string} Complete HTML email template
 */
const createSurveyHTML = (surveyData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TrackMate Survey</title>
    </head>
    <body style="margin: 0; padding: 16px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 540px; margin: 0 auto;">
        <tr>
          <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 0; position: relative; overflow: hidden; border: 1px solid #e2e8f0;">
            
            <!-- Header Strip -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="background-color: #FFA725; height: 8px;"></td>
              </tr>
            </table>

            <!-- Content Container -->
            <div style="position: relative; z-index: 1; border-top: 1px solid #e2e8f0;">
              <!-- Header -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 24px 24px 0 24px;">
                <tr>
                  <td align="left" width="60%" style="vertical-align: middle;">
                    <img src="https://i.ibb.co/nqJNfH6Q/Official-Logo-Transparent.png" alt="TrackMate Logo" width="100" style="display: block; margin-top: 4px;" />
                  </td>
                  <td align="right" width="40%" style="vertical-align: middle;">
                    <h1 style="margin: 0; font-size: 20px; font-weight: 500; color: #333333;">TrackMate Survey</h1>
                  </td>
                </tr>
              </table>

              <!-- Main Content -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 24px;">
                <!-- Title Section -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      <tr>
                        <td>
                          <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #333333;">Survey Submission</h2>
                          <p style="margin: 0; color: #64748b; font-size: 14px;">A new survey response has been submitted through the TrackMate app.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Survey Data Section -->
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      <tr>
                        <td style="padding: 20px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 16px; border-bottom: 1px solid #edf2f7;">
                                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333333;">Survey Data</h3>
                              </td>
                            </tr>
                            <tr>
                              <td style="text-align: center; padding: 20px;">
                                <!-- CSV Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFA725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                <p style="margin: 0; color: #4a5568; font-size: 16px; font-weight: 500;">The full survey data is available in the attached CSV file.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; padding: 16px; border-top: 1px solid #edf2f7; position: relative; z-index: 1;">
                <tr>
                  <td style="text-align: center; color: #4a5568; font-size: 12px;">
                    <p style="margin: 0 0 3px 0; font-weight: 500;">Thank you for helping us improve the Bibbulmun Track.</p>
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

module.exports = { createSurveyHTML };
