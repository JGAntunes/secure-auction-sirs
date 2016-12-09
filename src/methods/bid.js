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
  server.method('bid.getByValue', getByValue)
}

module.exports = register

function create (bid, callback) {
  sequelize.transaction((t) => {
    return Promise.all([
      // Can't bid if item belongs to user or value is lower than min
      Item.findOne({
        where: {
          $or: [
            { UserId: bid.UserId },
            { minValue: {$gte: bid.value} }
          ],
          id: bid.ItemId
        },
        transaction: t
      }),
      // Can't bid if value is lower than highest bid
      Bid.findOne({
        where: {
          ItemId: bid.ItemId,
          value: {$gte: bid.value}
        },
        transaction: t
      })
    ])
    .then((result) => {
      if (result[0]) throw new Error('Value lower than min or item belongs to user')
      if (result[1]) throw new Error('Value is lower than highest bid')
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

function getByValue (itemId, value, callback) {
  Bid.findOne({
    where: {
      ItemId: itemId,
      value: value
    },
    include: [
      {model: User, required: true},
      {model: Item, required: true}
    ]
  })
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
