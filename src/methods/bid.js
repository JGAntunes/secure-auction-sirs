const Boom = require('boom')
const sequelize = require('../helpers/db')
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
  sequelize.transaction((t) => {
    return Bid.findOne({
      where: {
        value: {$gte: bid.value}
      },
      transaction: t
    })
    .then((result) => {
      if (result) throw new Error('Value is smaller than highest bid')
      return Bid.create(bid, {transaction: t})
    })
  })
  .then(result => callback(null, result.toJSON()))
  .catch((err) => {
    log.error(err, 'error creating bid')
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
    log.error(err, 'error getting bid')
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
    include,
    order: 'value DESC'
  })
  .then(result => callback(null, result))
  .catch((err) => {
    log.error(err, 'error getting bids')
    callback(Boom.internal())
  })
}
