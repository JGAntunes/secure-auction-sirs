const Boom = require('boom')
const log = require('../helpers/logger')
const Bid = require('../db/bid')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('bid.update', update)
  server.method('bid.create', create)
  server.method('bid.get', get)
  server.method('bid.list', list)
}

module.exports = register

function update (bidId, newBid, callback) {
  Bid.update(newBid, { where: {id: bidId}, return: true })
  .then(([affectedCount, affectedRows]) => {
    return affectedCount > 0
    ? callback(affectedRows[0].toJSON())
    : callback(Boom.notFound('bid not found'))
  })
  .catch((err) => {
    log.error({ err: err }, 'error updating bid')
    callback(Boom.internal())
  })
}

function create (bid, callback) {
  Bid.create(bid)
  .then(result => callback(result.toJSON()))
  .catch((err) => {
    log.error({ err: err }, 'error creating bid')
    callback(Boom.internal())
  })
}

function get (bidId, callback) {
  Bid.findById(bidId)
  .then((result) => {
    return result
      ? callback(result.toJSON())
      : callback(Boom.notFound('bid not found'))
  })
  .catch((err) => {
    log.error({ err: err }, 'error getting bid')
    callback(Boom.internal())
  })
}

function list (itemId, callback) {
  Bid.findAll({
    where: {
      ItemId: itemId
    }
  })
  .then(result => callback(null, result))
  .catch((err) => {
    log.error({ err: err }, 'error getting bid')
    callback(Boom.internal())
  })
}
