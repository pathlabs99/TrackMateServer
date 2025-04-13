const CLIENT_EMAILS = process.env.EMAIL_RECIPIENT 
  ? process.env.EMAIL_RECIPIENT.split(',').map(email => email.trim()) 
  : (() => {
      throw new Error('EMAIL_RECIPIENT environment variable is required');
    })();

const emailConfig = {
  service: 'gmail', // You can make this configurable if needed
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

const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS || (() => {
    console.warn('ALLOWED_ORIGINS not set, using default "*"');
    return '*';
  })(),
  methods: ['POST', 'GET'], // You could make this configurable
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Rest of your configuration remains the same...
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
