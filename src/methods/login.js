const Boom = require('boom')
const crypto = require('crypto')
const config = require('../../config')
const log = require('../helpers/logger')
const LoginCode = require('../db/loginCode')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('login.createCode', createCode)
  server.method('login.validateCode', validateCode)
}

module.exports = register

function createCode (userId, callback) {
  crypto.randomBytes(127, (err, buffer) => {
    if (err) return callback(err)
    const token = buffer.toString('hex')

    LoginCode.create({
      UserId: userId,
      code: token
    })
    .then(result => callback(null, result.toJSON()))
    .catch((err) => {
      log.error(err, 'error creating login code')
      callback(Boom.internal())
    })
  })
}

function validateCode (loginCode, callback) {
  const now = new Date()
  LoginCode.findOne({
    where: {
      code: loginCode,
      createdAt: {$gt: new Date(now - config.loginCodes.ttl * 60 * 1000)}
    }
  })
  .then((result) => {
    return result
      ? callback(null, result.toJSON())
      : callback(Boom.unauthorized('user not found'))
  })
  .catch((err) => {
    log.error(err, 'error getting login code')
    callback(Boom.internal())
  })
}
