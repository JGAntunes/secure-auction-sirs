const mailgun = require('mailgun-js')
const config = require('../../config')

module.exports = mailgun(config.mailgun)
