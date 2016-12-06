const pack = require('./package.json')
const config = {
  db: process.env.SIRS_DB || 'postgres://root:rootroot@localhost:5432/sirs',
  uri: process.env.SIRS_URI || 'http://localhost:3000',
  host: process.env.SIRS_HOST || 'localhost',
  port: process.env.SIRS_PORT || 3000,
  bunyan: {
    name: pack.name,
    streams: [
      {
        level: process.env.SIRS_LOG_LEVEL || 'trace',
        stream: process.stdout
      }
    ]
  },
  mailgun: {
    apiKey: process.env.SIRS_MAILGUN_API_KEY || 'mailgun-key',
    domain: process.env.SIRS_MAILGUN_DOMAIN || 'sandboxe6711a8c08c140469692a47b0d7c9cce.mailgun.org'
  },
  loginCodes: {
    ttl: process.env.SIRS_LOGIN_CODES_TTL || 5 // Time to live in minutes
  },
  sessions: {
    ttl: process.env.SIRS_SESSIONS_TTL || 5 * 60 * 60 * 1000, // Time to live in ms
    password: process.env.SIRS_SESSIONS_PASSWORD || 'THIS NEEDS TO BE A LONG STRING WITH MIN 32 CHARS',
    cookie: process.env.SIRS_SESSIONS_COOKIE_NAME || 'session', // Session cookie name
    redirectTo: '/login',
    isSecure: process.env.SIRS_SESSIONS_IS_SECURE || false
    // domain: process.env.SIRS_SESSIONS_DOMAIN
  }
}

module.exports = config
