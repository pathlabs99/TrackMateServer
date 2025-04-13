require('dotenv').config();

const CLIENT_EMAILS = process.env.CLIENT_EMAILS ? 
  process.env.CLIENT_EMAILS.split(',').map(email => email.trim()) :
  ['pathlabs99@gmail.com'];

const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

const corsConfig = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST', 'GET'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
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
