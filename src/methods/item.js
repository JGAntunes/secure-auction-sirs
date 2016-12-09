const Boom = require('boom')
const config = require('../../config')
const log = require('../helpers/logger')
const sequelize = require('../helpers/db')
const Item = require('../db/item')
const Bid = require('../db/bid')
const User = require('../db/user')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('item.update', update)
  server.method('item.create', create)
  server.method('item.get', get)
  server.method('item.list', list)
  server.method('item.closeExpired', closeExpired)
  server.method('item.getWinners', getWinners)
}

module.exports = register

function update (itemId, newItem, callback) {
  Item.update(newItem, { where: {id: itemId}, return: true })
  .then(([affectedCount, affectedRows]) => {
    return affectedCount > 0
    ? callback(null, affectedRows[0].toJSON())
    : callback(Boom.notFound('item not found'))
  })
  .catch((err) => {
    log.error(err, 'error updating item')
    callback(Boom.internal())
  })
}

function create (item, callback) {
  Item.create(item)
  .then(result => callback(null, result.toJSON()))
  .catch((err) => {
    log.error(err, 'error creating item')
    callback(Boom.internal())
  })
}

function get (itemId, callback) {
  Item.findById(itemId)
  .then((result) => {
    return result
      ? callback(null, result.toJSON())
      : callback(Boom.notFound('item not found'))
  })
  .catch((err) => {
    log.error(err, 'error getting item')
    callback(Boom.internal())
  })
}

function list (callback) {
  Item.findAll()
  .then(result => callback(null, result))
  .catch((err) => {
    log.error(err, 'error getting item')
    callback(Boom.internal())
  })
}

function getWinners (callback) {
  Bid.findAll({
    group: ['Item.id'],
    attributes: [
      'Item.id', [sequelize.fn('MAX', sequelize.col('value')), 'max']
    ],
    where: {
      '$Item.closed$': true,
      '$Item.sentEmail$': false
    },
    include: [
      {model: Item, required: true, attributes: []}
    ],
    raw: true
  })
  .then(result => callback(null, result))
  .catch((err) => {
    log.error(err, 'error getting top bids')
    callback(Boom.internal())
  })
}

function closeExpired (callback) {
  const now = new Date()
  Item.update({ closed: true }, {
    where: {
      closed: false,
      createdAt: {$lt: new Date(now - config.auction.ttl)}
    },
    returning: true
  })
  .then(([affectedCount, affectedRows]) => {
    return affectedCount > 0
    ? callback(null, affectedRows.map(elem => elem.toJSON()))
    : callback()
  })
  .catch((err) => {
    log.error(err, 'error updating items')
    callback(Boom.internal())
  })
}
