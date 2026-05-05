const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 55 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per window
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests too
});

module.exports = rateLimiter;