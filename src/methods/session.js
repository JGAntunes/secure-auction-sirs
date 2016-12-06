const Boom = require('boom')
const crypto = require('crypto')
const config = require('../../config')
const log = require('../helpers/logger')
const Session = require('../db/session')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('session.create', create)
  server.method('session.validate', validate)
  server.method('session.remove', remove)
}

module.exports = register

function create (userId, callback) {
  crypto.randomBytes(127, (err, buffer) => {
    if (err) return callback(err)
    const token = buffer.toString('hex')

    Session.create({
      UserId: userId,
      token: token
    })
    .then(result => callback(null, result.toJSON()))
    .catch((err) => {
      log.error(err, 'error creating session token')
      callback(Boom.internal())
    })
  })
}

function validate (userId, token, callback) {
  const now = new Date()
  Session.findOne({
    where: {
      UserId: userId,
      token: token,
      createdAt: {$gt: new Date(now - config.sessions.ttl)}
    }
  })
  .then((result) => {
    return result
      ? callback(null, result.toJSON())
      : callback(Boom.unauthorized('invalid session token'))
  })
  .catch((err) => {
    log.error(err, 'error session token')
    callback(Boom.internal())
  })
}

function remove (userId, token, callback) {
  Session.destroy({
    where: {
      UserId: userId,
      token: token
    }
  })
  .then(result => callback(null, result))
  .catch((err) => {
    log.error(err, 'error deleting session token')
    callback(Boom.internal())
  })
}
