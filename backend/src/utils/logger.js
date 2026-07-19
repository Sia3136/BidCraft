const winston = require('winston');

const SENSITIVE_KEYS = new Set([
  'password', 'token', 'otp', 'refreshtoken', 'accesstoken', 'jwt', 
  'cookie', 'session', 'authorization', 'apikey', 'secret', 
  'webhook', 'signature', 'clientsecret'
]);

const redact = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => redact(item));
  }
  
  const redacted = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redact(obj[key]);
      }
    }
  }
  return redacted;
};

const redactSensitive = winston.format((info) => {
  // Recursively redact properties, but don't deeply clone Symbols used by winston
  const infoCopy = { ...info };
  for (const key of Object.keys(infoCopy)) {
    if (key !== 'level' && key !== 'message' && key !== 'timestamp') {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        infoCopy[key] = '[REDACTED]';
      } else if (typeof infoCopy[key] === 'object') {
        infoCopy[key] = redact(infoCopy[key]);
      }
    }
  }
  return infoCopy;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    redactSensitive(),
    winston.format.json()
  ),
  defaultMeta: { service: 'bidcraft-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

module.exports = logger;
