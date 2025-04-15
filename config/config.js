/**
 * @fileoverview Configuration settings for TrackMate Server on Render.com
 * @author Wael
 * 
 * @NOTES
 * 1. Recipient Email Setup:
 *    IMPORTANT: To change recipient email(s):
 *    - Open Render.com dashboard
 *    - Go to Environment Variables
 *    - Find EMAIL_RECIPIENT variable
 *    - Replace 'pathlabs99@gmail.com' with your email
 *    - Multiple emails: 'email1@domain.com,email2@domain.com'
 * 
 * 2. Sender Email Setup:
 *    To configure Gmail SMTP:
 *    - Open Render.com dashboard
 *    - Go to Environment Variables
 *    - Set EMAIL_USER to your Gmail
 *    - Set EMAIL_PASS to your app password
 *    - To get app password:
 *      a. Gmail Settings > Security > 2-Step Verification
 *      b. App passwords > Generate for 'Mail'
 * 
 * 3. Required Environment Variables:
 *    - EMAIL_RECIPIENT: Comma-separated list of recipient emails
 *    - EMAIL_HOST: SMTP host (default: smtp.gmail.com)
 *    - EMAIL_PORT: SMTP port (default: 587)
 *    - EMAIL_SECURE: Use SSL/TLS (default: false)
 *    - EMAIL_USER: SMTP username (Gmail address)
 *    - EMAIL_PASS: SMTP password (Gmail app password)
 *    - ALLOWED_ORIGINS: Allowed CORS origins
 *    - RATE_LIMIT_WINDOW_MS: Rate limit window in ms (default: 900000)
 *    - RATE_LIMIT_MAX_REQUESTS: Max requests per window (default: 100)
 * 
 */

/**
 * @constant {string[]} CLIENT_EMAILS
 * @description List of email recipients for issue reports and surveys
 */
const CLIENT_EMAILS = process.env.EMAIL_RECIPIENT 
  ? process.env.EMAIL_RECIPIENT.split(',').map(email => email.trim()) 
  : ['pathlabs99@gmail.com'];

/**
 * @constant {Object} emailConfig
 * @description Email service configuration for sending reports
 */
const emailConfig = {
  service: 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || (() => {
      throw new Error('EMAIL_USER environment variable is required');
    })(),
    pass: process.env.EMAIL_PASS || (() => {
      throw new Error('EMAIL_PASS environment variable is required');
    })()
  }
};

/**
 * @constant {Object} corsConfig
 * @description CORS configuration for API access
 */
const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS || (() => {
    console.warn('ALLOWED_ORIGINS not set, using default "*"');
    return '*';
  })(),
  methods: ['POST', 'GET'], 
  credentials: true,
  maxAge: 86400 // 24 hours
};

/**
 * @constant {Object} rateLimitConfig
 * @description Rate limiting settings to prevent API abuse
 */
const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
};

module.exports = {
  CLIENT_EMAILS,
  emailConfig,
  corsConfig,
  rateLimitConfig
};
