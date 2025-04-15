/**
 * @fileoverview Helper utilities for TrackMate Server
 * @author Marwa
 */

// Color mappings
/**
 * @function getIssueTypeColor
 * @description Maps issue types to their corresponding color codes
 * @param {string} issueType - The type of issue
 * @returns {string} Hex color code for the issue type
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

/**
 * @function getUrgencyColor
 * @description Maps urgency levels to their corresponding color codes
 * @param {string} urgency - The urgency level (low/medium/high)
 * @returns {string} Hex color code for the urgency level
 */
const getUrgencyColor = (urgency) => {
  const colorMap = {
    'low': '#4CAF50',
    'medium': '#FF9800',
    'high': '#F44336'
  };
  
  return colorMap[urgency] || '#FF9800';
};

// ID Generation
/**
 * @function generateRandomString
 * @description Generates a random alphanumeric string of specified length
 * @param {number} [length=4] - Length of the random string
 * @returns {string} Random alphanumeric string
 * @private
 */
const generateRandomString = (length = 4) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length },
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

/**
 * @function getIssueTypeCode
 * @description Maps issue types to their corresponding short codes
 * @param {string} issueType - The type of issue
 * @returns {string} Four-letter code for the issue type
 * @private
 */
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

/**
 * @function generateReportId
 * @description Generates a unique report ID based on type, issue type, and urgency
 * @param {string} type - Report type ('ISSUE' or 'SURVEY')
 * @param {string} [issueType] - Type of issue (required for ISSUE type)
 * @param {string} [urgency] - Urgency level (required for ISSUE type)
 * @returns {string} Unique report ID in format TYPE-CODE-URGENCY-DATE-TIME-RANDOM
 */
const generateReportId = (type, issueType = null, urgency = null) => {
  const now = new Date();
  
  const datePart = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  
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

// CSV conversion
/**
 * @function convertReportToCSV
 * @description Converts a report object to CSV format
 * @param {Object} reportData - The report data to convert
 * @param {Object} [coordinates] - Optional GPS coordinates
 * @param {number} coordinates.latitude - Latitude
 * @param {number} coordinates.longitude - Longitude
 * @param {number} coordinates.accuracy - Accuracy in meters
 * @returns {string} CSV formatted string with headers and data
 */
const convertReportToCSV = (reportData, coordinates = null) => {
  const headers = [
    "ReportID", "Name", "Email", "Telephone", "DateObserved",
    "IssueType", "Urgency", "Latitude", "Longitude", "Accuracy",
    "LocationDescription", "Comments", "SubmissionDate", "HasPhoto"
  ];
  
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
  
  const escapedValues = values.map((value) => {
    let str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }
    return str;
  });
  
  return `${headers.join(",")}\n${escapedValues.join(",")}`;
};

module.exports = {
  getIssueTypeColor,
  getUrgencyColor,
  generateReportId,
  convertReportToCSV
};
