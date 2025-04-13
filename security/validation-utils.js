// Photo validation helper
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
const sanitizeEmailField = (field) => {
  if (!field) return '';
  return String(field)
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/[<>]/g, '')
    .trim();
};

// Survey CSV validation
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
