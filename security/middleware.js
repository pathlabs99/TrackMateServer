/**
 * @fileoverview Security middleware configurations for TrackMate Server
 * @author Wael
 * @created 2025-04-15
 */

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

/**
 * @constant {string[]} allowedOrigins
 * @description List of allowed origins for CORS. Uses environment variable ALLOWED_ORIGINS if set,
 * otherwise falls back to default development and production origins
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : [
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://localhost:19006',
      'http://localhost:19000',
      'exp://localhost:19000',
      'exp://192.168.1.1:19000',
      'https://trackmate-server-0uvc.onrender.com',
      'https://trackmate-app.onrender.com',
      'https://localhost',
      'http://localhost',
      'capacitor://localhost',
      'ionic://localhost',
      'null'
    ];

/**
 * @constant {Object} corsMiddleware
 * @description CORS configuration middleware with origin validation, methods, and headers setup
 * @author Wael
 */
const corsMiddleware = cors({
  origin: function(origin, callback) {
    if (!origin) {
      console.log('Request with no origin (likely mobile app)');
      return callback(null, true);
    }
    
    console.log('Request origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      if (origin.includes('localhost') || origin.includes('capacitor') || origin.includes('ionic')) {
        console.log('Mobile app origin detected:', origin);
        return callback(null, true);
      }
      
      console.log('Origin not allowed:', origin);
      return callback(new Error('CORS policy violation'), false);
    }
    
    console.log('Origin allowed:', origin);
    return callback(null, true);
  },
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
});

/**
 * @constant {Object} rateLimitMiddleware
 * @description Rate limiting middleware to prevent abuse
 * @author Wael
 * @property {number} windowMs - Time window for rate limiting (15 minutes)
 * @property {number} max - Maximum number of requests per window
 */
const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @constant {Object} helmetMiddleware
 * @description Helmet security middleware configuration with Content Security Policy
 * @author Wael
 */
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

/**
 * @function validateRequest
 * @description Middleware factory for request validation using Joi schemas
 * @author Wael
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    console.log('Validating request from:', req.headers['user-agent']);
    console.log('Request headers:', req.headers);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { error, value } = schema.validate(req.body, {
      stripUnknown: false,
      abortEarly: false,
      allowUnknown: true
    });
    
    if (error) {
      console.error('Validation error details:', {
        error: error.details,
        receivedData: req.body
      });
      return res.status(400).json({
        message: 'Invalid input data',
        details: error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
          type: detail.type
        })),
        receivedData: req.body
      });
    }
    
    console.log('Validation successful');
    next();
  };
};

module.exports = {
  corsMiddleware,
  rateLimitMiddleware,
  helmetMiddleware,
  validateRequest
};
