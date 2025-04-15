# TrackMate Server

Backend server for the TrackMate mobile application, handling issue reports and track surveys for trail maintenance.

## Setup

### Prerequisites
- Node.js installed
- npm (Node Package Manager)

### Local Development Setup
1. Navigate to the TrackMateServer directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3001

### Testing the Server
1. Check server status at http://localhost:3001
2. Use the health check endpoint at http://localhost:3001/health
3. Server logs will show in the terminal

## Features

- **Issue Reports Processing**
  - Receives reports from mobile app
  - Handles photo attachments
  - Sends formatted email notifications
  - Generates unique report IDs

- **Track Survey Management**
  - Processes CSV survey data
  - Validates survey fields
  - Sends survey completion emails

- **Security**
  - CORS protection
  - Rate limiting
  - Request validation
  - Helmet security headers

## Local Development

The server uses hardcoded default values for local testing. No environment variables needed.
- Default port: 3001
- All configurations set in `config.js`

## Production Deployment

This application is configured for deployment on Render.com. For configuration details:
1. See `config.js` for required environment variables
2. Configure these in your Render.com dashboard under Environment Variables
3. For deployment assistance, contact the TrackMate team

## API Endpoints

- `POST /send-report`: Submit issue report
- `POST /submit-survey`: Submit track survey
- `GET /health`: Health check
- `GET /`: Server info

## Project Structure

```
TrackMateServer/
├── config/
│   ├── config.js           # Configuration settings
│   ├── issue-email.js      # Issue report email template
│   └── survey-email.js     # Survey email template
├── security/
│   ├── middleware.js       # Security middleware
│   ├── validation-schemas.js# Request validation
│   └── validation-utils.js # Validation helpers
├── utils/
│   ├── helpers.js         # Utility functions
│   └── email-service.js   # Email handling
└── server.js              # Main application
```

## Tech Stack

- Node.js
- Express.js
- Nodemailer
- Joi (validation)
- Helmet (security)

## Authors

- pathlabs Development Team
