const pack = require('./package.json')
const config = {
  db: process.env.SIRS_DB || 'postgres://root:rootroot@localhost:5432/sirs',
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
  }
}

module.exports = config
