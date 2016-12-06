const Boom = require('boom')
const log = require('../helpers/logger')
const Bid = require('../db/bid')
const Item = require('../db/item')
const User = require('../db/user')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('bid.create', create)
  server.method('bid.get', get)
  server.method('bid.list', list)
}

module.exports = register

function create (bid, callback) {
  Bid.create(bid)
  .then(result => callback(null, result.toJSON()))
  .catch((err) => {
    log.error({ err: err }, 'error creating bid')
    callback(Boom.internal())
  })
}

function get (bidId, callback) {
  Bid.findById(bidId)
  .then((result) => {
    return result
      ? callback(null, result.toJSON())
      : callback(Boom.notFound('bid not found'))
  })
  .catch((err) => {
    log.error({ err: err }, 'error getting bid')
    callback(Boom.internal())
  })
}

function list (query, options = {}, callback = options) {
  const where = {}
  const include = []
  if (query.user) where.UserId = query.user
  if (query.item) where.ItemId = query.item
  if (options.user) include.push({ model: User, required: true })
  if (options.item) include.push({ model: Item, required: true })
  Bid.findAll({
    where,
    include
  })
  .then(result => callback(null, result))
  .catch((err) => {
    log.error({ err: err }, 'error getting bids')
    callback(Boom.internal())
  })
}
