/**
 * @fileoverview Utility functions for input validation and sanitization
 * @author Wael
 */

// Photo validation helper
/**
 * @function validatePhoto
 * @description Validates a photo upload ensuring it meets format and size requirements
 * @param {string|null} photo - Base64 encoded photo string or null
 * @returns {Object} Validation result
 * @returns {boolean} result.valid - Whether the photo is valid
 * @returns {string} [result.error] - Error code if invalid
 * @returns {string} [result.message] - Error message if invalid
 * @returns {string} [result.type] - Image type if valid (jpeg|png|jpg)
 * @returns {string} [result.data] - Base64 data if valid
 */
const validatePhoto = (photo) => {
  if (!photo) return { valid: true };

  if (typeof photo !== 'string') {
    return {
      valid: false,
      error: 'INVALID_FORMAT',
      message: 'Photo must be a base64 string'
    };
  }

  const matches = photo.match(/^data:image\/(jpeg|png|jpg);base64,(.+)$/);
  if (!matches) {
    return {
      valid: false,
      error: 'INVALID_FORMAT',
      message: 'Photo must be in JPEG or PNG format'
    };
  }

  const base64Data = matches[2];
  const sizeInBytes = Buffer.from(base64Data, 'base64').length;
  const sizeInMB = sizeInBytes / (1024 * 1024);

  if (sizeInMB > 10) {
    return {
      valid: false,
      error: 'FILE_TOO_LARGE',
      message: 'Photo size must not exceed 10MB'
    };
  }

  return {
    valid: true,
    type: matches[1],
    data: base64Data
  };
};

// Email field sanitization
/**
 * @function sanitizeEmailField
 * @description Sanitizes email field content by removing newlines and HTML tags
 * @param {string|null} field - Email field content to sanitize
 * @returns {string} Sanitized email field content
 */
const sanitizeEmailField = (field) => {
  if (!field) return '';
  return String(field)
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/[<>]/g, '')
    .trim();
};

// Survey CSV validation
/**
 * @function validateSurveyCSV
 * @description Validates CSV data format for survey submissions
 * @param {string} csvData - CSV data to validate
 * @returns {boolean} True if CSV is valid, false otherwise
 * @throws {Error} If CSV data is empty or has insufficient data in rows
 */
const validateSurveyCSV = (csvData) => {
  try {
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    if (lines.length < 1) {
      throw new Error('CSV data is empty');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["'](.*)["']$/, '$1'));
    
    if (lines.length > 1) {
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^["'](.*)["']$/, '$1'));
        if (values.length < headers.length) {
          throw new Error(`Row ${i} has insufficient data`);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Survey validation error:', error);
    return false;
  }
};

module.exports = {
  validatePhoto,
  sanitizeEmailField,
  validateSurveyCSV
};
