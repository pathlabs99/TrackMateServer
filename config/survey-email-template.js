const createSurveyHTML = (surveyData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>TrackMate Survey</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4; color: #1a1a1a;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Main Container -->
        <tr>
          <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 0; position: relative; overflow: hidden;">
            
            <!-- Header Strip -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="background-color: #FFA725; height: 8px;"></td>
              </tr>
            </table>
            
            <!-- Logo and Title Header -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 24px 24px 0 24px;">
              <tr>
                <td align="left" width="60%" style="vertical-align: middle;">
                  <img src="https://i.ibb.co/nqJNfH6Q/Official-Logo-Transparent.png" alt="TrackMate Logo" width="100" style="display: block;" />
                </td>
                <td align="right" width="40%" style="vertical-align: middle;">
                  <h1 style="margin: 0; font-size: 20px; font-weight: 500; color: #333333;">TrackMate Survey</h1>
                </td>
              </tr>
            </table>

            <!-- Content Area -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 24px;">
              <!-- Title Section -->
              <tr>
                <td style="padding-bottom: 24px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 24px;">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #333333;">Survey Submission</h2>
                        <p style="margin: 0 0 8px 0; font-size: 16px; color: #64748b;">A new survey has been submitted via the TrackMate app</p>
                        <p style="margin: 0; font-family: monospace; font-size: 14px; padding: 6px 12px; background-color: rgba(237, 242, 247, 0.6); border-radius: 4px; display: inline-block; color: #64748b;">${surveyData.reportId || 'Not specified'}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Survey Data Section -->
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 24px;">
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

            <!-- Footer -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; padding: 24px; border-top: 1px solid #edf2f7;">
              <tr>
                <td style="text-align: center; color: #4a5568; font-size: 14px;">
                  <p style="margin: 0 0 4px 0; font-weight: 500;">Thank you for helping us maintain and protect the Bibbulmun Track.</p>
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

module.exports = { createSurveyHTML };
