
const config = {
  db: process.env.SIRS_DB || 'postgres://root:rootroot@localhost:5432/sirs',
  host: process.env.SIRS_HOST || 'localhost',
  port: process.env.SIRS_PORT || 3000
}

module.exports = config
