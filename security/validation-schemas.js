/**
 * @fileoverview Validation schemas for TrackMate Server input validation
 * @author Wael
 */

const Joi = require('joi');

/**
 * @constant {Object} coordinatesSchema
 * @description Joi schema for validating GPS coordinates and related data
 * @property {number} latitude - Latitude between -90 and 90 degrees
 * @property {number} longitude - Longitude between -180 and 180 degrees
 * @property {number} [accuracy] - Optional accuracy in meters
 * @property {number} [altitude] - Optional altitude in meters
 * @property {number} [altitudeAccuracy] - Optional altitude accuracy in meters
 * @property {number} [heading] - Optional heading in degrees
 * @property {number} [speed] - Optional speed in meters per second
 */
const coordinatesSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  accuracy: Joi.number().min(0).optional(),
  altitude: Joi.number().optional(),
  altitudeAccuracy: Joi.number().optional(),
  heading: Joi.number().optional(),
  speed: Joi.number().optional()
}).allow(null).optional();

/**
 * @constant {Object} issueReportSchema
 * @description Joi schema for validating trail issue reports
 * @property {string} name - Reporter's name
 * @property {string} [email] - Optional email address
 * @property {string} [telephone] - Optional telephone number
 * @property {string} [dateObserved] - Optional date when issue was observed
 * @property {string} issueType - Type of issue (must be one of predefined types)
 * @property {string} urgency - Issue urgency level (low/medium/high)
 * @property {string} [location] - Optional location description
 * @property {string} [comments] - Optional additional comments
 * @property {string|Object} [photo] - Optional photo (string or object)
 * @property {Object} [coordinates] - Optional GPS coordinates
 * @property {string} [type] - Optional type (mobile app specific)
 * @property {boolean} [hasPhoto] - Optional has photo flag (mobile app specific)
 * @property {string} [fileName] - Optional file name (mobile app specific)
 * @property {*} [reportId] - Optional report ID (server-generated)
 * @property {*} [submissionDate] - Optional submission date (server-generated)
 * @property {*} [timestamp] - Optional timestamp (mobile app specific)
 * @property {Object} [deviceInfo] - Optional device information (mobile app specific)
 * @property {string} [appVersion] - Optional app version (mobile app specific)
 * @property {Object} [emailOptions] - Optional email options (email related)
 */
const issueReportSchema = Joi.object({
  // Basic fields
  name: Joi.string().required(),
  email: Joi.string().allow('', null).optional(),
  telephone: Joi.string().allow('', null).optional(),
  dateObserved: Joi.string().allow('', null).optional(),
  
  // Strict validation for issueType and urgency
  issueType: Joi.string().valid(
    'Fallen Tree',
    'Damaged Trail/Erosion',
    'Damaged/Missing Sign',
    'Damaged Shelter/Facility',
    'Water Source Issue',
    'Wildlife Concern',
    'Overgrown Vegetation',
    'Other'
  ).required(),
  
  urgency: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
    .lowercase(),
  
  // Other fields
  location: Joi.string().allow('', null).optional(),
  comments: Joi.string().allow('', null).optional(),
  photo: Joi.alternatives().try(
    Joi.string(),
    Joi.any().allow(null, '')
  ).optional(),
  
  // Location data
  coordinates: coordinatesSchema,
  
  // Mobile app specific fields
  type: Joi.string().optional(),
  hasPhoto: Joi.boolean().optional(),
  fileName: Joi.string().optional(),
  
  // Server-generated fields
  reportId: Joi.any(),
  submissionDate: Joi.any(),
  
  // Additional mobile app fields
  timestamp: Joi.any().optional(),
  deviceInfo: Joi.object().unknown(true).optional(),
  appVersion: Joi.string().optional(),
  
  // Email related fields
  emailOptions: Joi.object({
    to: Joi.string().optional(),
    from: Joi.string().optional(),
    subject: Joi.string().optional(),
    text: Joi.string().optional(),
    html: Joi.string().optional(),
    attachments: Joi.array().items(Joi.any()).optional()
  }).optional()
}).unknown(true);

/**
 * @constant {Object} surveySchema
 * @description Joi schema for validating survey data
 * @property {string} csvData - CSV data
 * @property {*} [reportId] - Optional report ID
 * @property {string} [fileName] - Optional file name
 */
const surveySchema = Joi.object({
  csvData: Joi.string().required(),
  reportId: Joi.any(),
  fileName: Joi.string().optional()
}).unknown(true);

/**
 * @constant {Object} VALID_SURVEY_FIELDS
 * @description Valid survey fields
 * @property {string[]} trackSection - Valid track sections
 * @property {string[]} trackCondition - Valid track conditions
 * @property {string[]} signage - Valid signage options
 * @property {string[]} facilities - Valid facilities options
 */
const VALID_SURVEY_FIELDS = {
  trackSection: [
    'Northern Terminus to Kalamunda',
    'Kalamunda to Brookton Highway',
    'Brookton Highway to Albany Highway',
    'Albany Highway to North Bannister',
    'North Bannister to Dwellingup',
    'Dwellingup to Harvey-Quindanning Rd',
    'Harvey-Quindanning Rd to Collie',
    'Collie to Balingup',
    'Balingup to Pemberton',
    'Pemberton to Walpole',
    'Walpole to Denmark',
    'Denmark to Albany'
  ],
  trackCondition: ['Excellent', 'Good', 'Fair', 'Poor'],
  signage: ['Excellent', 'Good', 'Fair', 'Poor'],
  facilities: ['Excellent', 'Good', 'Fair', 'Poor']
};

module.exports = {
  coordinatesSchema,
  issueReportSchema,
  surveySchema,
  VALID_SURVEY_FIELDS
};
