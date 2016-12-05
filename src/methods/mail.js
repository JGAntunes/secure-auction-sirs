const path = require('path')
const mailgun = require('../helpers/mailgun')
const config = require('../../config')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('mail.send', send)
}

module.exports = register

const mailInfo = {
  from: 'SIRS Secure Auction <sirs@secure.fake.auction.org>',
  subject: 'Secure Auction Login Code'
}

function send (loginCode, user, callback) {
  const message = {
    to: user.email,
    text: `Hello!\n
    Follow this url to login in the SIRS secure auction website:
    ${path.join(config.uri, 'login', loginCode)}`
  }
  Object.assign(message, mailInfo)
  mailgun.messages().send(message, callback)
}
