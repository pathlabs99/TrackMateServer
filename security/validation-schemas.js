const Joi = require('joi');

// Coordinates schema
const coordinatesSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  accuracy: Joi.number().min(0).optional(),
  altitude: Joi.number().optional(),
  altitudeAccuracy: Joi.number().optional(),
  heading: Joi.number().optional(),
  speed: Joi.number().optional()
}).allow(null).optional();

// Issue report schema
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

// Survey schema
const surveySchema = Joi.object({
  csvData: Joi.string().required(),
  reportId: Joi.any(),
  fileName: Joi.string().optional()
}).unknown(true);

// Valid survey fields
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
