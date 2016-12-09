const Boom = require('boom')
const crypto = require('crypto')
const config = require('../../config')
const log = require('../helpers/logger')
const Payment = require('../db/payment')
const Bid = require('../db/bid')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('payment.create', create)
  server.method('payment.validate', validate)
  server.method('payment.remove', remove)
}

module.exports = register

function create (bidId, callback) {
  crypto.randomBytes(127, (err, buffer) => {
    if (err) return callback(err)
    const token = buffer.toString('hex')

    Payment.create({
      BidId: bidId,
      code: token
    })
    .then(result => callback(null, result.toJSON()))
    .catch((err) => {
      log.error(err, 'error creating payment token')
      callback(Boom.internal())
    })
  })
}

function validate (userId, token, callback) {
  const now = new Date()
  Payment.findOne({
    where: {
      code: token,
      createdAt: {$gt: new Date(now - config.paymentCode.ttl)},
      '$Bid.UserId': userId
    },
    include: [Bid]
  })
  .then((result) => {
    return result
      ? callback(null, result.toJSON())
      : callback(Boom.unauthorized('invalid payment token'))
  })
  .catch((err) => {
    log.error(err, 'error payment token')
    callback(Boom.internal())
  })
}

function remove (userId, token, callback) {
  Payment.destroy({
    where: {
      code: token,
      '$Bid.UserId': userId
    },
    include: [Bid]
  })
  .then(result => callback(null, result))
  .catch((err) => {
    log.error(err, 'error deleting payment token')
    callback(Boom.internal())
  })
}
