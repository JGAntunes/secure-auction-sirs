const path = require('path')
const mailgun = require('../helpers/mailgun')
const config = require('../../config')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('mail.send.login', sendLogin)
  server.method('mail.send.payment', sendPayment)
}

module.exports = register

const mailInfo = {
  from: 'SIRS Secure Auction <sirs@secure.fake.auction.org>',
  subject: 'Secure Auction Code'
}

function sendLogin (loginCode, user, callback) {
  const message = {
    to: user.email,
    text: `Hello!\n
      Follow this url to login in the SIRS secure auction website:
      ${path.join(config.uri, 'login', loginCode)}`
  }
  Object.assign(message, mailInfo)
  mailgun.messages().send(message, callback)
}

function sendPayment (paymentCode, item, user, callback) {
  console.log('Sending payment mail', item.id, user.email)
  const message = {
    to: user.email,
    text: `
      Congratulations!\n
      You've won the auction for the item ${item.name}, follow this link
      to go through with the payment:
      ${path.join(config.uri, 'payments', paymentCode)}`
  }
  Object.assign(message, mailInfo)
  mailgun.messages().send(message, callback)
}
