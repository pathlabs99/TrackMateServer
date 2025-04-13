// Environment variables are handled by Render
const CLIENT_EMAILS = process.env.CLIENT_EMAILS ? 
  process.env.CLIENT_EMAILS.split(',').map(email => email.trim()) :
  ['pathlabs99@gmail.com'];

const emailConfig = {
  service: 'gmail',  
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'pathlabs99@gmail.com',
    pass: process.env.SMTP_PASS || 'xcgb ofay htnb ulim'
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
